'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getServiceRoleClient } from '@/lib/supabase/service'
import { organizationSchema } from '@/lib/validations/organization'
import type { ActionResult, Profile } from '@/types/shared.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

export type OnboardingData = {
  // Étape 1 — Organisation
  orgNom: string
  secteur: string
  taille: string
  // Étape 2 — Profil
  prenom: string
  nom: string
  poste: string
  // Étape 3 — Inventaire IA
  outilsIA: string[]
}

const OUTILS_IA_CONFIG: Record<
  string,
  { nom: string; departement: string; niveau_risque: string }
> = {
  'CRM avec scoring': {
    nom: 'CRM avec scoring',
    departement: 'Marketing',
    niveau_risque: 'risque_limite',
  },
  'Outils RH IA': {
    nom: 'Outils RH IA',
    departement: 'RH',
    niveau_risque: 'haut_risque',
  },
  'Chatbot client': {
    nom: 'Chatbot client',
    departement: 'Support',
    niveau_risque: 'risque_limite',
  },
  'Copilot/Assistant IA': {
    nom: 'Copilot / Assistant IA',
    departement: 'IT',
    niveau_risque: 'risque_minimal',
  },
  'Outil de scoring financier': {
    nom: 'Outil de scoring financier',
    departement: 'Finance',
    niveau_risque: 'haut_risque',
  },
}

export async function completeOnboarding(
  data: OnboardingData
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const serviceClient = getServiceRoleClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviceDb = serviceClient as unknown as any

  // 1. Créer l'organisation
  const tailleSalaries = data.taille
    ? (() => {
        const mapping: Record<string, number> = {
          '<10': 5,
          '10-49': 30,
          '50-249': 150,
          '250-499': 375,
          '500+': 500,
        }
        return mapping[data.taille] ?? null
      })()
    : null

  const { data: org, error: orgError } = (await serviceDb
    .from('organizations')
    .insert({
      nom: data.orgNom,
      secteur: data.secteur || null,
      taille_salaries: tailleSalaries,
    })
    .select('id')
    .single()) as { data: AnyRecord | null; error: { message: string } | null }

  if (orgError) {
    console.error('[profile] completeOnboarding org error:', orgError.message)
    return { success: false, error: "Impossible de créer l'organisation" }
  }
  if (!org) return { success: false, error: "Impossible de créer l'organisation" }

  const organizationId = org.id as string

  // 2. Mettre à jour le profil
  const { error: profileError } = (await serviceDb
    .from('profiles')
    .update({
      organization_id: organizationId,
      nom: data.nom,
      prenom: data.prenom,
      role: 'owner',
      onboarding_completed: true,
    })
    .eq('id', user.id)) as { error: { message: string } | null }

  if (profileError) {
    console.error('[profile] completeOnboarding profile error:', profileError.message)
    return { success: false, error: 'Erreur lors de la configuration du profil' }
  }

  // 3. Créer les systèmes IA placeholder (filtrer "Aucun pour l'instant")
  const outilsActifs = data.outilsIA.filter((o) => o !== "Aucun pour l'instant")
  if (outilsActifs.length > 0) {
    const systemes = outilsActifs
      .filter((outil) => OUTILS_IA_CONFIG[outil])
      .map((outil) => ({
        organization_id: organizationId,
        nom: OUTILS_IA_CONFIG[outil]!.nom,
        departement: OUTILS_IA_CONFIG[outil]!.departement,
        niveau_risque: OUTILS_IA_CONFIG[outil]!.niveau_risque,
        statut_conformite: 'non_evalue',
        decisions_autonomes: false,
      }))

    if (systemes.length > 0) {
      const { error: systemesError } = (await serviceDb
        .from('systemes_ia')
        .insert(systemes)) as { error: { message: string } | null }

      if (systemesError) {
        console.error('[profile] completeOnboarding systemes error:', systemesError.message)
        return { success: false, error: "Erreur lors de l'initialisation de l'inventaire" }
      }
    }
  }

  redirect('/dashboard')
}

export async function getProfile(): Promise<ActionResult<Profile>> {
  const supabase = await createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { data, error } = (await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()) as { data: AnyRecord | null; error: { message: string } | null }

  if (error) {
    console.error('[profile] getProfile error:', error.message)
    return { success: false, error: 'Erreur lors de la récupération du profil' }
  }
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

  const { data: profile } = (await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()) as { data: AnyRecord | null }

  if (!profile?.organization_id) return { success: false, error: 'Organisation non trouvée' }

  const parsed = organizationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Validation échouée' }
  }

  const { error } = (await db
    .from('organizations')
    .update(parsed.data)
    .eq('id', profile.organization_id)) as { error: { message: string } | null }

  if (error) {
    console.error('[profile] updateOrganization error:', error.message)
    return { success: false, error: "Erreur lors de la mise à jour de l'organisation" }
  }
  return { success: true, data: undefined }
}
