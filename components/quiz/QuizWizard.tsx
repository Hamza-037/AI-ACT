'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle, Mail } from 'lucide-react'
import { toast } from 'sonner'

export type QuizQuestion = {
  id: string
  question: string
  description: string
  type: 'single' | 'multi'
  options: { value: string; label: string; risque_score: number }[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'taille',
    question: 'Combien de salaries dans votre entreprise ?',
    description: "Les obligations varient selon la taille de l'entreprise.",
    type: 'single',
    options: [
      { value: 'micro', label: 'Moins de 10 salaries', risque_score: 0 },
      { value: 'pme_small', label: '10 a 49 salaries', risque_score: 1 },
      { value: 'pme_mid', label: '50 a 249 salaries', risque_score: 2 },
      { value: 'pme_large', label: '250 a 499 salaries', risque_score: 3 },
      { value: 'eti', label: '500 salaries et plus', risque_score: 3 },
    ],
  },
  {
    id: 'rh_ia',
    question: 'Utilisez-vous des outils IA pour les ressources humaines ?',
    description: "Tri de CV, evaluation de performance, scoring de candidats, detection d'emotions...",
    type: 'single',
    options: [
      { value: 'oui', label: 'Oui', risque_score: 5 },
      { value: 'non', label: 'Non', risque_score: 0 },
      { value: 'incertain', label: 'Je ne sais pas', risque_score: 2 },
    ],
  },
  {
    id: 'scoring',
    question: "Utilisez-vous des outils de scoring ou d'evaluation automatique de clients ?",
    description: "Scoring credit, evaluation de solvabilite, scoring assurance, CRM predictif...",
    type: 'single',
    options: [
      { value: 'oui', label: 'Oui', risque_score: 5 },
      { value: 'non', label: 'Non', risque_score: 0 },
      { value: 'incertain', label: 'Je ne sais pas', risque_score: 2 },
    ],
  },
  {
    id: 'chatbot',
    question: 'Avez-vous un chatbot ou assistant IA en contact avec vos clients ou salaries ?',
    description: 'Sur votre site web, votre application, ou en interne.',
    type: 'single',
    options: [
      { value: 'oui_decisionnaire', label: 'Oui, et il prend des decisions automatiquement', risque_score: 4 },
      { value: 'oui_info', label: 'Oui, uniquement pour informer', risque_score: 1 },
      { value: 'non', label: 'Non', risque_score: 0 },
    ],
  },
  {
    id: 'copilot',
    question: 'Vos salaries utilisent-ils des outils IA au quotidien ?',
    description: 'Microsoft Copilot, ChatGPT, GitHub Copilot, Gemini, outils IA integres a vos logiciels...',
    type: 'single',
    options: [
      { value: 'tous', label: 'Oui, la plupart des salaries', risque_score: 3 },
      { value: 'certains', label: 'Oui, quelques-uns', risque_score: 2 },
      { value: 'rare', label: 'Rarement', risque_score: 1 },
      { value: 'non', label: 'Non', risque_score: 0 },
    ],
  },
]

export type QuizResult = {
  niveau: 'faible' | 'modere' | 'eleve'
  obligations: string[]
  message: string
}

export function calculateResult(scores: number[]): QuizResult {
  const total = scores.reduce((a, b) => a + b, 0)
  if (total >= 10) {
    return {
      niveau: 'eleve',
      obligations: ['AI Literacy immediate', 'Inventaire systemes IA', 'Supervision humaine', 'Documentation technique'],
      message: 'Votre entreprise a des obligations importantes. Une action immediate est recommandee.',
    }
  }
  if (total >= 5) {
    return {
      niveau: 'modere',
      obligations: ['AI Literacy immediate', 'Inventaire systemes IA'],
      message: 'Votre entreprise est concernee par plusieurs obligations AI Act.',
    }
  }
  return {
    niveau: 'faible',
    obligations: ["AI Literacy recommandee"],
    message: "Votre exposition est limitee, mais l'AI Literacy s'applique deja.",
  }
}

function getScoreForAnswer(questionIndex: number, answerValue: string): number {
  const question = QUIZ_QUESTIONS[questionIndex]
  if (!question) return 0
  const option = question.options.find((o) => o.value === answerValue)
  return option?.risque_score ?? 0
}

const NIVEAU_CONFIG = {
  faible: {
    label: 'Exposition faible',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    labelColor: 'text-green-700',
    badgeBg: 'bg-green-50',
    badgeBorder: 'border-green-200',
    badgeText: 'text-green-700',
  },
  modere: {
    label: 'Exposition moderee',
    icon: AlertCircle,
    iconColor: 'text-orange-500',
    labelColor: 'text-orange-700',
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-700',
  },
  eleve: {
    label: 'Exposition elevee',
    icon: XCircle,
    iconColor: 'text-red-500',
    labelColor: 'text-red-700',
    badgeBg: 'bg-red-50',
    badgeBorder: 'border-red-200',
    badgeText: 'text-red-700',
  },
}

export function QuizWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(QUIZ_QUESTIONS.length).fill(''))
  const [showResult, setShowResult] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const totalSteps = QUIZ_QUESTIONS.length
  const question = QUIZ_QUESTIONS[currentStep]
  const currentAnswer = answers[currentStep]

  const scores = answers.map((ans, i) => getScoreForAnswer(i, ans))
  const result = calculateResult(scores)
  const config = NIVEAU_CONFIG[result.niveau]
  const NiveauIcon = config.icon

  function handleSelect(value: string) {
    const next = [...answers]
    next[currentStep] = value
    setAnswers(next)
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setShowResult(true)
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) {
      try {
        localStorage.setItem('quiz_email', email)
      } catch {
        // localStorage not available
      }
      setEmailSubmitted(true)
      toast.success('Rapport envoye par email')
    }
  }

  if (showResult) {
    return (
      <div className="space-y-6">
        {/* En-tete resultat */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <NiveauIcon className={`h-12 w-12 ${config.iconColor}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${config.labelColor}`}>{config.label}</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              {result.message}
            </p>
          </div>
        </div>

        {/* Obligations identifiees */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Vos obligations identifiees
          </h3>
          <ul className="space-y-3">
            {result.obligations.map((obligation) => (
              <li key={obligation} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="text-sm text-slate-600 leading-relaxed">{obligation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email optionnel */}
        {!emailSubmitted && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Recevoir le rapport detaille</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Optionnel — votre plan d&apos;action personnalise par email
                </p>
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="flex-1 h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
        )}

        {/* CTA principal */}
        <Link
          href="/signup"
          className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
        >
          Creer mon compte — c&apos;est gratuit
        </Link>
      </div>
    )
  }

  const progressPct = ((currentStep) / totalSteps) * 100

  return (
    <div className="space-y-6">
      {/* Barre de progression fine */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Question {currentStep + 1} sur {totalSteps}
          </p>
        </div>
        <div className="h-0.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">
            {question.question}
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{question.description}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = currentAnswer === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full h-auto min-h-12 px-5 py-3 rounded-xl border-2 text-left text-sm transition-all duration-150 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 text-slate-900 font-medium'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Precedent
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="inline-flex items-center gap-1.5 h-11 px-8 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentStep < totalSteps - 1 ? 'Continuer' : 'Voir mon resultat'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
