// server/api/user.put.ts
import { z } from 'zod'
import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const Body = z.object({
  name: z.string().min(1),
  phone: z.string().optional().default(''),
  address: z.string().optional().default(''), 
})

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { name, phone, address } = Body.parse(await readBody(event))

  const { data: upd, error: e1 } = await supabase.auth.updateUser({
    data: { name, phone, address: address },
  })
  if (e1) {
    throw createError({ statusCode: 400, statusMessage: e1.message })
  }

  // 2) Best-effort sync do public.profiles (když máš RLS policy "update own profile")
  const { data: profile, error: e2 } = await supabase
    .from('users')
    .upsert({ id: user.id, name, phone, address }, { onConflict: 'id' })
    .select('*')
    .single()

  if (e2) {
    console.warn('[profiles upsert] warning:', e2.message)
  }

  return { ok: true, user: upd?.user ?? null, profile }
})
