import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Pencil, Calendar, Building2, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSystemById } from '@/lib/actions/systemes'
import { DeleteSystemeButton } from '@/components/registre/DeleteSystemeButton'
import {
  NIVEAU_RISQUE_LABELS,
  NIVEAU_RISQUE_CLASSES,
  STATUT_LABELS,
  STATUT_CLASSES,
} from '@/lib/registre/badges'
import type { NiveauRisque, StatutConformite } from '@/types/shared.types'

type Props = {
  params: Promise<{ id: string }>
}

export default async function SystemeDetailPage({ params }: Props) {
  const { id } = await params
  const result = await getSystemById(id)

  if (!result.success) {
    notFound()
  }

  const s = result.data

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/registre"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Retour au registre
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-bold">{s.nom}</h1>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Header card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{s.nom}</CardTitle>
                {s.fournisseur && (
                  <p className="text-sm text-muted-foreground mt-1">{s.fournisseur}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${NIVEAU_RISQUE_CLASSES[s.niveau_risque as NiveauRisque]}`}
                >
                  {NIVEAU_RISQUE_LABELS[s.niveau_risque as NiveauRisque]}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUT_CLASSES[s.statut_conformite as StatutConformite]}`}
                >
                  {STATUT_LABELS[s.statut_conformite as StatutConformite]}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {s.departement && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Département :</span>
                  <span className="font-medium">{s.departement}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Décisions autonomes :</span>
                <span className="font-medium">{s.decisions_autonomes ? 'Oui' : 'Non'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ajouté le :</span>
                <span className="font-medium">
                  {new Date(s.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            {s.usage && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Description de l&apos;usage</p>
                <p className="text-sm text-muted-foreground">{s.usage}</p>
              </div>
            )}

            {s.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Notes internes</p>
                <p className="text-sm text-muted-foreground">{s.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Obligations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Obligations liées</CardTitle>
          </CardHeader>
          <CardContent>
            {s.niveau_risque === 'haut_risque' || s.niveau_risque === 'interdit' ? (
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span>Supervision humaine documentée (échéance : 2 août 2026)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span>Notice d&apos;information aux personnes concernées (échéance : 2 août 2026)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span>Rétention des logs 6 mois (échéance : 2 août 2026)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span>Procédure de signalement des incidents (échéance : 2 août 2026)</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>Inventaire dans le registre des systèmes IA (échéance : 2 août 2026)</span>
                </li>
                {s.niveau_risque === 'risque_limite' && (
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-yellow-400 flex-shrink-0" />
                    <span>
                      Obligation de transparence vis-à-vis des utilisateurs (chatbot/IA générative)
                    </span>
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/registre/${s.id}/modifier`}
            className="inline-flex items-center justify-center h-11 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/80"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Link>
          <DeleteSystemeButton id={s.id} nom={s.nom} />
        </div>
      </div>
    </div>
  )
}
