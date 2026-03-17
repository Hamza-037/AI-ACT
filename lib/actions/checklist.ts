'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types/shared.types'

export async function updateChecklistItem(
  itemId: string,
  statut: 'conforme' | 'en_cours' | 'non_conforme' | 'non_evalue',
  notes?: string
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { error } = await db
    .from('checklist_items')
    .update({
      statut,
      notes: notes ?? null,
      completed_at: statut === 'conforme' ? new Date().toISOString() : null,
      completed_by: statut === 'conforme' ? user.id : null,
    })
    .eq('id', itemId) as { error: { message: string } | null }

  if (error) return { success: false, error: error.message }
  return { success: true, data: undefined }
}
