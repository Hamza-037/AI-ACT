import { QuizWizard } from '@/components/quiz/QuizWizard'

export const metadata = {
  title: "Êtes-vous prêt pour l'AI Act ? — aiactio",
  description: "Testez en 2 minutes si votre entreprise est concernée par les obligations AI Act.",
}

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <QuizWizard />
      </div>
    </main>
  )
}
