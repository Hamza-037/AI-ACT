export const DEADLINE_AI_ACT = new Date('2026-08-02T00:00:00.000Z')

/**
 * Calcule le score de conformité en pourcentage (0-100).
 * Les items "conforme" comptent comme complets.
 */
export function calculerScore(items: { statut: string }[]): number {
  if (items.length === 0) return 0
  const completes = items.filter((i) => i.statut === 'conforme').length
  return Math.round((completes / items.length) * 100)
}

/**
 * Retourne le nombre de jours restants avant la deadline.
 * Retourne 0 si la deadline est passée.
 */
export function calculerJoursRestants(deadline: Date = DEADLINE_AI_ACT): number {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Retourne la couleur CSS selon le score de conformité.
 */
export function couleurScore(score: number): string {
  if (score >= 67) return 'text-green-600'
  if (score >= 34) return 'text-orange-500'
  return 'text-red-600'
}

/**
 * Retourne la couleur de la barre de progression selon le score.
 */
export function couleurProgressBar(score: number): string {
  if (score >= 67) return 'bg-green-500'
  if (score >= 34) return 'bg-orange-500'
  return 'bg-red-500'
}

/**
 * Détermine si l'onboarding est requis (onboarding_completed est false ou null).
 */
export function onboardingRequis(onboardingCompleted: boolean | null | undefined): boolean {
  return !onboardingCompleted
}
