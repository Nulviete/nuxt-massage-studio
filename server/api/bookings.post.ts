// server/api/bookings.post.ts
import { z } from "zod";
import { createError } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { getCalendarClient, overlap } from "../utils/gcal";

const Body = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  start: z.string(), 
  serviceIds: z
    .array(z.number().int().positive())
    .nonempty("Vyber aspoň jednu službu"),
});

const TRAVEL_MIN = 30;

export default defineEventHandler(async (event) => {
  try {
    const { calendar, calendarId, timezone } = await getCalendarClient();
    if (!calendarId)
      throw createError({
        statusCode: 500,
        statusMessage: "Missing GCAL_CALENDAR_ID",
      });

    const user = await serverSupabaseUser(event).catch(() => null);
    const body = Body.parse(await readBody(event));

    const start = new Date(body.start);
    if (isNaN(+start))
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid start datetime",
      });

    const supa = await serverSupabaseClient(event);

    const { data: svcs, error } = await supa
      .from("services")
      .select("id,name,duration_min,price,is_active")
      .in("id", body.serviceIds)
      .eq("is_active", true);

    if (error)
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to load services",
      });
    if (!svcs || svcs.length === 0)
      throw createError({ statusCode: 400, statusMessage: "Unknown services" });

    // 2) Spočítej celkový čas
    const services = svcs.map((s) => ({
      id: Number(s.id),
      name: String(s.name),
      duration_min: Number(s.duration_min ?? 0),
      price: s.price == null ? null : Number(s.price),
    }));

    const totalServicesMin = services.reduce(
      (a, s) => a + (s.duration_min || 0),
      0
    );

    const totalServicesPrice = services.reduce((a, s) => a + (s.price ?? 0), 0);


    const totalMin = totalServicesMin + TRAVEL_MIN;
    const end = new Date(start.getTime() + totalMin * 60_000);

    // 3) Kolize
    const { overlaps, busy } = await overlap(start, end, calendarId);

    if (overlaps) {
      setResponseStatus(event, 409);
      return { ok: false, message: "Termín je obsazený", busy };
    }

    // 4) Popisky
    const summary = `Rezervace: ${body.name}`;
    const fmtPLN = new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    });

    const descriptionLines = [
      "Wybrane usługi:",
      ...services.map(
        (s) =>
          `• ${s.name} — ${s.duration_min} min${
            s.price != null ? ` — ${fmtPLN.format(s.price)}` : ""
          }`
      ),
      // `Dojazd: ${TRAVEL_MIN} min`,
      body.notes ? `Uwagi: ${body.notes}` : null,
      `Celková cena = ${totalServicesPrice} PLN`
    ].filter(Boolean) as string[];

    const description = descriptionLines.join("\n");

    // 5) extendedProperties (pro vlastnictví + audit)
    const priv: Record<string, string> = {
      total_min: String(totalMin),
      travel_min: String(TRAVEL_MIN),
      service_ids: services.map((s) => s.id).join(","),
      service_names: services.map((s) => s.name).join(", "),
    };
    if (user?.id) priv.user_id = user.id;
    if (user?.email) priv.user_email = user.email;

    // 6) Vlož event
    const insert = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary,
        description,
        start: { dateTime: start.toISOString(), timeZone: timezone },
        end: { dateTime: end.toISOString(), timeZone: timezone },
        guestsCanSeeOtherGuests: true,
        extendedProperties: { private: priv },
      },
      sendUpdates: "none",
    });

    return { ok: true, id: insert.data.id, totalMin };
  } catch (err: any) {
    console.error("[bookings.post] error:", err?.response?.data || err);
    setResponseStatus(event, Number(err?.code) || 500);
    return { ok: false, message: err?.message || "Server error" };
  }
});
