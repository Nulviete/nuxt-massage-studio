// server/api/events.get.ts
import { z } from 'zod'
import { getCalendarClient } from '../utils/gcal'
import { serverSupabaseUser } from '#supabase/server'

const Query = z.object({
  timeMin: z.string().optional(),
  timeMax: z.string().optional(),
  limit: z.coerce.number().min(1).max(2500).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event).catch(() => null)
    const { calendar, calendarId } = await getCalendarClient()
    const q = Query.parse(getQuery(event))

    const timeMin = q.timeMin ?? new Date(Date.now() - 7 * 24 * 3600e3).toISOString()
    const timeMax = q.timeMax ?? new Date(Date.now() + 60 * 24 * 3600e3).toISOString()
    const maxResults = q.limit ?? 500

    const res = await calendar.events.list({
      calendarId,
      singleEvents: true,
      orderBy: 'startTime',
      timeMin,
      timeMax,
      maxResults,
    })

    const items = (res.data.items ?? []).map((e) => {
      const start = e.start?.dateTime ?? e.start?.date
      const end = e.end?.dateTime ?? e.end?.date
      const allDay = Boolean(e.start?.date && !e.start?.dateTime)

      const priv = (e.extendedProperties as any)?.private || {}
      const isMine =
        !!user &&
        ((priv.user_id && priv.user_id === user.id) ||
         (priv.user_email && user.email && priv.user_email === user.email))

      return {
        id: e.id!,
        // viditelnost detailu: jen vlastník uvidí původní summary, jinak anonymně
        summary: isMine ? (e.summary ?? 'Rezervace') : 'Rezervováno',
        start,
        end,
        allDay,
        isMine,
        // jen vlastník dostane svůj e-mail (z extendedProperties nebo ze session jako fallback)
        email: isMine ? (priv.user_email ?? user?.email ?? null) : null,
        // (volitelně) description jen pro vlastníka:
        // description: isMine ? e.description ?? null : null,
      }
    })

    return { items }
  } catch (err: any) {
    console.error('[events.get] error:', err?.response?.data || err)
    setResponseStatus(event, Number(err?.code) || 500)
    return { items: [], error: err?.message || 'Server error' }
  }
})
