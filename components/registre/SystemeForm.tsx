'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createSystem, updateSystem } from '@/lib/actions/systemes'
import { classifierSysteme } from '@/lib/utils/classifier'
import { OUTILS_CONNUS } from '@/lib/registre/outils-connus'
import { NIVEAU_RISQUE_LABELS, NIVEAU_RISQUE_CLASSES } from '@/lib/registre/badges'
import type { NiveauRisque, SystemeIA } from '@/types/shared.types'

const DEPARTEMENTS = ['RH', 'Finance', 'Marketing', 'Support', 'IT', 'Direction', 'Autre']

type Props = {
  systeme?: SystemeIA
}

export function SystemeForm({ systeme }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [nom, setNom] = useState(systeme?.nom ?? '')
  const [fournisseur, setFournisseur] = useState(systeme?.fournisseur ?? '')
  const [departement, setDepartement] = useState(systeme?.departement ?? '')
  const [usage, setUsage] = useState(systeme?.usage ?? '')
  const [decisionsAutonomes, setDecisionsAutonomes] = useState(
    systeme?.decisions_autonomes ?? false
  )
  const [notes, setNotes] = useState(systeme?.notes ?? '')

  const [suggestions, setSuggestions] = useState<typeof OUTILS_CONNUS>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const niveauRisque: NiveauRisque = classifierSysteme({
    nom,
    fournisseur: fournisseur || null,
    usage: usage || null,
    departement: departement || null,
    decisions_autonomes: decisionsAutonomes,
  })

  function handleNomChange(value: string) {
    setNom(value)
    if (value.length >= 1) {
      const matches = OUTILS_CONNUS.filter((o) =>
        o.nom.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  function handleSelectSuggestion(outil: (typeof OUTILS_CONNUS)[0]) {
    setNom(outil.nom)
    setFournisseur(outil.fournisseur)
    // Map category to department if possible
    const cat = outil.categorie.toLowerCase()
    if (cat.includes('rh') || cat.includes('recrutement')) setDepartement('RH')
    else if (cat.includes('finance') || cat.includes('crédit')) setDepartement('Finance')
    else if (cat.includes('marketing')) setDepartement('Marketing')
    else if (cat.includes('support')) setDepartement('Support')
    else if (cat.includes('it') || cat.includes('développement')) setDepartement('IT')
    setShowSuggestions(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const payload = {
      nom,
      fournisseur: fournisseur || null,
      usage: usage || null,
      departement: departement || null,
      decisions_autonomes: decisionsAutonomes,
      notes: notes || null,
    }

    startTransition(async () => {
      const result = systeme
        ? await updateSystem(systeme.id, payload)
        : await createSystem(payload)

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push('/dashboard/registre')
    })
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {systeme ? 'Modifier le système' : 'Informations du système'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom avec autocomplete */}
          <div className="space-y-2 relative">
            <Label htmlFor="nom">Nom de l&apos;outil *</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => handleNomChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="ex: ChatGPT Enterprise, Workday..."
              required
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((o) => (
                  <button
                    key={o.nom}
                    type="button"
                    onMouseDown={() => handleSelectSuggestion(o)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{o.nom}</span>
                    <span className="text-muted-foreground ml-2">— {o.categorie}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fournisseur */}
          <div className="space-y-2">
            <Label htmlFor="fournisseur">Fournisseur</Label>
            <Input
              id="fournisseur"
              value={fournisseur}
              onChange={(e) => setFournisseur(e.target.value)}
              placeholder="ex: OpenAI, Microsoft..."
            />
          </div>

          {/* Département */}
          <div className="space-y-2">
            <Label htmlFor="departement">Département</Label>
            <Select value={departement} onValueChange={(v) => setDepartement(v ?? '')}>
              <SelectTrigger id="departement">
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTEMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Usage */}
          <div className="space-y-2">
            <Label htmlFor="usage">Description de l&apos;usage</Label>
            <Textarea
              id="usage"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="Décrivez comment vous utilisez ce système dans votre entreprise..."
              rows={3}
            />
          </div>

          {/* Décisions autonomes */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Décisions automatiques</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ce système prend-il des décisions sans validation humaine ?
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={decisionsAutonomes}
              onClick={() => setDecisionsAutonomes((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                decisionsAutonomes ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  decisionsAutonomes ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes internes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes internes, contexte, responsable..."
              rows={2}
            />
          </div>

          {/* Preview niveau de risque */}
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Niveau de risque estimé :</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 ${NIVEAU_RISQUE_CLASSES[niveauRisque]}`}
            >
              {NIVEAU_RISQUE_LABELS[niveauRisque]}
            </span>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending} className="h-11">
              {isPending
                ? 'Enregistrement...'
                : systeme
                  ? 'Mettre à jour'
                  : 'Enregistrer le système'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => router.push('/dashboard/registre')}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
