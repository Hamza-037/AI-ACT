'use server'

import { createServerClient } from '@/lib/supabase/server'
import { systemeIASchema } from '@/lib/validations/systeme'
import type { ActionResult, SystemeIA } from '@/types/shared.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

export async function creerSysteme(formData: FormData): Promise<ActionResult<SystemeIA>> {
  const supabase = await createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { data: profile } = await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single() as { data: AnyRecord | null }

  if (!profile?.organization_id) return { success: false, error: 'Organisation non trouvée' }

  const parsed = systemeIASchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Validation échouée' }
  }

  const { data, error } = await db
    .from('systemes_ia')
    .insert({ ...parsed.data, organization_id: profile.organization_id })
    .select()
    .single() as { data: AnyRecord | null; error: { message: string } | null }

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as unknown as SystemeIA }
}

export async function listerSystemes(): Promise<ActionResult<SystemeIA[]>> {
  const supabase = await createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const { data, error } = await db
    .from('systemes_ia')
    .select('*')
    .order('created_at', { ascending: false }) as { data: AnyRecord[] | null; error: { message: string } | null }

  if (error) return { success: false, error: error.message }
  return { success: true, data: (data ?? []) as unknown as SystemeIA[] }
}
