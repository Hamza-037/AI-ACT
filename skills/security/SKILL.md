---
name: aiactio-security
description: Regles et patterns de securite pour le projet aiactio. Utiliser pour tout audit de securite, ajout de nouvelles Server Actions, modifications des politiques RLS, gestion des cles API, validation des entrees, ou revue de code sensible. Couvre l'authentification, l'autorisation, RLS Supabase, validation Zod, protection CSRF et gestion des secrets.
---

# Security — aiactio

## Regles non-negociables

1. **Toute Server Action = endpoint HTTP public** — toujours authentifier + autoriser
2. **Validation Zod obligatoire** sur toutes les entrees utilisateur — les types TypeScript ne suffisent pas
3. **RLS sur toutes les tables** user-data — sans exception
4. **`SUPABASE_SERVICE_ROLE_KEY`** jamais expose cote client
5. **`user_id` = `auth.uid()`** dans tous les inserts — jamais fourni par le client
6. **`consent_logs` immuable** — policies SELECT + INSERT uniquement, jamais UPDATE/DELETE
7. **Erreurs generiques en prod** — jamais de details internes dans les messages d'erreur

## Checklist securite Server Action

```typescript
'use server'
// 1. Authentification
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { success: false, error: 'Non authentifie' }

// 2. Validation Zod
const parsed = schema.safeParse(input)
if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

// 3. Autorisation (l'user peut-il agir sur cette ressource ?)
const org = await getOrgForUser(user.id)
if (org.id !== resourceOrgId) return { success: false, error: 'Acces interdit' }

// 4. Guard plans (creation uniquement, jamais pour la lecture)
const { allowed } = await canAddSysteme(org.id)
if (!allowed) return { success: false, error: 'Limite atteinte' }

// 5. Action DB
// user_id = user.id — jamais formData.get('user_id')
```

## RLS patterns

```sql
-- Politique SELECT standard
CREATE POLICY "users_select_own_org" ON systemes_ia
  FOR SELECT USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE id = (SELECT auth.uid())
    )
  );

-- INDEX obligatoire sur les colonnes utilisées dans les policies
CREATE INDEX idx_systemes_ia_org ON systemes_ia(organization_id);
```

## Variables d'environnement

| Variable | Exposition | Usage |
|----------|-----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client OK | URL publique |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client OK | Clé publique avec RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server ONLY | Bypass RLS (webhooks) |
| `STRIPE_SECRET_KEY` | Server ONLY | API Stripe |
| `STRIPE_WEBHOOK_SECRET` | Server ONLY | Signature webhook |
| `OPENROUTER_API_KEY` | Server ONLY | Appels IA |
| `CRON_SECRET` | Server ONLY | Auth routes cron |

## Validation des variables serveur-only

```typescript
// Placer en haut des fichiers server-only
if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY manquant')
```

## Webhook Stripe — securite

```typescript
// Toujours verifier la signature
event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
// Toujours verifier l'idempotence avant de traiter
const exists = await checkEventProcessed(event.id)
if (exists) return NextResponse.json({ received: true })
```

## Voir aussi
- `references/rls-policies.md` — toutes les policies RLS du projet
- `references/validation-schemas.md` — schemas Zod standards
