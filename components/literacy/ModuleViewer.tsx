'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { completeModule } from '@/lib/actions/literacy'
import type { LiteracyModule } from '@/lib/literacy/modules'

type Props = { module: LiteracyModule }

export function ModuleViewer({ module }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<'content' | 'quiz'>('content')
  const [selected, setSelected] = useState<number | null>(null)
  const [validated, setValidated] = useState(false)
  const [isPending, startTransition] = useTransition()

  const textContent = module.contenu.find((c) => c.type === 'text')
  const quizContent = module.contenu.find((c) => c.type === 'quiz')

  function handleValidate() {
    if (selected === null || !quizContent || quizContent.type !== 'quiz') return
    setValidated(true)
    if (selected === quizContent.reponse_correcte) {
      startTransition(async () => {
        await completeModule(module.id, 100)
        setTimeout(() => router.push('/dashboard/literacy'), 1500)
      })
    }
  }

  function handleRetry() {
    setSelected(null)
    setValidated(false)
  }

  const isCorrect = validated && quizContent?.type === 'quiz' && selected === quizContent.reponse_correcte

  if (step === 'content' && textContent?.type === 'text') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Module {module.ordre}/3</p>
          <h1 className="text-2xl font-bold">{module.titre}</h1>
          <p className="text-muted-foreground text-sm mt-1">{module.duree_minutes} minutes</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold mb-3">{textContent.titre}</h2>
            <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              {textContent.texte}
            </div>
          </CardContent>
        </Card>
        <button
          type="button"
          onClick={() => setStep('quiz')}
          className="inline-flex items-center gap-2 justify-center h-11 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Passer au quiz
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (step === 'quiz' && quizContent?.type === 'quiz') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Quiz — Module {module.ordre}/3</p>
          <h2 className="text-xl font-bold">{quizContent.question}</h2>
        </div>
        <div className="space-y-3">
          {quizContent.options.map((option, index) => {
            let className = 'w-full text-left h-11 min-h-11 px-4 rounded-md border text-sm font-medium transition-colors '
            if (!validated) {
              className += selected === index
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-accent border-input'
            } else {
              if (index === quizContent.reponse_correcte) {
                className += 'bg-green-100 text-green-800 border-green-300'
              } else if (index === selected && selected !== quizContent.reponse_correcte) {
                className += 'bg-red-100 text-red-800 border-red-300'
              } else {
                className += 'bg-muted text-muted-foreground border-input'
              }
            }
            return (
              <button
                key={index}
                type="button"
                onClick={() => !validated && setSelected(index)}
                disabled={validated}
                className={className}
              >
                {option}
              </button>
            )
          })}
        </div>

        {!validated ? (
          <button
            type="button"
            onClick={handleValidate}
            disabled={selected === null || isPending}
            className="inline-flex items-center justify-center h-11 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Valider ma reponse
          </button>
        ) : isCorrect ? (
          <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Bonne reponse !</p>
              <p className="text-sm text-green-700 mt-0.5">{quizContent.explication}</p>
              <p className="text-xs text-green-600 mt-1">Redirection en cours...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4">
              <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Incorrect</p>
                <p className="text-sm text-red-700 mt-0.5">{quizContent.explication}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center h-11 w-full rounded-md border border-input bg-background text-sm font-medium hover:bg-accent transition-colors"
            >
              Reessayer
            </button>
          </div>
        )}
      </div>
    )
  }

  return null
}
