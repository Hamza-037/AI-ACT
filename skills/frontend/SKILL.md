---
name: aiactio-frontend
description: Patterns UI/UX pour le projet aiactio. Utiliser pour toute creation ou modification de composants React, pages, layouts, formulaires, animations, design system. Contient les regles de design, les composants shadcn/ui v4, les patterns mobile-first et les conventions CSS Tailwind du projet.
---

# Frontend — aiactio

## Regles absolues

- **ZERO emoji dans le code** — non negociable, aucune exception
- **Lucide icons uniquement** — tailles autorisees : `h-4 h-5 h-6 h-8` seulement
- **Mobile-first** — CTA buttons minimum `h-11` (44px), bottom sheets pour les modals
- **Autosave permanent** — jamais de bouton "Save" manuel
- **Pas de `backdrop-filter: blur()`** sur `position: sticky` (bug Safari iOS)
- **Server Components par defaut** — `'use client'` uniquement si hooks/interactivite indispensable
- **Jamais `useEffect`** pour du data fetching
- **shadcn/ui v4** (`@base-ui/react`) — Button n'a **pas** de prop `asChild`

## Design system

### Palette principale
- Fond app : `bg-slate-50`
- Sidebar : `bg-slate-950`
- Cards : `bg-white rounded-2xl border shadow-sm`
- Primaire : `bg-blue-600` / `text-blue-600`
- Danger : `text-red-600` / `bg-red-50`
- Succes : `text-green-600` / `bg-green-50`

### Composants standards

**Card metrique dashboard :**
```tsx
<div className="rounded-2xl border bg-white p-5 shadow-sm space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-slate-500">Libelle</span>
    <Icon className="h-5 w-5 text-slate-300" />
  </div>
  <p className="text-3xl font-bold text-slate-900">Valeur</p>
  <p className="text-xs text-slate-400">Sous-texte</p>
</div>
```

**Bouton primaire (liens) :**
```tsx
<Link href="/..." className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors">
  Libelle
</Link>
```

**Bouton action (client) :**
```tsx
<button type="submit" disabled={isPending} className="inline-flex items-center justify-center h-11 w-full rounded-xl bg-blue-600 text-primary-foreground text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-50">
  {isPending ? 'Chargement...' : 'Confirmer'}
</button>
```

**Badge statut :**
```tsx
// conforme
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">Conforme</span>
// en_cours
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">En cours</span>
// non_conforme
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800">Non conforme</span>
```

## Patterns formulaires

```tsx
'use client'
import { useTransition } from 'react'
import { myAction } from '@/lib/actions/...'

export function MyForm() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await myAction(formData)
      if (!result.success) { /* afficher erreur */ }
    })
  }
  // ...
}
```

## Navigation

- Liens boutons via `<Link>` + classes Tailwind directement (pas `Button asChild`)
- Icones dans sidebar : `h-4 w-4 shrink-0`
- Item actif sidebar : `bg-blue-600 text-white`
- Item inactif : `text-slate-400 hover:text-white hover:bg-slate-800`

## Voir aussi
- `references/components-catalog.md` — catalogue complet des composants disponibles
- `references/responsive-patterns.md` — patterns mobile/desktop
