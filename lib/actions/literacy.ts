'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { ActionResult, LiteracyCompletion } from '@/types/shared.types'
import { LITERACY_MODULES } from '@/lib/literacy/modules'

// ---------------------------------------------------------------------------
// Schemas Zod
// ---------------------------------------------------------------------------

const completeModuleSchema = z.object({
  moduleId: z
    .string()
    .min(1)
    .refine(
      (id) => LITERACY_MODULES.some((m) => m.id === id),
      { message: 'Module introuvable' }
    ),
  score: z.number().int().min(0).max(100),
})

// ---------------------------------------------------------------------------
// Helpers DB type
// ---------------------------------------------------------------------------

type DbClient = {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
  from: (t: string) => {
    select: (c: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: unknown; error: unknown }>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any
      }
    }
    upsert: (data: unknown, opts?: unknown) => Promise<{ error: unknown }>
  }
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function completeModule(moduleId: string, score: number): Promise<ActionResult<void>> {
  // Validation Zod
  const parsed = completeModuleSchema.safeParse({ moduleId, score })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createServerClient()
  const db = supabase as unknown as DbClient

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const { data: profile } = await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single() as { data: { organization_id: string | null } | null; error: unknown }

  if (!profile?.organization_id) return { success: false, error: 'Organisation introuvable' }

  const { error } = await db.from('ai_literacy_completions').upsert({
    organization_id: profile.organization_id,
    profile_id: user.id,
    module_id: parsed.data.moduleId,
    completed_at: new Date().toISOString(),
    score: parsed.data.score,
  }, { onConflict: 'profile_id,module_id' })

  if (error) {
    console.error('completeModule error:', error)
    return { success: false, error: "Erreur lors de l'enregistrement" }
  }

  revalidatePath('/dashboard/literacy')
  revalidatePath('/dashboard')
  return { success: true, data: undefined }
}

export async function getMyCompletions(): Promise<ActionResult<LiteracyCompletion[]>> {
  const supabase = await createServerClient()
  const db = supabase as unknown as DbClient

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const queryResult = await db
    .from('ai_literacy_completions')
    .select('module_id, completed_at, score')
    .eq('profile_id', user.id) as unknown as { data: LiteracyCompletion[] | null; error: unknown }
  const { data, error } = queryResult

  if (error) {
    console.error('getMyCompletions error:', error)
    return { success: false, error: 'Erreur de lecture' }
  }

  return { success: true, data: data ?? [] }
}
