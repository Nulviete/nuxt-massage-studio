// server/api/my-events.get.ts
import { z } from 'zod'
import { createError } from 'h3'
import { getCalendarClient } from '../utils/gcal'
import { serverSupabaseUser } from '#supabase/server'

const Query = z.object({
  timeMin: z.string().optional(),   // ISO
  timeMax: z.string().optional(),   // ISO
  limit:   z.coerce.number().min(1).max(2500).optional()
})

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { calendar, calendarId } = await getCalendarClient()
  if (!calendarId) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GCAL_CALENDAR_ID' })
  }

  const q = Query.parse(getQuery(event))
  const timeMin = q.timeMin ?? new Date(Date.now() - 7*24*3600e3).toISOString() // default poslední týden
  const timeMax = q.timeMax ?? new Date(Date.now() + 60*24*3600e3).toISOString() // default 60 dní dopředu
  const maxResults = q.limit ?? 250

  const res = await calendar.events.list({
    calendarId,
    singleEvents: true,
    orderBy: 'startTime',
    timeMin,
    timeMax,
    maxResults,
    // kouzlo je tady:
    privateExtendedProperty: `user_id=${user.id}`
  })

  const items = (res.data.items ?? []).map((e) => ({
    id: e.id,
    summary: e.summary,
    description: e.description,
    start: e.start?.dateTime ?? e.start?.date,
    end: e.end?.dateTime ?? e.end?.date,
    status: e.status,
    htmlLink: e.htmlLink
  }))

  return { items }
})
