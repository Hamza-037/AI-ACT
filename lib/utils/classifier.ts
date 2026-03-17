import type { NiveauRisque } from '@/types/shared.types'

export function classifierSysteme(data: {
  nom: string
  fournisseur?: string | null
  usage?: string | null
  departement?: string | null
  decisions_autonomes: boolean
}): NiveauRisque {
  const text =
    `${data.nom} ${data.fournisseur ?? ''} ${data.usage ?? ''} ${data.departement ?? ''}`.toLowerCase()

  // Systèmes interdits
  const interdit = [
    'notation sociale',
    'score social',
    'reconnaissance émotions',
    'surveillance de masse',
    'biométrie temps réel',
  ]
  if (interdit.some((k) => text.includes(k))) return 'interdit'

  // Haut risque — RH
  const hautRisqueRH = [
    'recrutement',
    'recruiting',
    'tri cv',
    'candidat',
    'embauche',
    'hiring',
    'évaluation performance',
    'performance review',
    'scoring rh',
    'hr scoring',
    'rh',
  ]
  if (hautRisqueRH.some((k) => text.includes(k)) && data.decisions_autonomes)
    return 'haut_risque'

  // Haut risque — Finance/Assurance
  const hautRisqueFinance = [
    'crédit',
    'solvabilité',
    'scoring',
    'assurance',
    'prêt',
    'financement',
  ]
  if (hautRisqueFinance.some((k) => text.includes(k)) && data.decisions_autonomes)
    return 'haut_risque'

  // Risque limité — chatbots, IA génératives
  const risqueLimite = [
    'chatbot',
    'chat',
    'assistant',
    'copilot',
    'gpt',
    'gemini',
    'claude',
    'llm',
    'génératif',
  ]
  if (risqueLimite.some((k) => text.includes(k))) return 'risque_limite'

  return 'risque_minimal'
}
