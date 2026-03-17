import Link from 'next/link'
import { Plus, Database } from 'lucide-react'
import { getSystems } from '@/lib/actions/systemes'
import {
  NIVEAU_RISQUE_LABELS,
  NIVEAU_RISQUE_CLASSES,
  STATUT_LABELS,
  STATUT_CLASSES,
} from '@/lib/registre/badges'
import type { NiveauRisque, StatutConformite } from '@/types/shared.types'

export default async function RegistrePage() {
  const result = await getSystems()
  const systemes = result.success ? result.data : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Registre des systèmes IA</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Inventaire de tous les outils IA utilisés dans votre entreprise
          </p>
        </div>
        <Link
          href="/dashboard/registre/nouveau"
          className="inline-flex items-center gap-2 justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Ajouter un système
        </Link>
      </div>

      {systemes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/20">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Aucun système IA enregistré</h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Commencez par inventorier les outils IA utilisés dans votre entreprise pour évaluer
            votre niveau de conformité AI Act.
          </p>
          <Link
            href="/dashboard/registre/nouveau"
            className="inline-flex items-center gap-2 justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Ajouter mon premier système
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Nom</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">
                  Fournisseur
                </th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">
                  Département
                </th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">
                  Niveau de risque
                </th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">
                  Conformité
                </th>
                <th className="text-right font-medium px-4 py-3 text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemes.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.nom}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.fournisseur ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.departement ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${NIVEAU_RISQUE_CLASSES[s.niveau_risque as NiveauRisque]}`}
                    >
                      {NIVEAU_RISQUE_LABELS[s.niveau_risque as NiveauRisque]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUT_CLASSES[s.statut_conformite as StatutConformite]}`}
                    >
                      {STATUT_LABELS[s.statut_conformite as StatutConformite]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/registre/${s.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
