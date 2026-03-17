# BRIEF — Projet AI Act Compliance SaaS

## Concept

SaaS de conformité AI Act ciblant les PME françaises (50-500 salariés).
Positionnement : "Le Legalstart de l'AI Act" — ultra-simple, self-service, prix accessible.

## Pourquoi maintenant

- AI Act entré en vigueur août 2024, deadlines progressives jusqu'en août 2026
- **AI Literacy obligatoire depuis février 2025** — porte d'entrée immédiate, pas besoin d'attendre 2026
- **Obligations déployeurs haut risque : août 2026** — 16 mois de fenêtre
- Parallèle exact avec le RGPD 2018 : ceux qui se sont positionnés 18 mois avant ont tout raflé
- Marché quasi-vierge sur le segment PME (tous les acteurs visent les grands groupes)

## Cible

PME de 50-500 salariés qui utilisent :
- CRM avec scoring prédictif (Salesforce, HubSpot...)
- Outils RH IA (tri de CV, évaluation de performance, Workday...)
- Chatbots clients
- Outils de scoring crédit ou assurance
- Copilot Microsoft, ChatGPT Enterprise, Gemini Workspace

Personnes à convaincre : DRH, DAF, DPO, responsable juridique, DSI.

## Obligations exactes des déployeurs (ce que le SaaS couvre)

1. **Inventaire et classification** des systèmes IA utilisés
2. **AI Literacy** — formation de tous les salariés qui utilisent de l'IA (déjà obligatoire)
3. **Supervision humaine** sur les systèmes haut risque
4. **Rétention des logs** 6 mois minimum
5. **Information des personnes** concernées par des décisions IA
6. **Évaluation d'impact** sur les droits fondamentaux (FRIA)
7. **Signalement incidents** aux autorités (CNIL, DGCCRF, ARCOM en France)
8. **Documentation technique** et politique IA interne

## Systèmes IA "haut risque" (Annexe III) — exemples concrets

- Tri de CV, évaluation de performance, détection d'émotions au travail
- Scoring crédit, assurance, solvabilité
- Biométrie, reconnaissance faciale
- Chatbots décisionnels dans la santé ou le social
- Outils dans l'éducation/formation évaluant des apprenants
- Systèmes d'infrastructure critique

## Concurrence

| Acteur | Cible | Prix | Problème |
|---|---|---|---|
| Naaia (FR) | Grands groupes | Sur devis | Trop complexe, pas self-service |
| Credo AI (US) | Enterprise | 50-200k€/an | Hors budget PME |
| Holistic AI (UK) | Enterprise | 50-200k€/an | Idem |
| OneTrust (US) | Enterprise | 50k€+/an | Idem |
| Protectron | PME | 99-599€/mois | Nouveau, anglophone |
| AiActo (EU) | PME | Freemium | Outil diagnostic basique |

**Conclusion : personne ne domine le segment PME francophone.**

## Taille de marché

- Marché UE outils conformité AI Act : 800M-1,2 Md€ d'ici 2027
- Coût consultant pour une PME : 200k-500k€ → un SaaS à 299€/mois = no-brainer
- France : des centaines de milliers de PME concernées

## MVP — Features prioritaires (8-10 semaines)

### Gratuit — Lead gen viral
- Quiz "Votre entreprise est-elle concernée par l'AI Act ?" (5 questions, résultat immédiat)
- Rapport de base par email

### Payant
1. **Registre IA** — inventaire des outils, classification automatique par niveau de risque
2. **Checklist conformité** — vert/orange/rouge par obligation, deadlines intégrées
3. **Générateur de documents** — politique IA interne, notice information salariés, formulaire AI Literacy
4. **Module AI Literacy** — micro-formations + attestations (OBLIGATOIRE DÈS MAINTENANT)
5. **Dashboard** — score global, alertes, progression

## Pricing

- **Gratuit** : quiz + rapport diagnostic
- **Starter 99€/mois** : jusqu'à 5 systèmes IA, registre, checklist
- **Pro 299€/mois** : systèmes illimités, générateur docs, AI Literacy
- **Expert 599€/mois** : multi-entités, rapport d'audit exportable, accompagnement

## Go-to-market

**Canal principal : content marketing éducatif**
- SEO sur "conformité AI Act PME", "AI Literacy obligation", "registre systèmes IA"
- Articles type "Votre CRM Salesforce vous rend-il non conforme à l'AI Act ?"
- LinkedIn : posts éducatifs pour DRH/DAF/DPO

**Canal secondaire : partenariats**
- DPO freelances (ils gèrent déjà le RGPD de leurs clients)
- Cabinets RH, avocats IT, ESN
- Commission d'apport ou white-label

**Angle d'entrée immédiat :** AI Literacy — obligatoire depuis février 2025, pas besoin d'attendre 2026.

## Risques

1. **Procrastination** des entreprises → vague de panique juin-juillet 2026 (opportunité + risque)
2. **Crédibilité légale** → disclaimer "outil d'aide, ne remplace pas un conseil juridique"
3. **Évolution de la loi** → veille réglementaire intégrée = argument de vente
4. **Concurrence** → pas de dominant, fenêtre encore ouverte

## Nom de domaine / Identité

Pistes :
- `aiact-pme.fr`
- `complyia.fr`
- `conformia.fr`
- `aicomply.fr`

## Stack technique recommandée

Identique à Tarvio : Next.js 14+, Supabase, TypeScript, Tailwind, Stripe, Resend, Vercel.
Réutiliser les patterns établis (Server Components, Server Actions, RLS, Zod).

## Liens utiles

- Texte officiel AI Act : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689
- CNIL sur l'AI Act : https://www.cnil.fr/fr/ia
- Service desk officiel EU : https://ai-act-service-desk.ec.europa.eu
- Naaia : https://naaia.ai
- AiActo : https://www.aiacto.eu

---
*Créé le 2026-03-17 — Hamza + assistant*
