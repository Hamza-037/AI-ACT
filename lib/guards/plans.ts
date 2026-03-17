import { PLANS } from '@/lib/stripe/config'
import type { Plan, PlanGuardResult } from '@/types/shared.types'

export type { PlanGuardResult }

export function canAddSysteme(currentPlan: Plan, currentCount: number): PlanGuardResult {
  const limits = PLANS[currentPlan]
  if (limits.systemes_max === -1) return { allowed: true }
  if (limits.systemes_max === 0) return {
    allowed: false,
    reason: 'Le plan Gratuit ne permet pas d\'ajouter des systemes IA.',
    upgrade_to: 'starter',
  }
  if (currentCount >= limits.systemes_max) return {
    allowed: false,
    reason: `Limite de ${limits.systemes_max} systemes IA atteinte sur votre plan.`,
    upgrade_to: currentPlan === 'starter' ? 'pro' : 'expert',
  }
  return { allowed: true }
}

export function canAddUtilisateur(currentPlan: Plan, currentCount: number): PlanGuardResult {
  const limits = PLANS[currentPlan]
  if (currentCount >= limits.utilisateurs_max) return {
    allowed: false,
    reason: `Limite de ${limits.utilisateurs_max} utilisateur(s) atteinte sur votre plan.`,
    upgrade_to: currentPlan === 'gratuit' ? 'starter' : currentPlan === 'starter' ? 'pro' : 'expert',
  }
  return { allowed: true }
}

export function canAccessDocuments(currentPlan: Plan): PlanGuardResult {
  if (currentPlan === 'gratuit') return {
    allowed: false,
    reason: 'La generation de documents est disponible a partir du plan Starter.',
    upgrade_to: 'starter',
  }
  return { allowed: true }
}

export function canAccessLiteracy(currentPlan: Plan): PlanGuardResult {
  if (currentPlan === 'gratuit' || currentPlan === 'starter') return {
    allowed: false,
    reason: 'Le module AI Literacy est disponible a partir du plan Pro.',
    upgrade_to: 'pro',
  }
  return { allowed: true }
}
