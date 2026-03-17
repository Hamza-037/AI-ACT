'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { completeOnboarding } from '@/lib/actions/profile'

const SECTEURS = ['Industrie', 'Services', 'Commerce', 'Finance', 'Sante', 'Tech', 'Autre']
const TAILLES = ['<10', '10-49', '50-249', '250-499', '500+']
const POSTES = ['DRH', 'DAF', 'DSI', 'DPO', 'Juriste', 'Dirigeant', 'Autre']
const OUTILS_IA = [
  'CRM avec scoring',
  'Outils RH IA',
  'Chatbot client',
  'Copilot/Assistant IA',
  'Outil de scoring financier',
  "Aucun pour l'instant",
]

type Step1Data = {
  orgNom: string
  secteur: string
  taille: string
}

type Step2Data = {
  prenom: string
  nom: string
  poste: string
}

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [step1, setStep1] = useState<Step1Data>({ orgNom: '', secteur: '', taille: '' })
  const [step2, setStep2] = useState<Step2Data>({ prenom: '', nom: '', poste: '' })
  const [outilsIA, setOutilsIA] = useState<string[]>([])

  function toggleOutil(outil: string) {
    setOutilsIA((prev) =>
      prev.includes(outil) ? prev.filter((o) => o !== outil) : [...prev, outil]
    )
  }

  function handleStep1Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!step1.orgNom.trim()) {
      setError("Le nom de l'organisation est obligatoire")
      return
    }
    setError(null)
    setStep(2)
  }

  function handleStep2Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!step2.prenom.trim() || !step2.nom.trim()) {
      setError('Le prénom et le nom sont obligatoires')
      return
    }
    setError(null)
    setStep(3)
  }

  function handleStep3Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await completeOnboarding({
        orgNom: step1.orgNom,
        secteur: step1.secteur,
        taille: step1.taille,
        prenom: step2.prenom,
        nom: step2.nom,
        poste: step2.poste,
        outilsIA,
      })
      if (!result.success) {
        setError(result.error)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                  s < step
                    ? 'bg-primary border-primary text-primary-foreground'
                    : s === step
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${s < step ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                />
              )}
            </div>
          ))}
        </div>
        <CardTitle className="text-xl">
          {step === 1 && 'Votre entreprise'}
          {step === 2 && 'Votre profil'}
          {step === 3 && 'Premier inventaire IA'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgNom">Nom de l&apos;organisation *</Label>
              <Input
                id="orgNom"
                value={step1.orgNom}
                onChange={(e) => setStep1({ ...step1, orgNom: e.target.value })}
                placeholder="Acme SAS"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secteur">Secteur d&apos;activité</Label>
              <Select
                value={step1.secteur}
                onValueChange={(v) => setStep1({ ...step1, secteur: v ?? "" })}
              >
                <SelectTrigger id="secteur">
                  <SelectValue placeholder="Sélectionnez votre secteur" />
                </SelectTrigger>
                <SelectContent>
                  {SECTEURS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taille">Taille en salariés</Label>
              <Select
                value={step1.taille}
                onValueChange={(v) => setStep1({ ...step1, taille: v ?? "" })}
              >
                <SelectTrigger id="taille">
                  <SelectValue placeholder="Nombre de salariés" />
                </SelectTrigger>
                <SelectContent>
                  {TAILLES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-11">
              Continuer
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={step2.prenom}
                  onChange={(e) => setStep2({ ...step2, prenom: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={step2.nom}
                  onChange={(e) => setStep2({ ...step2, nom: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poste">Votre poste</Label>
              <Select
                value={step2.poste}
                onValueChange={(v) => setStep2({ ...step2, poste: v ?? "" })}
              >
                <SelectTrigger id="poste">
                  <SelectValue placeholder="Sélectionnez votre poste" />
                </SelectTrigger>
                <SelectContent>
                  {POSTES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setStep(1)}
              >
                Retour
              </Button>
              <Button type="submit" className="flex-1 h-11">
                Continuer
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Quels types d&apos;outils IA utilisez-vous déjà ?
            </p>
            <div className="space-y-3">
              {OUTILS_IA.map((outil) => (
                <label
                  key={outil}
                  className="flex items-center gap-3 cursor-pointer rounded-md border p-3 hover:bg-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={outilsIA.includes(outil)}
                    onChange={() => toggleOutil(outil)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-medium">{outil}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setStep(2)}
              >
                Retour
              </Button>
              <Button type="submit" className="flex-1 h-11" disabled={isPending}>
                {isPending ? 'Finalisation...' : 'Terminer et accéder au dashboard'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
