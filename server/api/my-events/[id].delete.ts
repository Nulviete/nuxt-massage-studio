// server/api/my-events/[id].delete.ts
import { createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { getCalendarClient } from '../../utils/gcal' // dvě úrovně nahoru

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing event id' })
  }

  const { calendar, calendarId, timezone } = await getCalendarClient()
  if (!calendarId) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GCAL_CALENDAR_ID' })
  }

  // 1) Načti událost a ověř vlastnictví (extendedProperties.private)
  let ev
  try {
    const res = await calendar.events.get({ calendarId, eventId: id })
    ev = res.data
  } catch (e: any) {
    if (String(e?.code) === '404') {
      throw createError({ statusCode: 404, statusMessage: 'Event not found' })
    }
    throw createError({ statusCode: Number(e?.code) || 500, statusMessage: e?.message || 'Failed to read event' })
  }

  const priv = (ev as any)?.extendedProperties?.private || {}
  const isOwner =
    (priv.user_id && priv.user_id === user.id) ||
    (user.email && priv.user_email && priv.user_email === user.email)

  if (!isOwner) {
    throw createError({ statusCode: 403, statusMessage: 'You can delete only your own events.' })
  }

  // 2) Smazání (sendUpdates: 'none' = bez emailů; změň na 'all' pokud chceš notifikace)
  try {
    await calendar.events.delete({
      calendarId,
      eventId: id,
      sendUpdates: 'none',
    })
    return { ok: true, id, timezone }
  } catch (e: any) {
    throw createError({ statusCode: Number(e?.code) || 500, statusMessage: e?.message || 'Delete failed' })
  }
})
