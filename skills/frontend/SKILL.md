---
name: aiactio-frontend
description: Utiliser quand on cree ou modifie un composant React, une page, un layout, un formulaire, ou tout element visuel dans aiactio. Contient le design system exact du projet, les gotchas shadcn/ui v4, les patterns mobiles-first, et un catalogue de composants prets a l'emploi.
---

# Frontend — aiactio

## Structure du skill

- `references/components-catalog.md` — catalogue complet des composants disponibles
- `references/responsive-patterns.md` — patterns mobile/desktop
- `assets/page-template.tsx` — template de page dashboard pret a copier
- `assets/form-template.tsx` — template de formulaire avec useTransition

## Regles absolues

- **ZERO emoji dans le code** — non negociable, aucune exception, jamais
- **Lucide icons uniquement** — tailles autorisees : `h-4 h-5 h-6 h-8` seulement
- **Mobile-first** — CTA buttons minimum `h-11` (44px), bottom sheets pour les modals
- **Server Components par defaut** — `'use client'` uniquement si hooks React necessaires
- **Jamais `useEffect`** pour du data fetching — utiliser Server Components
- **shadcn/ui v4** — Button n'a **pas** de prop `asChild`, utiliser `<Link>` + classes Tailwind

## Design system

### Fond et surfaces
- Fond app : `bg-slate-50`
- Sidebar : `bg-slate-950` (ou `bg-[#0f0f1a]`)
- Cards : `bg-white rounded-2xl border shadow-sm`
- Landing fond : `bg-[#FAFAF8]` (creme)
- Landing dark sections : `bg-slate-900`

### Couleurs
- Accent : `blue-600` (utilise avec parcimonie)
- Texte principal : `text-slate-900`
- Texte secondaire : `text-slate-500` / `text-slate-400`
- Bordures : `border-slate-100` / `border-slate-200`
- Boutons landing : `bg-slate-900 text-white` (noir, pas bleu)

### Typographie landing
- H1 hero : `text-6xl lg:text-7xl font-black tracking-tight`
- H2 section : `text-4xl font-bold`
- Corps : `text-lg text-slate-600`

## Composants standards

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

**Bouton primaire (lien) :**
```tsx
<Link href="/..." className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors">
  Libelle
</Link>
```

**Bouton landing (noir) :**
```tsx
<Link href="/..." className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
  Libelle
</Link>
```

**Badge statut :**
```tsx
// conforme → vert
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">Conforme</span>
// en_cours → orange
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">En cours</span>
// non_conforme → rouge
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800">Non conforme</span>
```

**Sidebar item actif :**
```tsx
<Link href="..." className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-400 border-r-2 border-blue-500 font-medium text-sm">
  <Icon className="h-4 w-4 shrink-0" />
  Libelle
</Link>
```

## Pattern formulaire avec Server Action

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

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isPending}
        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50">
        {isPending ? 'Chargement...' : 'Confirmer'}
      </button>
    </form>
  )
}
```

## Gotchas — erreurs frequentes

**G1 : `Button asChild` de shadcn/ui v4**
shadcn/ui v4 utilise `@base-ui/react`. Le composant Button n'a PAS de prop `asChild`.
Ne jamais ecrire `<Button asChild><Link href="...">`. Utiliser directement `<Link className="...">`.

**G2 : `backdrop-filter: blur()` sur `position: sticky`**
Provoque un ecran noir sur Safari iOS — bug connu et non corrige.
Ne jamais combiner `backdrop-blur-*` avec `sticky`. Utiliser `bg-white/95` ou fond opaque.

**G3 : `useEffect` pour fetcher des donnees**
Cree des waterfalls, hydration mismatches, et double renders.
Fetcher dans les Server Components directement avec `async/await`.

**G4 : taille d'icone Lucide non autorisee**
Seules `h-4 h-5 h-6 h-8` sont autorisees. Pas de `h-3`, `h-7`, `h-10`, etc.
Pour les icones decoratives : `h-5 w-5`. Pour les icones de navigation : `h-4 w-4`.

**G5 : bouton de taille inferieure a 44px**
Les boutons doivent faire minimum `h-11` (44px) pour les cibles tactiles mobiles.
Jamais de `h-8` ou `h-9` pour des CTA principaux.

**G6 : emoji dans le code**
ZERO emoji. Meme dans les commentaires, les messages d'erreur, les labels.
Utiliser des icones Lucide a la place.

**G7 : `'use client'` inutile**
Ne mettre `'use client'` que si le composant utilise des hooks React (useState, useEffect, useTransition, etc.) ou des event handlers directement dans le JSX.
Les composants qui passent juste des props n'ont pas besoin de `'use client'`.

## Navigation sidebar

```tsx
// Liens — PAS de Button asChild
<Link href="/dashboard/registre" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">
  <Database className="h-4 w-4 shrink-0" />
  Registre IA
</Link>
```

## Voir aussi
- `references/components-catalog.md` — tous les composants existants dans le projet
- `references/responsive-patterns.md` — breakpoints, patterns mobile/desktop
- `assets/page-template.tsx` — page dashboard complete prete a adapter
