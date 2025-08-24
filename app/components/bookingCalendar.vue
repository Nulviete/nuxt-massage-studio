<script setup lang="ts">
import { shallowRef, ref, watch, onMounted, computed } from "vue";
import { CalendarDate, today } from "@internationalized/date";

const TZ = 'Europe/Warsaw'

const two = (n: number) => String(n).padStart(2, '0')

const initialDayStr = useState('initDay', () => {
  const cd = today(TZ).add({ days: 1 })
  return `${cd.year}-${two(cd.month)}-${two(cd.day)}` // "YYYY-MM-DD"
})

const fromYMD = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new CalendarDate(y, m, d)
}
const toJSDateYMD = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// ---- PL locale helpers ----
const fmtTime = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TZ
});
const fmtDate = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: TZ
});
const fmtDateTime = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TZ
});
const fmtPLN = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

// + pod tvoje importy/helpery
function formatCD(cd: CalendarDate) {
  return `${two(cd.day)}.${two(cd.month)}.${cd.year}`
}

const timePL = (d: Date) => fmtTime.format(d);
const dateTimePL = (d: Date) => fmtDateTime.format(d);
const pln = (amount?: number | null) =>
  (amount ?? null) === null ? "" : fmtPLN.format(Number(amount));

const toCalendarDate = (d: Date) =>
  new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
const toDate = (cd: { year: number; month: number; day: number }) =>
  new Date(cd.year, cd.month - 1, cd.day);

const tmr = new Date();
tmr.setDate(tmr.getDate() + 1);

const {
  public: { apiBase },
} = useRuntimeConfig();
const props = defineProps(["user"]);

// model kalendáře
const modelValue = shallowRef<CalendarDate>(fromYMD(initialDayStr.value));
const selectedDate = ref<Date>(toJSDateYMD(initialDayStr.value));
// === DATA ===
// typ eventu, jak ho vrací /api/events (viz dřívější endpoint)
type EvItem = {
  id: string;
  summary: string;
  start: string;
  end: string;
  allDay: boolean;
  isMine?: boolean;
  email?: string | null;
};

const eventsByDate = ref<Record<string, EvItem[]>>({});

type Service = {
  id: number;
  name: string;
  duration_min: number;
  price: number | null;
};

const services = ref<Service[]>([]);
const selectedServiceIds = ref<number[]>([]);
const TRAVEL_MIN = 30;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;
const SLOT_STEP_MIN = 30;


const loading = ref(false);
const deletingId = ref<string | null>(null);

const MIN_LEAD_HOURS = 18;

const nowIso = useState('nowIso', () => new Date().toISOString())

function isTooSoon(start: Date) {
  const now = new Date(nowIso.value);
  return start.getTime() < now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const minSelectableDate = startOfDay(toJSDateYMD(initialDayStr.value))

const tomorrowStart = computed(() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
});

async function cancelMyBooking(s: { eventId?: string; my?: boolean }) {
  if (!s?.my || !s?.eventId) return;
  if (!window.confirm("Opravdu zrušit tuto rezervaci?")) return;

  deletingId.value = s.eventId;
  try {
    await $fetch(`${apiBase}/api/my-events/${s.eventId}`, { method: "DELETE" });
    await loadEvents();
  } catch (e) {
    console.error(e);
  } finally {
    deletingId.value = null;
  }
}

function isoKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthRangeAround(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

async function loadEvents() {
  loading.value = true;
  try {
    const { timeMin, timeMax } = monthRangeAround(selectedDate.value);
    const res = await $fetch<{ items: EvItem[] }>(`${apiBase}/api/events`, {
      params: { timeMin, timeMax },
    });

    const map: Record<string, EvItem[]> = {};
    for (const e of res.items || []) {
      const s = new Date(e.start);
      const eend = new Date(e.end);
      for (
        let d = new Date(s.getFullYear(), s.getMonth(), s.getDate());
        d <=
        new Date(
          eend.getFullYear(),
          eend.getMonth(),
          eend.getDate() - (e.allDay ? 1 : 0)
        );
        d.setDate(d.getDate() + 1)
      ) {
        const key = isoKey(d);
        if (!map[key]) map[key] = [];
        map[key].push(e);
      }
    }
    eventsByDate.value = map;
  } finally {
    loading.value = false;
  }
}

function hasFreeSlotOnDate(date: Date) {
  if (totalDurationMin.value === 0) return false;
  // if (isWeekend(date)) return false

  const dayKey = isoKey(date);
  const dayEvs = eventsByDate.value[dayKey] || [];
  const lastStart = CLOSE_HOUR * 60 - totalDurationMin.value;

  for (let m = OPEN_HOUR * 60; m <= lastStart; m += SLOT_STEP_MIN) {
    const h = Math.floor(m / 60),
      min = m % 60;
    const slotStart = makeDateAt(date, h, min);
    const slotEnd = endFor(slotStart);

    if (isTooSoon(slotStart)) continue;

    const overlaps = dayEvs.some((e) => {
      const s = new Date(e.start);
      const ee = new Date(e.end);
      return isOverlapping(slotStart, slotEnd, s, ee);
    });
    if (!overlaps) return true;
  }
  return false;
}

function getColorByDate(date: Date) {
  if (selectedServiceIds.value.length === 0) return undefined;
  if (startOfDay(date) < minSelectableDate) return undefined;
  // if (isWeekend(date)) return undefined
  return hasFreeSlotOnDate(date) ? "success" : "error";
}

// změna dne
watch(modelValue, (val) => {
  const d = toDate(val)
  if (selectedDate.value.toDateString() !== d.toDateString()) {
    selectedDate.value = d
  }
});

watch(selectedDate, (d) => {
  const cd = toCalendarDate(d);
  const cur = modelValue.value;
  if (cur.year !== cd.year || cur.month !== cd.month || cur.day !== cd.day) {
    modelValue.value = cd;
  }
});

onMounted(async () => {
  const supabase = useSupabaseClient();
  const { data } = await supabase
    .from("services")
    .select("id,name,duration_min,price")
    .eq("is_active", true);
  services.value = (data ?? []).map((s: any) => ({
    id: Number(s.id),
    name: String(s.name),
    duration_min: Number(s.duration_min ?? 0),
    price: s.price == null ? null : Number(s.price),
  }));

  loadEvents();
});

const totalDurationMin = computed(() => {
  if (selectedServiceIds.value.length === 0) return 0;
  const srvMin = selectedServiceIds.value.reduce((sum, id) => {
    const svc = services.value.find((s) => s.id === id);
    return sum + (svc?.duration_min ?? 0);
  }, 0);
  return srvMin + TRAVEL_MIN;
});

function endFor(start: Date) {
  return new Date(start.getTime() + totalDurationMin.value * 60_000);
}

const endPreview = computed(() => {
  if (!modalSlot.value) return null;
  return new Date(
    modalSlot.value.start.getTime() + totalDurationMin.value * 60_000
  );
});

function makeDateAt(date: Date, h: number, m = 0) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    h,
    m,
    0,
    0
  );
}

// --- zákaz víkendů ---
function isWeekend(d: Date) {
  const day = d.getDay(); // 0=Ne, 6=So
  return day === 0 || day === 6;
}

