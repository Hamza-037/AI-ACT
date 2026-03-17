'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { OBLIGATION_CODES } from '@/types/shared.types'
import type { ActionResult, ChecklistItem, ObligationCode, StatutConformite } from '@/types/shared.types'

// ---------------------------------------------------------------------------
// Schemas Zod
// ---------------------------------------------------------------------------

const updateChecklistSchema = z.object({
  id: z.string().uuid('ID invalide'),
  statut: z.enum(['conforme', 'en_cours', 'non_conforme', 'non_evalue']),
  notes: z.string().max(5000).optional(),
})

// ---------------------------------------------------------------------------
// Helpers DB type
// ---------------------------------------------------------------------------

type DbClient = {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
  from: (table: string) => {
    select: (cols: string, opts?: unknown) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: unknown; error: unknown }>
        order: (col: string) => Promise<{ data: unknown[] | null; error: unknown }>
      }
    }
    upsert: (data: unknown[], opts: unknown) => Promise<{ error: unknown }>
    update: (data: unknown) => {
      eq: (col: string, val: string) => {
        select: (cols: string) => {
          single: () => Promise<{ data: unknown; error: unknown }>
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function initChecklistOrg(): Promise<void> {
  const supabase = await createServerClient()

  // Vérification auth — organizationId vient du profil authentifié, jamais du client
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const db = supabase as unknown as DbClient

  const { data: profile } = await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single() as { data: { organization_id: string | null } | null; error: unknown }

  if (!profile?.organization_id) return

  const organizationId = profile.organization_id

  const items = OBLIGATION_CODES.map((code: ObligationCode) => ({
    organization_id: organizationId,
    obligation_code: code,
    statut: 'non_evalue',
    systeme_id: null,
    notes: null,
    completed_at: null,
    completed_by: null,
  }))

  const { error } = await db.from('checklist_items').upsert(items, {
    onConflict: 'organization_id,obligation_code',
    ignoreDuplicates: true,
  })

  if (error) {
    console.error('initChecklistOrg error:', error)
  }
}

export async function getChecklist(): Promise<ActionResult<ChecklistItem[]>> {
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

  const { data, error } = await db
    .from('checklist_items')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('obligation_code') as { data: ChecklistItem[] | null; error: unknown }

  if (error) {
    console.error('getChecklist error:', error)
    return { success: false, error: 'Erreur lors de la recuperation' }
  }

  return { success: true, data: data ?? [] }
}

export async function updateChecklistItem(
  id: string,
  statut: StatutConformite,
  notes?: string
): Promise<ActionResult<ChecklistItem>> {
  // Validation Zod
  const parsed = updateChecklistSchema.safeParse({ id, statut, notes })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createServerClient()
  const db = supabase as unknown as DbClient

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  // Vérification d'autorisation : l'item doit appartenir à l'org de l'utilisateur
  const { data: profile } = await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single() as { data: { organization_id: string | null } | null; error: unknown }

  if (!profile?.organization_id) return { success: false, error: 'Organisation introuvable' }

  const { data: item } = await db
    .from('checklist_items')
    .select('organization_id')
    .eq('id', parsed.data.id)
    .single() as { data: { organization_id: string } | null; error: unknown }

  if (!item) return { success: false, error: 'Item introuvable' }
  if (item.organization_id !== profile.organization_id) {
    return { success: false, error: 'Acces interdit' }
  }

  const updateData: Record<string, unknown> = {
    statut: parsed.data.statut,
    updated_at: new Date().toISOString(),
  }
  if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes
  if (parsed.data.statut === 'conforme') {
    updateData.completed_at = new Date().toISOString()
    updateData.completed_by = user.id
  }

  const { data, error } = await db
    .from('checklist_items')
    .update(updateData)
    .eq('id', parsed.data.id)
    .select('*')
    .single() as { data: ChecklistItem | null; error: unknown }

  if (error || !data) {
    console.error('updateChecklistItem error:', error)
    return { success: false, error: 'Erreur lors de la mise a jour' }
  }

  revalidatePath('/dashboard/checklist')
  revalidatePath('/dashboard')
  return { success: true, data }
}
