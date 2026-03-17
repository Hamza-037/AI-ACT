# Supabase Patterns — aiactio

## Clients disponibles

| Client | Fichier | Usage |
|--------|---------|-------|
| Server (SSR) | `lib/supabase/server.ts` | Server Components, Server Actions |
| Service Role | `lib/supabase/service.ts` | Webhooks, crons, opérations admin |
| Browser | `lib/supabase/client.ts` | Client Components uniquement |

**Règle** : `getServiceRoleClient()` = singleton. Ne jamais instancier `createClient()` avec service key directement.

## Pattern auth dans Server Action

```typescript
const supabase = await createServerClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { success: false, error: 'Non authentifie' }

// Récupérer l'org
const db = supabase as unknown as DbClient
const { data: profile } = await db.from('profiles')
  .select('organization_id')
  .eq('id', user.id)
  .single() as { data: { organization_id: string | null } | null }
```

## RLS — règles appliquées

Toutes les tables ont RLS. Politiques standards :
- `SELECT` : `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
- `INSERT` : `organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())`
- `UPDATE/DELETE` : même pattern
- `consent_logs` : SELECT + INSERT uniquement — jamais UPDATE/DELETE

## Performance RLS

- Indexer les colonnes utilisées dans les policies (`organization_id`, `user_id`)
- Wraper `auth.uid()` dans SELECT : `(SELECT auth.uid()) = user_id` pour stabiliser le plan d'exécution

## Workaround types TypeScript

`database.types.ts` est un placeholder — les types générés ne correspondent pas aux requêtes complexes.
Pattern approuvé :
```typescript
const db = supabase as unknown as {
  from: (t: string) => {
    select: (c: string) => { eq: (...) => Promise<{data: MonType | null}> }
    insert: (data: unknown) => { select: () => { single: () => Promise<...> } }
    upsert: (data: unknown, opts?: unknown) => Promise<{error: unknown}>
  }
}
```

## Jamais

- `SUPABASE_SERVICE_ROLE_KEY` dans un composant client
- `createClient()` avec la service key en dehors de `lib/supabase/service.ts`
- `delete()` ou `update()` sur `consent_logs`
