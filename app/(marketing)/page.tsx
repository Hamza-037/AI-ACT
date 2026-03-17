import Link from 'next/link'
import { ArrowRight, AlertTriangle, FileText, CheckSquare, GraduationCap, FileOutput, Clock } from 'lucide-react'

function getDaysRemaining(): number {
  const deadline = new Date('2026-08-02T00:00:00Z')
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function HomePage() {
  const daysRemaining = getDaysRemaining()

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-4 py-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Deadline : 2 août 2026 &mdash; il reste {daysRemaining} jours
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Votre entreprise est-elle prête pour l&apos;AI Act&nbsp;?
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Obligations légales dès août 2026. Préparez-vous maintenant avec un outil simple et abordable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors gap-2"
            >
              Tester gratuitement en 2 minutes
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#fonctionnalites"
              className="inline-flex items-center justify-center h-12 px-8 rounded-md border border-input bg-background font-semibold hover:bg-accent transition-colors"
            >
              Voir les fonctionnalités
            </a>
          </div>
        </div>
      </section>

      {/* Preuves sociales */}
      <section className="bg-muted/40 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-primary">45%</p>
              <p className="text-sm text-muted-foreground">des PME ne connaissent pas leurs obligations AI Act</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-destructive">15M€</p>
              <p className="text-sm text-muted-foreground">Amendes jusqu&apos;à 15M€ ou 3% du CA mondial</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-primary">10 000+</p>
              <p className="text-sm text-muted-foreground">entreprises françaises concernées dès 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Un outil complet pour couvrir toutes vos obligations AI Act, sans complexité inutile.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="inline-flex items-center justify-center rounded-md bg-primary/10 p-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Registre des systèmes IA</h3>
              <p className="text-sm text-muted-foreground">
                Inventoriez et classifiez automatiquement tous vos outils IA selon les catégories de risque de l&apos;AI Act.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="inline-flex items-center justify-center rounded-md bg-primary/10 p-2">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Checklist conformité avec deadlines</h3>
              <p className="text-sm text-muted-foreground">
                Suivez chaque obligation réglementaire avec des alertes proactives avant les échéances critiques.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="inline-flex items-center justify-center rounded-md bg-primary/10 p-2">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Formation AI Literacy obligatoire</h3>
              <p className="text-sm text-muted-foreground">
                Formez vos salariés en 3 micro-modules et conservez les attestations pour vos audits.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="inline-flex items-center justify-center rounded-md bg-primary/10 p-2">
                <FileOutput className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Générateur de documents officiels</h3>
              <p className="text-sm text-muted-foreground">
                Produisez en un clic tous les documents requis : politique IA, notices salariés, rapports de conformité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison prix */}
      <section className="bg-muted/40 py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Un prix accessible pour toutes les PME</h2>
            <p className="text-muted-foreground">
              La conformité AI Act ne devrait pas être réservée aux grandes entreprises.
            </p>
          </div>
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="grid grid-cols-2 bg-muted/50 px-6 py-3 text-sm font-semibold text-muted-foreground">
              <span>Solution</span>
              <span className="text-right">Coût estimé</span>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-2 px-6 py-4">
                <span className="text-sm">Consultant externe</span>
                <span className="text-sm text-right text-muted-foreground">200 000 – 500 000€</span>
              </div>
              <div className="grid grid-cols-2 px-6 py-4">
                <span className="text-sm">Logiciels entreprise</span>
                <span className="text-sm text-right text-muted-foreground">50 000€+/an</span>
              </div>
              <div className="grid grid-cols-2 px-6 py-4 bg-primary/5">
                <span className="text-sm font-semibold text-primary">ComplyIA</span>
                <span className="text-sm text-right font-semibold text-primary">à partir de 99€/mois</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            <details className="group rounded-lg border bg-card">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium list-none">
                <span>Mon entreprise est-elle vraiment concernée ?</span>
                <AlertTriangle className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-sm text-muted-foreground">
                L&apos;AI Act s&apos;applique à toute organisation qui déploie ou utilise des systèmes d&apos;intelligence artificielle dans l&apos;Union européenne, quelle que soit sa taille. Si vous utilisez des outils comme ChatGPT, un CRM prédictif, un logiciel de tri de CV ou un chatbot, vous êtes concerné.
              </div>
            </details>
            <details className="group rounded-lg border bg-card">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium list-none">
                <span>Qu&apos;est-ce que l&apos;AI Literacy ?</span>
                <AlertTriangle className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-sm text-muted-foreground">
                L&apos;AI Literacy est l&apos;obligation de former vos salariés à comprendre les bases de l&apos;intelligence artificielle et à en utiliser les outils de manière responsable. Cette obligation est déjà en vigueur depuis février 2025 et s&apos;applique à tous les déployeurs de systèmes IA.
              </div>
            </details>
            <details className="group rounded-lg border bg-card">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium list-none">
                <span>Quelle est la deadline ?</span>
                <AlertTriangle className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-sm text-muted-foreground">
                La date clé est le 2 août 2026 : à cette date, la majorité des obligations de l&apos;AI Act entrent en vigueur pour les déployeurs (inventaire des systèmes IA, supervision humaine documentée, notices d&apos;information). L&apos;AI Literacy est quant à elle déjà obligatoire depuis février 2025.
              </div>
            </details>
            <details className="group rounded-lg border bg-card">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium list-none">
                <span>Que risque-t-on en cas de non-conformité ?</span>
                <AlertTriangle className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-sm text-muted-foreground">
                Les sanctions peuvent atteindre jusqu&apos;à 15 millions d&apos;euros ou 3% du chiffre d&apos;affaires annuel mondial pour les infractions aux obligations des déployeurs. Pour les violations des interdictions (systèmes IA prohibés), les amendes peuvent grimper jusqu&apos;à 35 millions d&apos;euros ou 7% du CA mondial.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
            Découvrez vos obligations en 2 minutes
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Répondez à 5 questions et obtenez immédiatement votre niveau d&apos;exposition à l&apos;AI Act.
            Gratuit, sans inscription.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-background text-foreground font-semibold hover:bg-background/90 transition-colors gap-2"
          >
            Démarrer le quiz gratuit
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
