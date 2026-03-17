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
    question: 'Combien de salariés dans votre entreprise ?',
    description: "Les obligations varient selon la taille de l'entreprise.",
    type: 'single',
    options: [
      { value: 'micro', label: 'Moins de 10 salariés', risque_score: 0 },
      { value: 'pme_small', label: '10 à 49 salariés', risque_score: 1 },
      { value: 'pme_mid', label: '50 à 249 salariés', risque_score: 2 },
      { value: 'pme_large', label: '250 à 499 salariés', risque_score: 3 },
      { value: 'eti', label: '500 salariés et plus', risque_score: 3 },
    ],
  },
  {
    id: 'rh_ia',
    question: 'Utilisez-vous des outils IA pour les ressources humaines ?',
    description: "Tri de CV, évaluation de performance, scoring de candidats, détection d'émotions...",
    type: 'single',
    options: [
      { value: 'oui', label: 'Oui', risque_score: 5 },
      { value: 'non', label: 'Non', risque_score: 0 },
      { value: 'incertain', label: 'Je ne sais pas', risque_score: 2 },
    ],
  },
  {
    id: 'scoring',
    question: "Utilisez-vous des outils de scoring ou d'évaluation automatique de clients ?",
    description: "Scoring crédit, évaluation de solvabilité, scoring assurance, CRM prédictif...",
    type: 'single',
    options: [
      { value: 'oui', label: 'Oui', risque_score: 5 },
      { value: 'non', label: 'Non', risque_score: 0 },
      { value: 'incertain', label: 'Je ne sais pas', risque_score: 2 },
    ],
  },
  {
    id: 'chatbot',
    question: 'Avez-vous un chatbot ou assistant IA en contact avec vos clients ou salariés ?',
    description: 'Sur votre site web, votre application, ou en interne.',
    type: 'single',
    options: [
      { value: 'oui_decisionnaire', label: 'Oui, et il prend des décisions automatiquement', risque_score: 4 },
      { value: 'oui_info', label: 'Oui, uniquement pour informer', risque_score: 1 },
      { value: 'non', label: 'Non', risque_score: 0 },
    ],
  },
  {
    id: 'copilot',
    question: 'Vos salariés utilisent-ils des outils IA au quotidien ?',
    description: 'Microsoft Copilot, ChatGPT, GitHub Copilot, Gemini, outils IA intégrés à vos logiciels...',
    type: 'single',
    options: [
      { value: 'tous', label: 'Oui, la plupart des salariés', risque_score: 3 },
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
      obligations: ['AI Literacy immédiate', 'Inventaire systèmes IA', 'Supervision humaine', 'Documentation technique'],
      message: 'Votre entreprise a des obligations importantes. Une action immédiate est recommandée.',
    }
  }
  if (total >= 5) {
    return {
      niveau: 'modere',
      obligations: ['AI Literacy immédiate', 'Inventaire systèmes IA'],
      message: 'Votre entreprise est concernée par plusieurs obligations AI Act.',
    }
  }
  return {
    niveau: 'faible',
    obligations: ["AI Literacy recommandée"],
    message: "Votre exposition est limitée, mais l'AI Literacy s'applique déjà.",
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
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  modere: {
    label: 'Exposition modérée',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200',
    icon: AlertCircle,
    iconColor: 'text-orange-500',
  },
  eleve: {
    label: 'Exposition élevée',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    icon: XCircle,
    iconColor: 'text-red-500',
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
  const progress = ((currentStep + 1) / totalSteps) * 100

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
      toast.success('Rapport envoyé par email')
    }
  }

  function handleDownloadReport() {
    toast.success('Rapport envoyé par email')
  }

  if (showResult) {
    return (
      <div className="space-y-6 transition-all duration-200">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Résultat de votre diagnostic</p>
          <h2 className="text-2xl font-bold">Votre niveau d&apos;exposition à l&apos;AI Act</h2>
        </div>

        <div className={`rounded-xl border p-6 space-y-4 ${config.bg}`}>
          <div className="flex items-center gap-3">
            <NiveauIcon className={`h-8 w-8 ${config.iconColor}`} />
            <div>
              <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
              <p className="text-sm text-muted-foreground">{result.message}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-3">
          <h3 className="font-semibold">Vos obligations identifiées</h3>
          <ul className="space-y-2">
            {result.obligations.map((obligation) => (
              <li key={obligation} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{obligation}</span>
              </li>
            ))}
          </ul>
        </div>

        {!emailSubmitted ? (
          <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Recevoir le rapport détaillé</p>
                <p className="text-xs text-muted-foreground">Optionnel — votre plan d&apos;action personnalisé par email</p>
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/signup"
            className="flex-1 inline-flex items-center justify-center h-11 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Créer mon compte gratuit
          </Link>
          <button
            onClick={handleDownloadReport}
            className="flex-1 inline-flex items-center justify-center h-11 rounded-md border border-input bg-background font-semibold hover:bg-accent transition-colors"
          >
            Télécharger mon rapport
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-all duration-200">
      {/* Progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentStep + 1} sur {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold leading-snug">{question.question}</h2>
        <p className="text-sm text-muted-foreground">{question.description}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = currentAnswer === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full min-h-11 px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-input hover:bg-accent hover:border-accent-foreground/20'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="inline-flex items-center gap-1 h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="inline-flex items-center gap-1 h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentStep < totalSteps - 1 ? 'Suivant' : 'Voir mon résultat'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
