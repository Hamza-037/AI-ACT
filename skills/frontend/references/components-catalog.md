# Catalogue composants — aiactio

## Composants shadcn/ui disponibles

Importer depuis `@/components/ui/` :
- `Card, CardContent, CardHeader, CardTitle`
- `Badge`
- `Input, Label`
- `Select, SelectContent, SelectItem, SelectTrigger, SelectValue`
- `Progress`

**shadcn/ui v4 spécificités :**
- `Button` : n'a **pas** de prop `asChild` — utiliser `<Link>` + classes Tailwind pour les liens-boutons
- Variantes Button disponibles : `default`, `destructive`, `outline`, `ghost`, `link`

## Composants layout

- `components/layout/Sidebar.tsx` — sidebar dark slate-950
- `components/layout/Header.tsx` — header blanc avec bell + avatar
- `components/plans/PlanCard.tsx` — card plan Stripe avec CTA
- `components/plans/UpgradePrompt.tsx` — bannière upgrade
- `components/literacy/ModuleViewer.tsx` — viewer quiz literacy

## Pages dashboard

| Route | Composant | Type |
|-------|-----------|------|
| `/dashboard` | `app/dashboard/page.tsx` | Server |
| `/dashboard/registre` | `app/dashboard/registre/page.tsx` | Server |
| `/dashboard/checklist` | `app/dashboard/checklist/page.tsx` | Server |
| `/dashboard/checklist/[code]` | `app/dashboard/checklist/[code]/page.tsx` | Server |
| `/dashboard/literacy` | `app/dashboard/literacy/page.tsx` | Server |
| `/dashboard/literacy/[moduleId]` | `app/dashboard/literacy/[moduleId]/page.tsx` | Server |
| `/dashboard/plans` | `app/dashboard/plans/page.tsx` | Server |

## Icons fréquents

```tsx
import {
  ShieldCheck,        // logo aiactio
  CheckCircle2,       // statut conforme
  XCircle,            // statut non conforme
  AlertCircle,        // warning / en cours
  Clock,              // deadline / urgence
  ArrowRight,         // CTA navigation
  ArrowLeft,          // retour
  Bot,                // systeme IA
  GraduationCap,      // literacy
  ClipboardCheck,     // checklist
  CreditCard,         // plans/billing
  ExternalLink,       // lien externe
  Check,              // feature list
} from 'lucide-react'
```
