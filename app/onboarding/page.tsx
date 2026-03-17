import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bienvenue sur aiactio</h1>
          <p className="text-muted-foreground mt-2">
            Configurez votre espace en 3 étapes
          </p>
        </div>
        <OnboardingWizard />
      </div>
    </div>
  )
}
