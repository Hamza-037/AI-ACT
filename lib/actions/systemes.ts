'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { createSystemeSchema } from '@/lib/validations/systeme'
import { classifierSysteme } from '@/lib/utils/classifier'
import type { ActionResult, SystemeIA } from '@/types/shared.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

async function getAuthContext() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' as const, supabase, user: null, orgId: null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { data: profile } = (await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()) as { data: AnyRecord | null }

  if (!profile?.organization_id)
    return { error: 'Organisation non trouvée' as const, supabase, user: null, orgId: null }

  return { error: null, supabase, user, orgId: profile.organization_id as string }
}

export async function getSystems(): Promise<ActionResult<SystemeIA[]>> {
  const { error, supabase, orgId } = await getAuthContext()
  if (error) return { success: false, error }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { data, error: dbError } = (await db
    .from('systemes_ia')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })) as {
    data: AnyRecord[] | null
    error: { message: string } | null
  }

  if (dbError) return { success: false, error: dbError.message }
  return { success: true, data: (data ?? []) as unknown as SystemeIA[] }
}

export async function getSystemById(id: string): Promise<ActionResult<SystemeIA>> {
  const { error, supabase, orgId } = await getAuthContext()
  if (error) return { success: false, error }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { data, error: dbError } = (await db
    .from('systemes_ia')
    .select('*')
    .eq('id', id)
    .eq('organization_id', orgId)
    .single()) as { data: AnyRecord | null; error: { message: string } | null }

  if (dbError) return { success: false, error: dbError.message }
  if (!data) return { success: false, error: 'Système introuvable' }
  return { success: true, data: data as unknown as SystemeIA }
}

export async function createSystem(formData: unknown): Promise<ActionResult<SystemeIA>> {
  const { error, supabase, orgId } = await getAuthContext()
  if (error) return { success: false, error }

  const parsed = createSystemeSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Validation échouée' }
  }

  const { decisions_autonomes, nom, fournisseur, usage, departement, notes } = parsed.data
  const niveau_risque = classifierSysteme({
    nom,
    fournisseur: fournisseur ?? null,
    usage: usage ?? null,
    departement: departement ?? null,
    decisions_autonomes,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { data, error: dbError } = (await db
    .from('systemes_ia')
    .insert({
      nom,
      fournisseur: fournisseur ?? null,
      usage: usage ?? null,
      departement: departement ?? null,
      decisions_autonomes,
      notes: notes ?? null,
      niveau_risque,
      organization_id: orgId,
    })
    .select()
    .single()) as { data: AnyRecord | null; error: { message: string } | null }

  if (dbError) return { success: false, error: dbError.message }

  revalidatePath('/dashboard/registre')
  return { success: true, data: data as unknown as SystemeIA }
}

export async function updateSystem(
  id: string,
  formData: unknown
): Promise<ActionResult<SystemeIA>> {
  const { error, supabase, orgId } = await getAuthContext()
  if (error) return { success: false, error }

  const parsed = createSystemeSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Validation échouée' }
  }

  const { decisions_autonomes, nom, fournisseur, usage, departement, notes } = parsed.data
  const niveau_risque = classifierSysteme({
    nom,
    fournisseur: fournisseur ?? null,
    usage: usage ?? null,
    departement: departement ?? null,
    decisions_autonomes,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { data, error: dbError } = (await db
    .from('systemes_ia')
    .update({
      nom,
      fournisseur: fournisseur ?? null,
      usage: usage ?? null,
      departement: departement ?? null,
      decisions_autonomes,
      notes: notes ?? null,
      niveau_risque,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', orgId)
    .select()
    .single()) as { data: AnyRecord | null; error: { message: string } | null }

  if (dbError) return { success: false, error: dbError.message }

  revalidatePath('/dashboard/registre')
  revalidatePath(`/dashboard/registre/${id}`)
  return { success: true, data: data as unknown as SystemeIA }
}

export async function deleteSystem(id: string): Promise<ActionResult<void>> {
  const { error, supabase, orgId } = await getAuthContext()
  if (error) return { success: false, error }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { error: dbError } = (await db
    .from('systemes_ia')
    .delete()
    .eq('id', id)
    .eq('organization_id', orgId)) as { error: { message: string } | null }

  if (dbError) return { success: false, error: dbError.message }

  revalidatePath('/dashboard/registre')
  return { success: true, data: undefined }
}
