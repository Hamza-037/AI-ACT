export type ModuleContenu =
  | { type: 'text'; titre: string; texte: string }
  | { type: 'quiz'; question: string; options: string[]; reponse_correcte: number; explication: string }

export type LiteracyModule = {
  id: string
  titre: string
  description: string
  duree_minutes: number
  ordre: number
  contenu: ModuleContenu[]
}

export const LITERACY_MODULES: LiteracyModule[] = [
  {
    id: 'module-1',
    titre: "Comprendre l'AI Act et vos obligations",
    description: "Qu'est-ce que l'AI Act, qui est concerne, quelles sont les deadlines et les sanctions ?",
    duree_minutes: 15,
    ordre: 1,
    contenu: [
      {
        type: 'text',
        titre: "L'AI Act en 3 minutes",
        texte: "Le reglement europeen sur l'intelligence artificielle (AI Act) est entre en vigueur le 1er aout 2024. Il impose des obligations progressives a toutes les entreprises qui utilisent ou developpent des systemes d'IA dans l'Union europeenne.\n\nVotre entreprise est un 'deployeur' si vous utilisez des outils IA achetes aupres de fournisseurs (chatbots, CRM avec scoring, outils RH IA, etc.).",
      },
      {
        type: 'quiz',
        question: "Depuis quelle date l'obligation de formation AI Literacy est-elle en vigueur ?",
        options: ['1er janvier 2025', '2 fevrier 2025', '2 aout 2026', '1er janvier 2027'],
        reponse_correcte: 1,
        explication: "L'Article 4 de l'AI Act impose la formation AI Literacy depuis le 2 fevrier 2025.",
      },
    ],
  },
  {
    id: 'module-2',
    titre: "Utiliser l'IA de maniere responsable",
    description: "Bonnes pratiques, biais algorithmiques, supervision humaine et limites des systemes IA.",
    duree_minutes: 15,
    ordre: 2,
    contenu: [
      {
        type: 'text',
        titre: 'Les 3 regles fondamentales',
        texte: "1. Verifiez toujours les resultats d'un systeme IA avant de les utiliser.\n2. Signalez tout dysfonctionnement a votre responsable IT.\n3. Ne prenez pas de decision importante basee uniquement sur une recommandation IA sans validation humaine.",
      },
      {
        type: 'quiz',
        question: 'Que faire si un outil IA vous donne un resultat surprenant ?',
        options: ["L'accepter tel quel", "Le verifier et le valider humainement", "L'ignorer", "Desactiver l'outil"],
        reponse_correcte: 1,
        explication: "La supervision humaine est un principe fondamental de l'AI Act pour les systemes a haut risque.",
      },
    ],
  },
  {
    id: 'module-3',
    titre: 'Identifier et signaler les problemes',
    description: 'Comment detecter un incident IA, qui contacter, et quelles sont vos obligations de signalement.',
    duree_minutes: 15,
    ordre: 3,
    contenu: [
      {
        type: 'text',
        titre: 'Signaler un incident',
        texte: "L'AI Act impose de signaler les incidents graves lies a des systemes IA haut risque. Un 'incident grave' est une situation ou un systeme IA cause un prejudice reel a une personne (discrimination, erreur medicale, perte financiere significative...).\n\nEn interne : signalez a votre DPO ou responsable conformite.\nEn externe : votre entreprise doit notifier l'autorite competente (CNIL en France) sans delai indu.",
      },
      {
        type: 'quiz',
        question: "A qui signaler en priorite un incident grave lie a un systeme IA ?",
        options: ["Au fournisseur de l'outil", 'A votre DPO ou responsable conformite en interne', 'Directement a la CNIL', 'A personne'],
        reponse_correcte: 1,
        explication: 'Le signalement interne est la premiere etape. Votre entreprise se charge ensuite du signalement externe si necessaire.',
      },
    ],
  },
]

export function getModuleById(id: string): LiteracyModule | undefined {
  return LITERACY_MODULES.find((m) => m.id === id)
}

export function calculateAttestationEligibility(completedModuleIds: string[]): boolean {
  return LITERACY_MODULES.every((m) => completedModuleIds.includes(m.id))
}
