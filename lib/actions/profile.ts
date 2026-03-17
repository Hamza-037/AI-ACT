'use server'

import { createServerClient } from '@/lib/supabase/server'
import { organizationSchema } from '@/lib/validations/organization'
import type { ActionResult, Profile } from '@/types/shared.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

export async function getProfile(): Promise<ActionResult<Profile>> {
  const supabase = await createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: AnyRecord | null; error: { message: string } | null }

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as unknown as Profile }
}

export async function updateOrganization(formData: FormData): Promise<ActionResult<void>> {
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

  const parsed = organizationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Validation échouée' }
  }

  const { error } = await db
    .from('organizations')
    .update(parsed.data)
    .eq('id', profile.organization_id) as { error: { message: string } | null }

  if (error) return { success: false, error: error.message }
  return { success: true, data: undefined }
}
