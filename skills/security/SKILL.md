---
name: aiactio-security
description: Utiliser pour tout audit de securite, ajout de Server Actions, modification de politiques RLS, gestion de cles API, ou revue de code sensible dans aiactio. Contient la checklist complete, les gotchas critiques, et un script d'audit automatique.
---

# Security — aiactio

## Structure du skill

- `references/rls-patterns.md` — politiques RLS par table, patterns avances
- `scripts/audit-security.sh` — scan automatique des failles courantes
- `assets/middleware-template.ts` — template middleware Next.js avec auth

## Regles non-negociables

1. **Toute Server Action = endpoint HTTP public** — toujours `getUser()` en premier
2. **Validation Zod obligatoire** — les types TypeScript ne protegent pas au runtime
3. **RLS sur toutes les tables user-data** — sans exception
4. **`SUPABASE_SERVICE_ROLE_KEY`** jamais dans un composant client ou expose
5. **`user_id` = `auth.uid()`** dans tous les inserts — jamais fourni par le client
6. **`consent_logs` immuable** — policies SELECT + INSERT uniquement, jamais UPDATE/DELETE
7. **Messages d'erreur generiques en prod** — jamais de stack trace ou details internes
8. **Middleware protege `/dashboard/*`** — redirect vers `/login` si non authentifie

## Checklist Server Action

```typescript
'use server'
// 1. Authentification — TOUJOURS en premier
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { success: false, error: 'Non authentifie' }

// 2. Validation Zod — AVANT tout traitement
const parsed = schema.safeParse(input)
if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

// 3. Autorisation — verifier que l'user peut agir sur CETTE ressource
const { data: resource } = await supabase.from('resources').select('user_id').eq('id', id).single()
if (!resource || resource.user_id !== user.id) return { success: false, error: 'Non autorise' }

// 4. Erreur generique — jamais de details internes
if (error) return { success: false, error: 'Erreur serveur' } // pas error.message
```

## Checklist RLS

Pour chaque nouvelle table :
```sql
-- Activer RLS
ALTER TABLE ma_table ENABLE ROW LEVEL SECURITY;

-- SELECT : l'user voit uniquement ses donnees
CREATE POLICY "users_select_own" ON ma_table
  FOR SELECT USING (user_id = auth.uid());

-- INSERT : l'user ne peut inserer que pour lui-meme
CREATE POLICY "users_insert_own" ON ma_table
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- UPDATE : l'user ne peut modifier que ses donnees
CREATE POLICY "users_update_own" ON ma_table
  FOR UPDATE USING (user_id = auth.uid());

-- DELETE : l'user ne peut supprimer que ses donnees
CREATE POLICY "users_delete_own" ON ma_table
  FOR DELETE USING (user_id = auth.uid());
```

Exception `consent_logs` — SELECT + INSERT uniquement, jamais UPDATE/DELETE.

## Middleware

Le fichier `middleware.ts` a la racine doit proteger `/dashboard/*` :
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* ... */ } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = { matcher: ['/dashboard/:path*'] }
```

## Gotchas — failles courantes

**G1 : oublier `getUser()` dans une Server Action**
Les Server Actions sont appelables directement via fetch. Sans auth, elles sont publiques.
Premiere instruction apres les imports, sans exception.

**G2 : faire confiance a `user_id` venant du client**
`formData.get('user_id')` ou `body.userId` peuvent etre falsifies.
Toujours utiliser `user.id` depuis `auth.getUser()` cote serveur.

**G3 : utiliser `getSession()` au lieu de `getUser()`**
`getSession()` lit depuis le cookie local sans validation serveur — peut etre manipule.
`getUser()` valide aupres du serveur Supabase — securise.

**G4 : exposer `SUPABASE_SERVICE_ROLE_KEY`**
Cette cle bypasse RLS entierement. Si elle fuite, n'importe qui peut tout lire/ecrire.
Uniquement dans `lib/supabase/service.ts`, jamais dans un composant, jamais en `NEXT_PUBLIC_`.

**G5 : messages d'erreur trop detailles**
`return { error: error.message }` peut exposer la structure de la DB, les colonnes, les contraintes.
Toujours `return { success: false, error: 'Erreur serveur' }` en production.

**G6 : RLS manquante sur une nouvelle table**
Par defaut Supabase cree les tables SANS RLS. Ne jamais oublier `ENABLE ROW LEVEL SECURITY`.
Verifier avec : `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`

**G7 : validation TypeScript sans Zod**
TypeScript est efface au runtime. `input: string` ne garantit rien en Server Action.
Zod valide les vraies donnees recues, pas juste les types.

## Voir aussi
- `references/rls-patterns.md` — politiques par table, patterns avances
- `scripts/audit-security.sh` — scan automatique des failles
