---
name: aiactio-testing
description: Utiliser quand on cree ou modifie des tests Vitest dans aiactio, qu'on veut atteindre un objectif de couverture, ou qu'on veut verifier qu'un build est propre avant un commit. Contient les patterns de mock, les conventions du projet, et un script de verification complete.
---

# Testing — aiactio

## Structure du skill

- `references/mock-patterns.md` — mocks Supabase, Stripe, next/navigation complets
- `scripts/run-validate.sh` — lint + tsc + tests + build en une commande
- `assets/test-template.ts` — template de fichier de test pret a copier

## Setup

- **Framework** : Vitest 4.x
- **Commande rapide** : `npm test -- --run`
- **Commande watch** : `npm test`
- **Fichiers** : `__tests__/*.test.ts` a la racine
- **Objectif** : 0 skip, 0 todo, tests passants avant chaque commit

## Ce qu'on teste

- Logique pure : `classifierSysteme()`, `calculerScore()`, `calculerJoursRestants()`
- Guards et limites des plans : `canAddSysteme()`, `canAccessLiteracy()`
- Schemas Zod : validation des entrees
- Utilitaires : formatages, calculs, constantes
- Contenu statique : `OBLIGATION_CODES`, `LITERACY_MODULES`, `PLAN_FEATURES`

## Ce qu'on ne teste PAS avec Vitest

- Appels DB reels Supabase → mocker avec `vi.mock`
- Appels Stripe reels → mocker
- Rendu React → Playwright (E2E, non encore implemente)
- Server Actions end-to-end → tester la logique sous-jacente isolement

## Pattern test standard

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { maFonction } from '@/lib/utils/ma-fonction'

describe('maFonction', () => {
  it('retourne le bon resultat pour une entree valide', () => {
    const result = maFonction({ input: 'valeur' })
    expect(result).toBe('attendu')
  })

  it('gere les cas limites — input vide', () => {
    expect(maFonction({ input: '' })).toEqual({ success: false, error: expect.any(String) })
  })

  it('gere les cas limites — input null', () => {
    // @ts-expect-error test cas limite
    expect(() => maFonction(null)).not.toThrow()
  })
})
```

## Pattern mock Supabase complet

```typescript
import { vi, beforeEach } from 'vitest'

// Mock chainable — couvre select().eq().single() etc.
const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'user-test-123' } }, error: null
    })
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: { id: 'item-123' }, error: null }),
    // Pour les listes :
    // Surcharger avec : .mockResolvedValue({ data: [], error: null })
  })
}

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn().mockResolvedValue(mockSupabase)
}))

beforeEach(() => vi.clearAllMocks())
```

## Pattern mock next/navigation

```typescript
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), replace: vi.fn() }),
  usePathname: vi.fn().mockReturnValue('/dashboard'),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))
```

## Conventions obligatoires

- Un `describe` par module/fonction testee
- Noms en francais : `'retourne une erreur si non authentifie'`
- `beforeEach(() => vi.clearAllMocks())` dans chaque describe avec mocks
- Jamais de `test.skip` ou `it.skip` sans commentaire justificatif
- Tester happy path + cas d'erreur + cas limites

## Gotchas — erreurs frequentes

**G1 : mock Supabase non chainable**
Le query builder est chainable (`.select().eq().single()`). Si le mock ne retourne pas `this`, le test plante.
Utiliser `mockReturnThis()` sur toutes les methodes de chaine.

**G2 : `vi.clearAllMocks()` manquant**
Les mocks gardent l'etat entre les tests → faux positifs et faux negatifs.
Toujours `beforeEach(() => vi.clearAllMocks())` dans chaque describe avec mocks.

**G3 : tester uniquement les happy paths**
Un test qui ne teste que le cas qui marche ne detecte pas les regressions.
Pour chaque fonction : au minimum 1 cas succes + 1 cas erreur.

**G4 : mock `next/headers` manquant**
Les Server Actions qui appellent `cookies()` ou `headers()` ont besoin de ce mock.
Ajouter `vi.mock('next/headers', () => ({ cookies: vi.fn() }))` si necessaire.

**G5 : oublier de mocker `revalidatePath`**
Les Server Actions qui appellent `revalidatePath()` vont planter sans mock.
Toujours inclure dans le mock `next/cache`.

## Commande validate complete

```bash
npm run lint && npx tsc --noEmit && npm test -- --run && npm run build
```

Tout doit passer a 0 erreur. C'est la definition d'un commit valide.

## Voir aussi
- `references/mock-patterns.md` — mocks complets prets a copier
- `assets/test-template.ts` — fichier de test complet pret a adapter
