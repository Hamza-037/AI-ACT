# CLAUDE.md — Projet AI Act Compliance SaaS

> Lis ce fichier en entier avant toute action. Ces règles sont non négociables.

## 0. HARNESS OBLIGATOIRE

**Toute feature ou refonte → Planner → Generator → Evaluator. Sans exception.**
- Feature / composant → harness complet (lire `~/projects/Tarvio/.harness/HARNESS.md` pour le modèle)
- Hotfix 1 ligne → commit direct autorisé
- Aucun commit de feature sans Evaluator PASS (lint + tsc + build + tests + critères contract)

## Projet

SaaS de conformité AI Act pour PME françaises. Positionnement : ultra-simple, self-service, prix accessible (vs concurrents à 50k€+/an qui visent les grands groupes).

Stack : **Next.js 15, TypeScript 5, Supabase (SSR), Tailwind CSS, shadcn/ui, Zod, Stripe, Resend, Vercel**.

## Architecture

```
app/                    # App Router Next.js (Server Components par défaut)
  (marketing)/          # Landing pages publiques
  dashboard/            # Espace connecté artisan
  api/                  # Routes API (webhooks uniquement — pas de CRUD)
components/             # Composants UI
  ui/                   # shadcn/ui primitives
lib/
  actions/              # Server Actions UNIQUEMENT pour les mutations
  ai/                   # Tous les appels IA centralisés ici
  supabase/             # Clients Supabase (server.ts, client.ts, service.ts)
  validations/          # Schémas Zod partagés
supabase/
  migrations/           # Migrations SQL — forward-only, jamais de DROP
types/                  # Types TypeScript globaux
```

## Règles absolues — TypeScript

- **ZÉRO `any`** — utilise `unknown` + type guards, ou `as unknown as Type` pour les JOINs Supabase
- **ZÉRO `eslint-disable`** sauf cas légitimes documentés avec un commentaire explicatif
- Toutes les fonctions publiques doivent avoir des types explicites
- `database.types.ts` : ne jamais modifier manuellement — générer avec `npm run gen-types`

## Règles absolues — Architecture Next.js

- **Server Components par défaut** — `'use client'` uniquement sur les composants interactifs feuilles
- **Server Actions pour toutes les mutations** — dans `lib/actions/` uniquement
- **JAMAIS `useEffect` pour fetcher des données** — utilise `async` Server Components
- **JAMAIS de routes API custom pour le CRUD** — Server Actions uniquement
- `SUPABASE_SERVICE_ROLE_KEY` : uniquement dans `lib/supabase/service.ts` côté serveur, jamais dans un Client Component

## Règles absolues — Base de données

- **RLS sur toutes les tables utilisateur** — sans exception
- `user_id` dans les inserts = `auth.uid()` côté serveur, jamais fourni par le client
- Montants = **BIGINT en centimes**, jamais DECIMAL ou FLOAT
- Migrations **forward-only** dans `supabase/migrations/` — jamais de DROP, jamais de modification rétroactive
- Format : `YYYYMMDDHHMMSS_description_courte.sql`

## Règles absolues — UI/UX

- **ZÉRO emoji dans le code** — non négociable
- **Icons : Lucide uniquement** — tailles autorisées : `h-4`, `h-5`, `h-6`, `h-8`
- **Mobile-first** — boutons minimum `h-11` (44px), bottom sheets pour les modals sur mobile
- **JAMAIS `backdrop-filter: blur()` sur `position: sticky`** — bug noir sur Safari iOS
- **Autosave permanent** — pas de bouton "Enregistrer" manuel pour les formulaires principaux
- Animations : `transition-all duration-200` standard

## Règles absolues — IA

- **Tous les appels IA via `lib/ai/openrouter.ts`** — jamais d'import `openai` direct (sauf Whisper)
- **Tous les prompts en français** dans `lib/ai/prompts.ts`
- `void logAiUsage(...)` — fire-and-forget, jamais bloquant
- Réponses IA : toujours valider avec Zod avant utilisation
- Fallback obligatoire sur toute erreur IA — jamais bloquant pour l'utilisateur

## Règles absolues — Stripe

- Webhook = source de vérité pour les plans
- Table `stripe_webhook_events` pour l'idempotence
- Montants en centimes (BIGINT) dans toutes les tables

## Guards et limites

- **Les guards ne bloquent jamais l'accès aux données existantes**
- Ils bloquent uniquement la création de nouvelles ressources quand la limite est atteinte
- Toujours afficher un message clair sur ce qui est limité et comment débloquer

## Commandes utiles

```bash
npm run dev          # Développement local
npm run build        # Build production
npm run lint         # ESLint
npm run test         # Vitest
npx tsc --noEmit     # Vérification TypeScript
npm run validate     # lint + tsc + test + build (pipeline complète)
npm run gen-types    # Régénère database.types.ts depuis Supabase
```

## Validation avant commit

```bash
npm run validate
```

**Exit code 0 = candidate au commit.** Ne jamais commiter si lint, tsc ou tests échouent.

## Workflow de commit

```bash
git add -A
git commit -m "type(scope): description courte en français"
git push origin main
```

Types : `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `style`

## Ce qu'il ne faut JAMAIS faire

- Modifier `types/database.types.ts` manuellement
- Utiliser `fetch` dans un Server Component pour appeler sa propre API Next.js
- Mettre de la logique métier dans les composants UI
- Importer `createClient` de Supabase autre part que `lib/supabase/`
- Utiliser `new Resend()` au niveau module (toujours dans la fonction)
- Faire confiance aux données client pour les calculs financiers — toujours recalculer côté serveur
- Mettre des clés privées dans le code

## En cas de doute

1. Regarder comment c'est fait ailleurs dans le projet
2. Consulter `BRIEF.md` pour le contexte métier
3. Consulter `SPEC.md` pour les specs détaillées
4. Ne pas inventer — demander si incertain
