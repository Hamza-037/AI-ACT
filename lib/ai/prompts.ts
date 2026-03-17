// Tous les prompts IA en français

export const PROMPTS = {
  classificationIA: (nom: string, usage: string, departement: string) => `
Tu es un expert en conformité AI Act européen. Analyse ce système IA et détermine son niveau de risque.

Système IA : ${nom}
Usage décrit : ${usage}
Département : ${departement}

Niveaux possibles (du plus au moins risqué) :
- interdit : systèmes interdits par l'AI Act (scoring social, manipulation subliminale, biométrie temps réel dans l'espace public)
- haut_risque : systèmes à haut risque (RH/recrutement, scoring crédit, justice, infrastructure critique)
- risque_limite : systèmes avec obligations de transparence (chatbots, génération de contenu)
- risque_minimal : tous les autres systèmes

Réponds UNIQUEMENT avec un JSON valide :
{
  "niveau_risque": "haut_risque",
  "justification": "Ce système est utilisé pour...",
  "obligations_principales": ["obligation 1", "obligation 2"]
}
`.trim(),

  generationDocument: (type: string, contexte: string) => `
Tu es un expert juridique spécialisé en AI Act et droit numérique français.
Génère un document de conformité de type "${type}" pour le contexte suivant :

${contexte}

Le document doit être :
- Professionnel et juridiquement solide
- En français
- Adapté aux PME françaises
- Conforme aux exigences de l'AI Act européen

Génère le document complet en Markdown.
`.trim(),

  analyseConformite: (systeme: string, checklist: string) => `
Tu es un expert en conformité AI Act. Analyse l'état de conformité de ce système IA.

Système : ${systeme}
État de la checklist : ${checklist}

Identifie :
1. Les points de conformité validés
2. Les lacunes critiques
3. Les actions prioritaires à mener

Réponds en JSON :
{
  "score_conformite": 75,
  "points_forts": ["..."],
  "lacunes_critiques": ["..."],
  "actions_prioritaires": ["..."]
}
`.trim(),
}
