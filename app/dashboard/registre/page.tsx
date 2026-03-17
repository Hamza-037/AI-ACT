import Link from 'next/link'
import { Plus, Bot } from 'lucide-react'
import { getSystems } from '@/lib/actions/systemes'
import {
  NIVEAU_RISQUE_LABELS,
  NIVEAU_RISQUE_CLASSES,
} from '@/lib/registre/badges'
import type { NiveauRisque } from '@/types/shared.types'

export default async function RegistrePage() {
  const result = await getSystems()
  const systemes = result.success ? result.data : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registre des systemes IA</h1>
        <Link
          href="/dashboard/registre/nouveau"
          className="inline-flex items-center gap-2 justify-center h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un systeme
        </Link>
      </div>

      {systemes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Bot className="h-12 w-12 text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Aucun systeme IA enregistre
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            Commencez par inventorier les outils IA utilises dans votre entreprise pour evaluer
            votre niveau de conformite AI Act.
          </p>
          <Link
            href="/dashboard/registre/nouveau"
            className="inline-flex items-center gap-2 justify-center h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter mon premier systeme
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemes.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${NIVEAU_RISQUE_CLASSES[s.niveau_risque as NiveauRisque]}`}
                >
                  {NIVEAU_RISQUE_LABELS[s.niveau_risque as NiveauRisque]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{s.nom}</p>
                {s.fournisseur && (
                  <p className="text-sm text-slate-500 mt-0.5">{s.fournisseur}</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  {new Date(s.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <Link
                  href={`/dashboard/registre/${s.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Voir
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
