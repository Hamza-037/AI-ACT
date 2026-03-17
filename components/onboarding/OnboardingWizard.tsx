'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check } from 'lucide-react'
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

const STEPS = [
  {
    label: 'Votre entreprise',
    description: 'Renseignez les informations de base sur votre organisation.',
  },
  {
    label: 'Votre profil',
    description: 'Dites-nous qui vous êtes pour personnaliser votre expérience.',
  },
  {
    label: 'Premier inventaire IA',
    description: 'Identifiez les outils IA déjà en usage dans votre organisation.',
  },
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

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((stepItem, i) => {
        const stepNum = i + 1
        const isDone = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all ${
                  isDone
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={`text-xs mt-1 font-medium whitespace-nowrap ${
                  isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {stepItem.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-2 mb-4 transition-all ${
                  stepNum < currentStep ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
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

  const currentStepMeta = STEPS[step - 1]

  return (
    <div>
      <StepIndicator currentStep={step} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{currentStepMeta.label}</h2>
          <p className="text-sm text-gray-500 mt-1">{currentStepMeta.description}</p>
        </div>

        {/* Card content */}
        <div className="p-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-5">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="orgNom" className="text-sm font-medium text-gray-700">
                  Nom de l&apos;organisation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgNom"
                  value={step1.orgNom}
                  onChange={(e) => setStep1({ ...step1, orgNom: e.target.value })}
                  placeholder="Ex : Acme SAS"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secteur" className="text-sm font-medium text-gray-700">
                  Secteur d&apos;activité
                </Label>
                <Select
                  value={step1.secteur}
                  onValueChange={(v) => setStep1({ ...step1, secteur: v ?? '' })}
                >
                  <SelectTrigger id="secteur" className="h-11">
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
                <Label htmlFor="taille" className="text-sm font-medium text-gray-700">
                  Taille de l&apos;entreprise
                </Label>
                <Select
                  value={step1.taille}
                  onValueChange={(v) => setStep1({ ...step1, taille: v ?? '' })}
                >
                  <SelectTrigger id="taille" className="h-11">
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
              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-sm font-medium text-gray-700">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prenom"
                    value={step2.prenom}
                    onChange={(e) => setStep2({ ...step2, prenom: e.target.value })}
                    placeholder="Marie"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-sm font-medium text-gray-700">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nom"
                    value={step2.nom}
                    onChange={(e) => setStep2({ ...step2, nom: e.target.value })}
                    placeholder="Dupont"
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poste" className="text-sm font-medium text-gray-700">
                  Votre poste
                </Label>
                <Select
                  value={step2.poste}
                  onValueChange={(v) => setStep2({ ...step2, poste: v ?? '' })}
                >
                  <SelectTrigger id="poste" className="h-11">
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
                <button
                  type="button"
                  className="flex-1 h-12 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => setStep(1)}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-5">
              <div className="space-y-3">
                {OUTILS_IA.map((outil) => (
                  <label
                    key={outil}
                    className={`flex items-center gap-3 cursor-pointer rounded-lg border-2 p-3 transition-all ${
                      outilsIA.includes(outil)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={outilsIA.includes(outil)}
                      onChange={() => toggleOutil(outil)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span
                      className={`text-sm font-medium ${
                        outilsIA.includes(outil) ? 'text-blue-900' : 'text-gray-700'
                      }`}
                    >
                      {outil}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 h-12 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => setStep(2)}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-12 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Finalisation...' : 'Terminer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
