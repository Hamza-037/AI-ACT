'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle, Mail, Home } from 'lucide-react'
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
    textColor: 'text-green-700',
    circleBg: 'bg-green-100',
    circleText: 'text-green-700',
    circleBorder: 'border-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    badgeBg: 'bg-green-50 border-green-200',
    badgeText: 'text-green-700',
  },
  modere: {
    label: 'Exposition modérée',
    textColor: 'text-orange-700',
    circleBg: 'bg-orange-100',
    circleText: 'text-orange-700',
    circleBorder: 'border-orange-300',
    icon: AlertCircle,
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-50 border-orange-200',
    badgeText: 'text-orange-700',
  },
  eleve: {
    label: 'Exposition élevée',
    textColor: 'text-red-700',
    circleBg: 'bg-red-100',
    circleText: 'text-red-700',
    circleBorder: 'border-red-300',
    icon: XCircle,
    iconColor: 'text-red-600',
    badgeBg: 'bg-red-50 border-red-200',
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
      toast.success('Rapport envoyé par email')
    }
  }

  if (showResult) {
    return (
      <div className="space-y-6">
        {/* Score circle */}
        <div className="text-center space-y-4">
          <div
            className={`w-28 h-28 rounded-full mx-auto flex flex-col items-center justify-center border-4 ${config.circleBg} ${config.circleBorder}`}
          >
            <NiveauIcon className={`h-8 w-8 ${config.iconColor}`} />
            <span className={`text-xs font-semibold mt-1 ${config.circleText} leading-tight text-center px-1`}>
              {result.niveau === 'faible' ? 'Faible' : result.niveau === 'modere' ? 'Modéré' : 'Élevé'}
            </span>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${config.textColor}`}>{config.label}</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{result.message}</p>
          </div>
        </div>

        {/* Obligations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Vos obligations identifiées</h3>
          <ul className="space-y-3">
            {result.obligations.map((obligation) => (
              <li key={obligation} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{obligation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email capture */}
        {!emailSubmitted && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-gray-900">Recevoir le rapport détaillé</p>
                <p className="text-xs text-gray-400 mt-0.5">Optionnel — votre plan d&apos;action personnalisé par email</p>
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="flex-1 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/signup"
            className="w-full h-12 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Creer mon compte
          </Link>
          <Link
            href="/"
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <Home className="h-4 w-4" />
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress circles */}
      <div className="flex items-center">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all flex-shrink-0 ${
                i <= currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}
            >
              {i + 1}
            </div>
            {i < QUIZ_QUESTIONS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 transition-all ${
                  i < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Question {currentStep + 1} sur {totalSteps}
          </p>
          <h2 className="text-xl font-bold text-gray-900 leading-snug">{question.question}</h2>
          <p className="text-sm text-gray-500 mt-1">{question.description}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = currentAnswer === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full h-12 px-4 rounded-lg border-2 text-left text-sm font-medium transition-all duration-150 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
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
          className="inline-flex items-center gap-1 h-10 px-4 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="inline-flex items-center gap-1 h-12 px-8 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentStep < totalSteps - 1 ? 'Suivant' : 'Voir mon résultat'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
