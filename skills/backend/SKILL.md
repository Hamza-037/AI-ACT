---
name: aiactio-backend
description: Patterns backend pour le projet aiactio. Utiliser pour toute creation ou modification de Server Actions, requetes Supabase, actions CRUD, logique metier, Server Components fetching data. Contient les regles strictes du projet sur les Server Actions, les patterns Supabase/RLS, les types TypeScript et la structure des actions.
---

# Backend — aiactio

## Regles absolues

- **Server Actions** dans `lib/actions/` uniquement — jamais dans des composants
- **Jamais `any`** — utiliser `unknown` + type guards ou `as unknown as DTO` sur les JOINs
- **`user_id` = `auth.uid()`** cote serveur, jamais fourni par le client
- **`SUPABASE_SERVICE_ROLE_KEY`** uniquement dans `lib/supabase/service.ts` — jamais dans les composants
- **RLS activé** sur toutes les tables user-data
- **Migrations forward-only** dans `supabase/migrations/`
- **AI logging fire-and-forget** : `void logAiUsage(...)` — jamais bloquant

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

  const db = supabase as unknown as DbClient // jamais 'as any'
  const { data, error } = await db.from('items').insert({
    user_id: user.id, // TOUJOURS auth.uid(), jamais client-provided
    ...parsed.data,
  }).select().single()

  if (error) return { success: false, error: 'Erreur serveur' }
  revalidatePath('/dashboard')
  return { success: true, data: data as Item }
}
```

## Pattern Supabase JOIN

Pour les JOINs, le query builder retourne un type générique. Utiliser :
```typescript
const { data } = await db.from('systemes_ia')
  .select('*, organizations(nom)')
  .eq('id', id)
  .single() as { data: SystemeAvecOrg | null }
// Jamais: as any
// Correct: as { data: MonType | null }
```

## Guards plans

Avant toute creation de ressource, verifier les limites :
```typescript
import { canAddSysteme } from '@/lib/guards/plans'
const { allowed, reason } = await canAddSysteme(orgId)
if (!allowed) return { success: false, error: reason }
```

Les guards ne bloquent **jamais** la lecture — uniquement la creation.

## ActionResult type

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

Toujours retourner `ActionResult<T>` depuis les Server Actions — jamais `throw`.

## Voir aussi
- `references/supabase-patterns.md` — patterns RLS et service client
- `references/ai-integration.md` — appels OpenRouter, logging usage
