import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OBLIGATION_LABELS, OBLIGATION_DEADLINES } from '@/types/shared.types'
import type { ObligationCode } from '@/types/shared.types'

type ObligationDetail = {
  description: string
  pourQuoi: string
  commentFaire: string[]
  ressources: { label: string; url: string }[]
}

const OBLIGATION_DETAILS: Partial<Record<ObligationCode, ObligationDetail>> = {
  ai_literacy: {
    description: "Former tous les salaries qui utilisent des systemes IA a comprendre le fonctionnement, les limites et les risques de l'IA.",
    pourQuoi: "Article 4 de l'AI Act. En vigueur depuis le 2 fevrier 2025. Le non-respect peut entrainer des amendes.",
    commentFaire: [
      "Identifier les salaries utilisant des outils IA (Copilot, ChatGPT, Gemini, etc.)",
      "Organiser une formation de 30 a 60 minutes sur les bases de l'IA",
      "Conserver les attestations de formation pour chaque salarie",
      "Utiliser le module AI Literacy de ComplyIA pour automatiser le suivi",
    ],
    ressources: [
      { label: "Texte officiel AI Act - Article 4", url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689" },
      { label: "Guide CNIL sur l'IA", url: "https://www.cnil.fr/fr/ia" },
    ],
  },
  inventaire: {
    description: "Etablir un registre complet de tous les systemes IA utilises dans l'entreprise avec leur classification par niveau de risque.",
    pourQuoi: "Obligation centrale pour tout deployer. Deadline : 2 aout 2026. Base de toute conformite AI Act.",
    commentFaire: [
      "Lister tous les outils IA utilises (CRM, chatbot, outils RH, Microsoft Copilot, etc.)",
      "Classifier chaque systeme par niveau de risque (interdit / haut risque / limite / minimal)",
      "Designer un responsable humain pour chaque systeme",
      "Utiliser le module Registre IA de ComplyIA pour gerer l'inventaire",
    ],
    ressources: [
      { label: "AI Act - Annexe III (systemes haut risque)", url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689" },
    ],
  },
  supervision_humaine: {
    description: "Mettre en place une supervision humaine effective pour tous les systemes IA classes a haut risque.",
    pourQuoi: "Article 26(2) de l'AI Act. La supervision humaine est un pilier fondamental de l'AI Act pour eviter les decisions entierement automatisees sur des sujets critiques.",
    commentFaire: [
      "Identifier les systemes IA haut risque dans votre registre",
      "Assigner un responsable humain forme a chaque systeme",
      "Documenter les procedures de validation humaine des decisions IA",
      "Former les responsables a detecter et corriger les erreurs des systemes IA",
    ],
    ressources: [],
  },
  notice_personnes: {
    description: "Informer les personnes concernees qu'elles sont soumises a des decisions prises ou assistees par un systeme IA.",
    pourQuoi: "Article 26(8) de l'AI Act. Droit fondamental des personnes de savoir quand l'IA les affecte.",
    commentFaire: [
      "Identifier toutes les situations ou l'IA influence une decision concernant une personne",
      "Rediger une notice d'information claire et comprehensible",
      "L'integrer dans les contrats, CGV, mentions legales ou communications directes",
      "Prevoir une procedure de recours humain pour contester les decisions IA",
    ],
    ressources: [],
  },
  retention_logs: {
    description: "Conserver les logs generes automatiquement par les systemes IA haut risque pendant 6 mois minimum.",
    pourQuoi: "Article 26(6) de l'AI Act. Permet les audits internes et les enquetes des autorites.",
    commentFaire: [
      "Verifier que vos fournisseurs d'outils IA proposent l'export de logs",
      "Mettre en place un stockage securise et accessible des logs",
      "Documenter votre politique de retention dans votre politique interne",
      "Tester regulierement que les logs sont bien conserves et recuperables",
    ],
    ressources: [],
  },
  fria: {
    description: "Realiser une evaluation d'impact sur les droits fondamentaux (FRIA) avant de deployer certains systemes IA.",
    pourQuoi: "Article 27 de l'AI Act. Obligatoire pour les organismes publics et certains deployers prives (scoring credit, infrastructure critique).",
    commentFaire: [
      "Verifier si votre organisation est soumise a cette obligation specifique",
      "Identifier les systemes IA concernes (scoring, RH dans grandes orgs, etc.)",
      "Realiser l'evaluation avec l'aide d'un juriste specialise",
      "Notifier l'autorite competente (CNIL) des resultats si requis",
    ],
    ressources: [
      { label: "Guide FRIA - Commission europeenne", url: "https://digital-strategy.ec.europa.eu/fr" },
    ],
  },
  signalement_incidents: {
    description: "Mettre en place une procedure interne de signalement des incidents graves lies aux systemes IA.",
    pourQuoi: "Article 26(5) de l'AI Act. Obligatoire pour les systemes haut risque.",
    commentFaire: [
      "Definir ce qu'est un incident grave dans votre contexte (discrimination, erreur medicale, perte financiere significative)",
      "Creer une procedure interne de signalement documentee",
      "Designer un responsable de signalement (DPO, responsable conformite, ou autre)",
      "Former les equipes a reconnaitre et signaler les incidents",
    ],
    ressources: [
      { label: "Signaler un incident a la CNIL", url: "https://www.cnil.fr/fr/contacter-la-cnil" },
    ],
  },
  politique_interne: {
    description: "Rediger et diffuser une politique interne d'utilisation de l'IA adaptee a votre entreprise.",
    pourQuoi: "Bonne pratique fondamentale de gouvernance IA. Demontre la conformite lors des audits.",
    commentFaire: [
      "Definir les regles d'utilisation acceptables de l'IA pour vos equipes",
      "Preciser les responsabilites de chaque departement",
      "Documenter les systemes IA autorises et leurs conditions d'utilisation",
      "Diffuser le document a tous les salaries et le tenir a jour",
    ],
    ressources: [],
  },
}

export default function ChecklistDetailPage({ params }: { params: { code: string } }) {
  const code = params.code as ObligationCode
  const detail = OBLIGATION_DETAILS[code]
  const label = OBLIGATION_LABELS[code]

  if (!label) notFound()

  const deadline = OBLIGATION_DEADLINES[code]
  const isUrgent = deadline?.includes('2025')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/checklist"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a la checklist
      </Link>

      <div>
        <h1 className="text-2xl font-bold mb-1">{label}</h1>
        <p className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-muted-foreground'}`}>
          {deadline}
          {isUrgent && ' — Deja en vigueur'}
        </p>
      </div>

      {detail ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{detail.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pourquoi cette obligation ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{detail.pourQuoi}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comment se mettre en conformite ?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {detail.commentFaire.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {detail.ressources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ressources officielles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {detail.ressources.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        {r.label}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Les details de cette obligation seront disponibles prochainement.
            </p>
          </CardContent>
        </Card>
      )}

      <Link
        href="/dashboard/checklist"
        className="inline-flex items-center justify-center h-11 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Retour a la checklist
      </Link>
    </div>
  )
}
