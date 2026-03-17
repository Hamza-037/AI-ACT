import type { Plan } from '@/types/shared.types'

export const PLAN_FEATURES: Record<Plan, string[]> = {
  gratuit: ['Quiz d\'eligibilite', 'Rapport de diagnostic', 'Acces en lecture seule'],
  starter: ['5 systemes IA', 'Checklist de conformite', 'Generateur de documents', '1 utilisateur'],
  pro: ['Systemes IA illimites', '5 utilisateurs', 'Module AI Literacy', 'Generateur docs complet', 'Exports PDF', 'Support email'],
  expert: ['Systemes IA illimites', '20 utilisateurs', 'Multi-entites', 'Support prioritaire', 'Toutes les fonctionnalites Pro'],
}

export const PLAN_PRICES: Record<Plan, number> = {
  gratuit: 0,
  starter: 99,
  pro: 299,
  expert: 599,
}

export const PLAN_NAMES: Record<Plan, string> = {
  gratuit: 'Gratuit',
  starter: 'Starter',
  pro: 'Pro',
  expert: 'Expert',
}
