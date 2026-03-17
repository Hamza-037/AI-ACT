'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types/shared.types'
import { LITERACY_MODULES, calculateAttestationEligibility } from '@/lib/literacy/modules'

export async function completeModule(moduleId: string, score: number): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const db = supabase as unknown as {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: string) => {
          single: () => Promise<{ data: unknown }>
        }
      }
      upsert: (data: unknown, opts?: unknown) => Promise<{ error: unknown }>
      select_completions?: unknown
    }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const { data: profile } = await db.from('profiles').select('organization_id').eq('id', user.id).single() as { data: { organization_id: string | null } | null }
  if (!profile?.organization_id) return { success: false, error: 'Organisation introuvable' }

  const { error } = await db.from('ai_literacy_completions').upsert({
    organization_id: profile.organization_id,
    profile_id: user.id,
    module_id: moduleId,
    completed_at: new Date().toISOString(),
    score,
  }, { onConflict: 'profile_id,module_id' })

  if (error) return { success: false, error: 'Erreur lors de l\'enregistrement' }

  revalidatePath('/dashboard/literacy')
  revalidatePath('/dashboard')
  return { success: true, data: undefined }
}

export async function getMyCompletions(): Promise<ActionResult<{ module_id: string; completed_at: string | null; score: number | null }[]>> {
  const supabase = await createServerClient()
  const db = supabase as unknown as {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: string) => Promise<{ data: unknown[] | null; error: unknown }>
      }
    }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const { data, error } = await db.from('ai_literacy_completions').select('module_id, completed_at, score').eq('profile_id', user.id) as { data: { module_id: string; completed_at: string | null; score: number | null }[] | null; error: unknown }
  if (error) return { success: false, error: 'Erreur de lecture' }

  return { success: true, data: data ?? [] }
}
