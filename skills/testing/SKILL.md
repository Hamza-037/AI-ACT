---
name: aiactio-testing
description: Patterns de tests pour le projet aiactio avec Vitest. Utiliser pour creer ou modifier des tests unitaires, des tests de logique metier, des tests de guards, ou pour atteindre un objectif de couverture. Couvre les patterns de mocking Supabase, les tests de Server Actions, et les conventions du projet.
---

# Testing — aiactio

## Setup

- **Framework** : Vitest 4.x
- **Commande** : `npm test -- --run` (run unique) ou `npm test` (watch)
- **Fichiers** : `__tests__/*.test.ts` a la racine
- **Objectif couverture** : 100+ tests, 0 skip

## Ce qu'on teste avec Vitest

- Logique pure (classificateurs, calculs, formatages)
- Guards et limites des plans
- Schemas Zod et validations
- Utilitaires (`calculerScore`, `calculerJoursRestants`)
- Contenu statique (OBLIGATION_LABELS, LITERACY_MODULES)

## Ce qu'on ne teste PAS avec Vitest

- Appels DB reel Supabase → mocker
- Appels Stripe reel → mocker
- Rendu des composants React → Playwright (E2E, pas encore implemente)
- Server Actions dans leur integralite → tester la logique sous-jacente isolement

## Pattern test standard

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { maFonction } from '@/lib/utils/ma-fonction'

describe('maFonction', () => {
  it('retourne X quand Y', () => {
    const result = maFonction({ input: 'valeur' })
    expect(result).toBe('attendu')
  })

  it('gere les cas limites', () => {
    expect(maFonction({ input: '' })).toEqual({ success: false })
  })
})
```

## Pattern mock Supabase

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } }
      })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { organization_id: 'org-123' }, error: null }),
    })
  })
}))
```

## Pattern mock next/navigation

```typescript
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}))
```

## Conventions

- Un `describe` par module/fonction
- Noms en francais : `'retourne une erreur si non authentifie'`
- `beforeEach(() => vi.clearAllMocks())` dans chaque describe avec mocks
- Jamais de `test.skip` ou `it.skip` sans commentaire justificatif
- Tester les happy paths ET les cas d'erreur

## Commande validate complete

```bash
npm run lint && npx tsc --noEmit && npm test -- --run && npm run build
```
Tout doit passer a 0 erreur avant chaque commit.