function isOverlapping(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

const dayEvents = computed(
  () => eventsByDate.value[isoKey(selectedDate.value)] || []
);

// ⬇⬇⬇ Reintroduce detail o kolidujícím eventu (moje/jméno/eventId)
const slots = computed(() => {
  const out: {
    start: Date;
    end: Date;
    booked: boolean;
    title?: string;
    my?: boolean;
    email?: string | null;
    eventId?: string;
    tooSoon?: boolean;
  }[] = [];

  if (totalDurationMin.value === 0) return out;
  // if (isWeekend(selectedDate.value)) return out

  const dayEvs = dayEvents.value as EvItem[];
  const lastStart = CLOSE_HOUR * 60 - totalDurationMin.value;

  for (let m = OPEN_HOUR * 60; m <= lastStart; m += SLOT_STEP_MIN) {
    const h = Math.floor(m / 60),
      min = m % 60;
    const start = makeDateAt(selectedDate.value, h, min);
    const end = endFor(start);

    const ev = dayEvs.find((e) => {
      const s = new Date(e.start);
      const ee = new Date(e.end);
      return isOverlapping(start, end, s, ee);
    });

    
    const tooSoon = isTooSoon(start);

    out.push({
      start,
      end,
      booked: !!ev,
      title: ev?.summary,
      my: ev?.isMine === true,
      email: ev?.email ?? null,
      eventId: ev?.id,
      tooSoon,
    });
  }
  return out;
});

// --- Rezervační modal ---
const showModal = ref(false);
const modalSlot = ref<{ start: Date; end: Date } | null>(null);
const form = ref({
  name: props.user.user_metadata.name || "",
  email: props.user.email,
  notes: "",
  phone: props.user.user_metadata.phone || "",
  address: props.user.user_metadata.address || "",
});
const submitting = ref(false);

function openBooking(slot: { start: Date; end: Date }) {
  modalSlot.value = slot;
  showModal.value = true;
}

async function submitBooking() {
  if (!modalSlot.value) return;
  if (selectedServiceIds.value.length === 0) {
    alert("Vyberte prosím alespoň jednu službu.");
    return;
  }
  submitting.value = true;
  try {
    await $fetch(`${apiBase}/api/bookings`, {
      method: "POST",
      body: {
        name: form.value.name,
        email: form.value.email || undefined,
        notes: form.value.notes || undefined,
        start: modalSlot.value.start.toISOString(),
        serviceIds: selectedServiceIds.value,
      },
    });
    showModal.value = false;
    await loadEvents();
  } finally {
    submitting.value = false;
  }
}

function isTodayCD(cd: { year: number; month: number; day: number }) {
  const t = new Date();
  return (
    cd.year === t.getFullYear() &&
    cd.month === t.getMonth() + 1 &&
    cd.day === t.getDate()
  );
}

function isOutsideMonthCD(
  cd: { year: number; month: number },
  view = modelValue.value
) {
  // mimo právě zobrazovaný měsíc
  return cd.month !== view.month || cd.year !== view.year;
}

// (volitelné) jen PRÁVĚ příští měsíc, kdybys chtěl jinou barvu než pro minulý:
function isNextMonthCD(
  cd: { year: number; month: number },
  view = modelValue.value
) {
  let m = view.month + 1,
    y = view.year;
  if (m > 12) {
    m = 1;
    y++;
  }
  return cd.month === m && cd.year === y;
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4 space-y-4">
    <!-- Výběr služeb -->
    <div class="max-w-2xl mx-auto p-4 space-y-2">
      <h3 class="text-lg font-medium">Vyberte služby</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <UCheckbox
          v-for="s in services"
          :key="s.id"
          :label="`${s.name} — ${s.duration_min} min${
            s.price != null ? `, ${pln(s.price)}` : ''
          }`"
          :ui="{ label: 'text-black' }"
          :model-value="selectedServiceIds.includes(s.id)"
          @update:model-value="
            (val) => {
              if (val && !selectedServiceIds.includes(s.id))
                selectedServiceIds.push(s.id);
              if (!val)
                selectedServiceIds.splice(selectedServiceIds.indexOf(s.id), 1);
            }
          "
        />
      </div>

      <div class="text-sm text-gray-700">
        <template v-if="selectedServiceIds.length === 0">
          Vyberte prosím aspoň jednu službu – kalendář zobrazí volné termíny pro
          danou délku.
        </template>
      </div>
    </div>

    <UCalendar
      v-model="modelValue"
      :disabled="loading"
      :year-controls="false"
      :weekStartsOn="0"
      size="md"
      weekdayFormat="short"
      color="success"
      :ui="{
        headCell: 'text-black',
        header: 'bg-[#A2500C] rounded',
        heading: 'text-white',
      }"
      :fixedWeeks="false"
    >
      <template #day="{ day }">
        <UChip
          :show="!!getColorByDate(day.toDate())"
          :color="getColorByDate(day.toDate())"
          size="2xs"
        >
          <span
            :class="[
              isTodayCD(day) ? 'text-white font-semibold' : '',
              // pokud chceš stejnou barvu pro oba „outside“ měsíce:
              isOutsideMonthCD(day) ? 'text-gray-300' : 'text-black',
              // nebo odlišíš příští měsíc:
              // isNextMonthCD(day) ? 'text-amber-600' : ''
            ]"
          >
            {{ day.day }}
          </span>
        </UChip>
      </template>
    </UCalendar>

    <div class="pt-4">
      <h3 class="text-lg font-medium">
        Dostupné sloty dla {{ formatCD(modelValue) }}
      </h3>
      <div class="grid gap-2 mt-2">
        <UCard
          v-for="(s, i) in slots"
          :key="i"
          class="flex flex-col justify-between bg-green-800"
        >
          <div class="flex items-center text-xl justify-between">
            <span class="text-white">{{ timePL(s.start) }}</span>
            <UBadge
              v-if="!s.my"
              :color="s.booked ? 'error' : s.tooSoon ? 'gray' : 'success'"
            >
              {{
                s.booked
                  ? "Obsazeno"
                  : s.tooSoon
                  ? "Nelze rezervovat (<18 h)"
                  : "Volné"
              }}
            </UBadge>
          </div>

          <div
            v-if="s.booked && s.my"
            class="mt-2 flex items-center justify-between gap-2"
          >
            <div class="text-xs text-green-200 truncate" :title="s.title">
              {{ s.title }}
            </div>
            <UButton
              size="xs"
              color="error"
              variant="solid"
              :loading="deletingId === s.eventId"
              :disabled="deletingId === s.eventId"
              @click="cancelMyBooking(s)"
            >
              Zrušit rezervaci
            </UButton>
          </div>

          <div
            v-else-if="s.booked"
            class="text-xs opacity-70 mt-1 truncate text-gray-200"
          >
            Already Reserved
          </div>

          <!-- volné, ale příliš brzy -> bez tlačítka -->
          <div
            v-else-if="s.tooSoon"
            class="text-xs opacity-70 mt-1 text-gray-300"
          >
            Rezervace nejdříve 18 h předem
          </div>

          <!-- volné a možné rezervovat -->
          <UButton
            v-else
            class="mt-2"
            :disabled="selectedServiceIds.length === 0"
            @click="openBooking(s)"
          >
            Rezervovat
          </UButton>
        </UCard>
      </div>
    </div>

    <!-- MODAL -->
    <UModal
      v-model:open="showModal"
      title="Potvrdit rezervaci"
      description="Vyplňte prosím údaje a potvrďte rezervaci."
    >
      <template #content>
        <UCard>
          <form @submit.prevent="submitBooking">
            <div class="space-y-3">
              <div class="space-y-1">
                <label class="text-sm font-medium" for="booking-name"
                  >Jméno<span class="text-red-500">*</span></label
                >
                <UInput
                  id="booking-name"
                  v-model="form.name"
                  placeholder="Tvoje jméno"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium" for="booking-email"
                  >E-mail<span class="text-red-500">*</span></label
                >
                <UInput id="booking-email" v-model="form.email" required />
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium" for="booking-phone"
                  >Telefon<span class="text-red-500">*</span></label
                >
                <UInput id="booking-phone" v-model="form.phone" required />
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium" for="booking-address"
                  >Address<span class="text-red-500">*</span></label
                >
                <UInput id="booking-address" v-model="form.address" required />
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium" for="booking-notes"
                  >Poznámka</label
                >
                <UTextarea
                  id="booking-notes"
                  v-model="form.notes"
                  placeholder="Volitelné"
                />
              </div>

              <div class="text-sm opacity-70">
                Termín: {{ dateTimePL(modalSlot!.start) }} –
                {{ dateTimePL(modalSlot!.end ?? modalSlot!.start) }}
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Služby</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <UCheckbox
                  v-for="s in services"
                  :key="s.id"
                  :label="`${s.name} — ${s.duration_min} min${
                    s.price ? `, ${pln(s.price)}` : ''
                  }`"
                  :model-value="selectedServiceIds.includes(s.id)"
                  @update:model-value="
                    (val) => {
                      if (val && !selectedServiceIds.includes(s.id))
                        selectedServiceIds.push(s.id);
                      if (!val)
                        selectedServiceIds.splice(
                          selectedServiceIds.indexOf(s.id),
                          1
                        );
                    }
                  "
                />
              </div>

              <div class="text-sm mt-2">
                Celkem: <strong>{{ totalDurationMin }}</strong> min (včetně
                {{ TRAVEL_MIN }} min cesta)
                <span v-if="endPreview">
                  • Konec: {{ timePL(endPreview) }}</span
                >
              </div>
            </div>

            <div class="flex gap-2 justify-end mt-4">
              <UButton variant="soft" type="button" @click="showModal = false"
                >Zrušit</UButton
              >
              <UButton
                :loading="submitting"
                :disabled="!form.name"
                type="submit"
                >Odeslat</UButton
              >
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
