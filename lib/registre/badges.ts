import type { NiveauRisque, StatutConformite } from '@/types/shared.types'

export const NIVEAU_RISQUE_LABELS: Record<NiveauRisque, string> = {
  interdit: 'Interdit',
  haut_risque: 'Haut risque',
  risque_limite: 'Risque limité',
  risque_minimal: 'Risque minimal',
}

export const NIVEAU_RISQUE_CLASSES: Record<NiveauRisque, string> = {
  interdit: 'bg-red-100 text-red-800 border-red-200',
  haut_risque: 'bg-orange-100 text-orange-800 border-orange-200',
  risque_limite: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  risque_minimal: 'bg-green-100 text-green-800 border-green-200',
}

export const STATUT_LABELS: Record<StatutConformite, string> = {
  conforme: 'Conforme',
  en_cours: 'En cours',
  non_conforme: 'Non conforme',
  non_evalue: 'Non évalué',
}

export const STATUT_CLASSES: Record<StatutConformite, string> = {
  conforme: 'bg-green-100 text-green-800 border-green-200',
  en_cours: 'bg-blue-100 text-blue-800 border-blue-200',
  non_conforme: 'bg-red-100 text-red-800 border-red-200',
  non_evalue: 'bg-gray-100 text-gray-600 border-gray-200',
}
