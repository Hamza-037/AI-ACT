export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type NiveauRisque = 'interdit' | 'haut_risque' | 'risque_limite' | 'risque_minimal'
export type StatutConformite = 'conforme' | 'en_cours' | 'non_conforme' | 'non_evalue'
export type UserRole = 'owner' | 'admin' | 'member'
export type Plan = 'gratuit' | 'starter' | 'pro' | 'expert'

export type ObligationCode =
  | 'ai_literacy'
  | 'inventaire'
  | 'supervision_humaine'
  | 'notice_personnes'
  | 'retention_logs'
  | 'fria'
  | 'signalement_incidents'
  | 'politique_interne'

export const OBLIGATION_LABELS: Record<ObligationCode, string> = {
  ai_literacy: 'Formation AI Literacy des salariés',
  inventaire: 'Inventaire des systèmes IA',
  supervision_humaine: 'Supervision humaine documentée',
  notice_personnes: 'Information des personnes concernées',
  retention_logs: 'Conservation des logs (6 mois)',
  fria: "Évaluation d'impact sur les droits fondamentaux",
  signalement_incidents: 'Procédure de signalement des incidents',
  politique_interne: "Politique interne d'utilisation de l'IA",
}

export const OBLIGATION_DEADLINES: Record<ObligationCode, string> = {
  ai_literacy: 'Déjà obligatoire (fév. 2025)',
  inventaire: '2 août 2026',
  supervision_humaine: '2 août 2026',
  notice_personnes: '2 août 2026',
  retention_logs: '2 août 2026',
  fria: '2 août 2026',
  signalement_incidents: '2 août 2026',
  politique_interne: '2 août 2026',
}

export type SystemeIA = {
  id: string
  organization_id: string
  nom: string
  fournisseur: string | null
  usage: string | null
  departement: string | null
  niveau_risque: NiveauRisque
  statut_conformite: StatutConformite
  decisions_autonomes: boolean
  responsable_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Organization = {
  id: string
  nom: string
  siren: string | null
  secteur: string | null
  taille_salaries: number | null
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export type Profile = {
  id: string
  organization_id: string | null
  role: UserRole
  nom: string | null
  prenom: string | null
  created_at: string
}
