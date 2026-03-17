import { QuizWizard } from '@/components/quiz/QuizWizard'

export const metadata = {
  title: "Etes-vous pret pour l'AI Act ? — aiactio",
  description: "Testez en 2 minutes si votre entreprise est concernee par les obligations AI Act.",
}

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] py-12 px-4">
      <div className="max-w-xl mx-auto">
        <QuizWizard />
      </div>
    </main>
  )
}
