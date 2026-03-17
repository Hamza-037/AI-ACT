'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { OBLIGATION_CODES } from '@/types/shared.types'
import type { ActionResult, ObligationCode, StatutConformite } from '@/types/shared.types'

export type ChecklistItem = {
  id: string
  organization_id: string
  systeme_id: string | null
  obligation_code: ObligationCode
  statut: StatutConformite
  notes: string | null
  completed_at: string | null
  completed_by: string | null
}

export async function initChecklistOrg(organizationId: string): Promise<void> {
  const supabase = await createServerClient()
  const db = supabase as unknown as {
    from: (table: string) => {
      upsert: (data: unknown[], opts: unknown) => Promise<{ error: unknown }>
    }
  }
  const items = OBLIGATION_CODES.map((code) => ({
    organization_id: organizationId,
    obligation_code: code,
    statut: 'non_evalue',
    systeme_id: null,
    notes: null,
    completed_at: null,
    completed_by: null,
  }))
  await db.from('checklist_items').upsert(items, {
    onConflict: 'organization_id,obligation_code',
    ignoreDuplicates: true,
  })
}

export async function getChecklist(): Promise<ActionResult<ChecklistItem[]>> {
  const supabase = await createServerClient()
  const db = supabase as unknown as {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
    from: (table: string) => {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          single: () => Promise<{ data: unknown }>
          order: (col: string) => Promise<{ data: unknown[] | null; error: unknown }>
        }
      }
    }
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }
  const { data: profile } = await db.from('profiles').select('organization_id').eq('id', user.id).single() as { data: { organization_id: string | null } | null }
  if (!profile?.organization_id) return { success: false, error: 'Organisation introuvable' }
  const { data, error } = await db.from('checklist_items').select('*').eq('organization_id', profile.organization_id).order('obligation_code') as { data: ChecklistItem[] | null; error: unknown }
  if (error) return { success: false, error: 'Erreur lors de la recuperation' }
  return { success: true, data: data ?? [] }
}

export async function updateChecklistItem(
  id: string,
  statut: StatutConformite,
  notes?: string
): Promise<ActionResult<ChecklistItem>> {
  const supabase = await createServerClient()
  const db = supabase as unknown as {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
    from: (table: string) => {
      update: (data: unknown) => {
        eq: (col: string, val: string) => {
          select: (cols: string) => {
            single: () => Promise<{ data: unknown; error: unknown }>
          }
        }
      }
    }
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }
  const updateData: Record<string, unknown> = {
    statut,
    updated_at: new Date().toISOString(),
  }
  if (notes !== undefined) updateData.notes = notes
  if (statut === 'conforme') {
    updateData.completed_at = new Date().toISOString()
    updateData.completed_by = user.id
  }
  const { data, error } = await db.from('checklist_items').update(updateData).eq('id', id).select('*').single() as { data: ChecklistItem | null; error: unknown }
  if (error || !data) return { success: false, error: 'Erreur lors de la mise a jour' }
  revalidatePath('/dashboard/checklist')
  revalidatePath('/dashboard')
  return { success: true, data }
}
