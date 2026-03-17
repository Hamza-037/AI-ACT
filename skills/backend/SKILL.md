---
name: aiactio-backend
description: Utiliser quand on cree ou modifie une Server Action, une requete Supabase, une logique metier, un guard de plan, ou un appel OpenRouter dans aiactio. Contient les patterns stricts du projet, les gotchas frequents, et des scripts de verification.
---

# Backend — aiactio

## Structure du skill

- `references/supabase-patterns.md` — patterns RLS, service client, JOINs
- `references/ai-integration.md` — OpenRouter, logging usage
- `references/action-templates.md` — templates complets prets a copier
- `scripts/verify-actions.sh` — verifie qu'aucune action n'a de faille auth

## Regles absolues

- **Server Actions** dans `lib/actions/` uniquement — jamais inline dans les composants
- **Jamais `any`** — `unknown` + type guards, ou `as unknown as DTO` sur JOINs uniquement
- **`user_id` = `auth.uid()` cote serveur** — jamais fourni par le client, jamais trust le body
- **`SUPABASE_SERVICE_ROLE_KEY`** uniquement dans `lib/supabase/service.ts`
- **RLS activee** sur toutes les tables user-data sans exception
- **Migrations forward-only** dans `supabase/migrations/`
- **`void logAiUsage(...)`** — fire-and-forget, jamais await

## Pattern Server Action standard

```typescript
'use server'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { ActionResult } from '@/types/shared.types'

const schema = z.object({ nom: z.string().min(1).max(255) })

export async function createItem(formData: FormData): Promise<ActionResult<Item>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifie' }

  const parsed = schema.safeParse({ nom: formData.get('nom') })
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { data, error } = await (supabase as unknown as DbClient)
    .from('items')
    .insert({ user_id: user.id, ...parsed.data })
    .select()
    .single()

  if (error) return { success: false, error: 'Erreur serveur' }
  revalidatePath('/dashboard')
  return { success: true, data: data as Item }
}
```

## Gotchas — erreurs frequentes

**G1 : oublier `auth.getUser()` dans une Server Action**
Les Server Actions sont des endpoints HTTP publics. Sans getUser(), n'importe qui peut les appeler.
Toujours la premiere ligne apres les imports.

**G2 : `as any` sur un resultat Supabase JOIN**
Le query builder retourne un type generique incompatible. Ne pas faire `as any`.
Faire : `as unknown as MonType` ou destructurer avec un type explicite.

**G3 : instancier `new Resend()` au top-level du module**
Cause des erreurs au build si `RESEND_API_KEY` est absent en dev.
Toujours instancier dans la fonction : `const resend = new Resend(process.env.RESEND_API_KEY)`

**G4 : `await logAiUsage(...)` bloquant le retour**
Le logging IA ne doit jamais ralentir la reponse. Toujours `void logAiUsage(...)`.

**G5 : guard qui bloque la lecture**
Les guards ne bloquent que la CREATION de nouvelles ressources.
`canAddSysteme()` → uniquement avant un INSERT, jamais avant un SELECT.

**G6 : migration qui modifie des donnees existantes**
Les migrations sont forward-only. Ne jamais DROP de colonnes avec donnees, utiliser une migration en 2 etapes (colonne nullable, puis suppression dans une migration separee).

**G7 : `consent_logs` — table immuable**
Policies : SELECT + INSERT uniquement. Jamais UPDATE/DELETE. Ne pas ajouter ces policies meme si ca semble logique.

## Guards plans

Avant toute creation de ressource :
```typescript
import { canAddSysteme } from '@/lib/guards/plans'
const { allowed, reason } = await canAddSysteme(orgId)
if (!allowed) return { success: false, error: reason }
```

Guards disponibles dans `lib/guards/plans.ts` :
- `canAddSysteme(orgId)` — limite registre IA
- `canAddUtilisateur(orgId)` — limite membres
- `canAccessDocuments(orgId)` — plan pro+
- `canAccessLiteracy(orgId)` — plan pro+

## ActionResult type

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

Toujours retourner `ActionResult<T>` — jamais `throw` depuis une Server Action.

## Voir aussi
- `references/supabase-patterns.md` — RLS, service client, patterns avances
- `references/ai-integration.md` — OpenRouter, models constants, logging
- `references/action-templates.md` — templates complets prets a l'emploi
