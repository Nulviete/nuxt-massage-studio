// server/utils/gcal.ts
// Jen-env varianta: čte výhradně GCAL_SERVICE_ACCOUNT_KEY_B64 z .env/runtimeConfig

import { google, calendar_v3 } from 'googleapis'
import { GoogleAuth, JWTInput } from 'google-auth-library'
import { createError } from 'h3'
import { useRuntimeConfig } from '#imports'

type CalendarBundle = {
  calendar: calendar_v3.Calendar
  calendarId: string
  timezone: string
}

let _calendar: calendar_v3.Calendar | null = null

// function logDebug(msg: string, extra?: unknown) {
//   const cfg = useRuntimeConfig()
//   const dbg = (cfg as any).GCAL_DEBUG ?? process.env.GCAL_DEBUG ?? '0'
//   if (dbg?.toString() === '1') console.log(`[GCAL] ${msg}`, extra ?? '')
// }

function readCalendarId(): string {
  const cfg = useRuntimeConfig()
  return (cfg as any).GCAL_CALENDAR_ID || process.env.GCAL_CALENDAR_ID || ''
}

function readTimezone(): string {
  const cfg = useRuntimeConfig()
  return (cfg as any).GCAL_TIMEZONE || process.env.GCAL_TIMEZONE || 'Europe/Warsaw'
}

/** Vždy vrací klienta z .env (GCAL_SERVICE_ACCOUNT_KEY_B64). */
export async function getCalendarClient(): Promise<CalendarBundle> {
  if (_calendar) {
    return { calendar: _calendar, calendarId: readCalendarId(), timezone: readTimezone() }
  }

  const cfg = useRuntimeConfig()
  const b64 =
    (cfg as any).GCAL_SERVICE_ACCOUNT_KEY_B64 ||
    process.env.GCAL_SERVICE_ACCOUNT_KEY_B64

  if (!b64) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GCAL_SERVICE_ACCOUNT_KEY_B64 is not set.',
    })
  }

  try {
    // Podpora i pro případ, že by byl omylem vložen čistý JSON
    const trimmed = b64.trim()
    const jsonText = trimmed.startsWith('{')
      ? trimmed
      : Buffer.from(trimmed.replace(/\s/g, ''), 'base64').toString('utf8')

    const credentials: JWTInput = JSON.parse(jsonText)

    // převést escapované \n v private_key na reálné konce řádků
    if (credentials.private_key && typeof credentials.private_key === 'string') {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
    }

    const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/calendar'], credentials })
    _calendar = google.calendar({ version: 'v3', auth })
    // logDebug('Google Calendar client initialized from .env Base64.')

    return { calendar: _calendar, calendarId: readCalendarId(), timezone: readTimezone() }
  } catch (e: any) {
    console.error('[GCAL] Init failed:', e?.message || e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to init Google Calendar client from GCAL_SERVICE_ACCOUNT_KEY_B64.',
    })
  }
}

/** Helpery (používají je tvé API routy) */
export function getCalendarId(): string {
  return readCalendarId()
}
export function getCalendarTimezone(): string {
  return readTimezone()
}

/** Překryv událostí pomocí freebusy.query */
export async function overlap(
  start: string | Date,
  end: string | Date,
  calendarId?: string
): Promise<{ overlaps: boolean; busy: Array<{ start: string; end: string }> }> {
  const { calendar } = await getCalendarClient()
  const id = calendarId || readCalendarId()
  if (!id) {
    throw createError({ statusCode: 500, statusMessage: 'GCAL_CALENDAR_ID is not set.' })
  }

  const timeMin = (start instanceof Date ? start : new Date(start)).toISOString()
  const timeMax = (end instanceof Date ? end : new Date(end)).toISOString()

  // logDebug('FreeBusy query', { id, timeMin, timeMax })

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: readTimezone(),
      items: [{ id }],
    },
  })

  const calendars = (res.data as any)?.calendars
  const busy = calendars?.[id]?.busy ?? []

  // logDebug('FreeBusy response', busy)

  return {
    overlaps: Array.isArray(busy) && busy.length > 0,
    busy,
  }
}
