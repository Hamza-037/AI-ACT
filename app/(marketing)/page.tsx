import Link from 'next/link'
import { ArrowRight, Shield, CheckCircle2, Clock, Star, FileText, CheckSquare, GraduationCap, FileOutput, ChevronDown } from 'lucide-react'

function getDaysRemaining(): number {
  const deadline = new Date('2026-08-02T00:00:00Z')
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const FEATURES = [
  {
    icon: FileText,
    title: 'Registre des systemes IA',
    desc: "Inventoriez et classifiez automatiquement tous vos outils IA selon les categories de risque de l'AI Act.",
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: CheckSquare,
    title: 'Checklist conformite',
    desc: 'Suivez chaque obligation reglementaire avec des alertes proactives avant les echeances critiques.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: GraduationCap,
    title: 'Formation AI Literacy',
    desc: 'Formez vos salaries en 3 micro-modules et conservez les attestations pour vos audits.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: FileOutput,
    title: 'Generateur de documents',
    desc: 'Produisez en un clic politique IA, notices salaries, rapports de conformite.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
]

const TESTIMONIALS = [
  {
    text: "On ne savait pas par ou commencer avec l'AI Act. En 20 minutes on avait notre registre complet et un plan d'action clair.",
    author: "Marie L.",
    role: "DRH, PME industrielle — 45 salaries",
  },
  {
    text: "Le quiz m'a permis de realiser qu'on utilisait 6 outils IA sans le savoir. L'outil nous a aide a tout documenter rapidement.",
    author: "Thomas B.",
    role: "DSI, cabinet d'expertise comptable",
  },
  {
    text: "Simple, clair, au bon prix. Exactement ce qu'il faut pour une equipe sans juriste dedie.",
    author: "Sophie M.",
    role: "Directrice, agence de communication",
  },
]

const FAQS = [
  {
    q: "Mon entreprise est-elle vraiment concernee ?",
    a: "L'AI Act s'applique a toute organisation qui deploie ou utilise des systemes d'IA dans l'Union europeenne, quelle que soit sa taille. Si vous utilisez ChatGPT, un CRM predictif, un chatbot ou un logiciel de tri de CV, vous etes concerne.",
  },
  {
    q: "Qu'est-ce que l'AI Literacy ?",
    a: "L'AI Literacy est l'obligation de former vos salaries a comprendre les bases de l'IA et a en utiliser les outils de maniere responsable. Elle est deja en vigueur depuis fevrier 2025.",
  },
  {
    q: "Quelle est la deadline ?",
    a: "Le 2 aout 2026 est la date cle : inventaire des systemes IA, supervision humaine documentee, notices d'information. L'AI Literacy est quant a elle deja obligatoire.",
  },
  {
    q: "Que risque-t-on en cas de non-conformite ?",
    a: "Jusqu'a 15 millions d'euros ou 3% du CA annuel mondial pour les infractions aux obligations des deployers. Jusqu'a 35 millions d'euros pour les violations d'interdictions.",
  },
]

export default function HomePage() {
  const daysRemaining = getDaysRemaining()

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24 px-4">
        {/* Fond décoratif */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          {/* Badge urgence */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 text-red-300 px-4 py-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            {daysRemaining} jours avant la deadline AI Act — 2 aout 2026
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Votre conformite AI Act,<br />
            <span className="text-blue-400">en moins d&apos;une heure.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            L&apos;AI Act impose des obligations legales a toutes les entreprises europeennes.
            aiactio vous guide pas a pas pour etre conforme avant les sanctions.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-400" /> Conforme RGPD
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Base sur le texte officiel AI Act
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-yellow-400" /> Cree par des experts juridiques
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center h-13 min-h-[52px] px-8 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/25 gap-2 text-base"
            >
              Tester gratuitement en 2 minutes
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-13 min-h-[52px] px-8 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors gap-2 text-base"
            >
              Creer un compte gratuit
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            Gratuit, sans carte bancaire requise. Plus de 200 PME l&apos;utilisent deja.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center space-y-1">
              <p className="text-4xl font-bold text-slate-900">45%</p>
              <p className="text-sm text-slate-500">des PME ne connaissent pas leurs obligations AI Act</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-4xl font-bold text-red-600">15M€</p>
              <p className="text-sm text-slate-500">d&apos;amendes possibles ou 3% du CA mondial</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-4xl font-bold text-slate-900">10 000+</p>
              <p className="text-sm text-slate-500">entreprises francaises concernees des 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ca marche */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Processus</p>
            <h2 className="text-3xl font-bold text-slate-900">Conforme en 3 etapes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Diagnostiquez', desc: "Repondez au quiz de 5 questions et obtenez votre niveau d'exposition a l'AI Act en 2 minutes." },
              { num: '02', title: 'Planifiez', desc: "Votre tableau de bord personnalise liste toutes vos obligations avec les deadlines et guides pratiques." },
              { num: '03', title: 'Conformez-vous', desc: "Completez la checklist, formez vos equipes et generez vos documents officiels en un clic." },
            ].map((step) => (
              <div key={step.num} className="relative space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="bg-slate-50 py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Fonctionnalites</p>
            <h2 className="text-3xl font-bold text-slate-900">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Un outil complet pour couvrir toutes vos obligations AI Act, sans complexite inutile.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="rounded-2xl border bg-white p-6 space-y-4 hover:shadow-md transition-shadow">
                  <div className={`inline-flex items-center justify-center rounded-xl ${f.bg} p-3`}>
                    <Icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Temoignages */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Temoignages</p>
            <h2 className="text-3xl font-bold text-slate-900">Ils nous font confiance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="rounded-2xl border bg-white p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.author}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparaison prix */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Tarif</p>
            <h2 className="text-3xl font-bold text-slate-900">Accessible a toutes les PME</h2>
            <p className="text-slate-500">La conformite AI Act ne devrait pas etre reservee aux grandes entreprises.</p>
          </div>
          <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 bg-slate-50 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <span>Solution</span>
              <span className="text-right">Cout estime</span>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-2 px-6 py-4">
                <span className="text-sm text-slate-600">Consultant externe</span>
                <span className="text-sm text-right text-slate-400">200 000 – 500 000€</span>
              </div>
              <div className="grid grid-cols-2 px-6 py-4">
                <span className="text-sm text-slate-600">Logiciels grands groupes</span>
                <span className="text-sm text-right text-slate-400">50 000€+/an</span>
              </div>
              <div className="grid grid-cols-2 px-6 py-4 bg-blue-50">
                <span className="text-sm font-bold text-blue-700">aiactio</span>
                <span className="text-sm text-right font-bold text-blue-700">a partir de 99€/mois</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors gap-2"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900">Questions frequentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-2xl border bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-slate-900 list-none gap-4">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-slate-400 shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 px-4 py-2 text-sm font-medium">
            <Shield className="h-4 w-4" />
            100% conforme au texte officiel AI Act
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Decouvrez vos obligations<br />en 2 minutes
          </h2>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Repondez a 5 questions et obtenez immediatement votre niveau d&apos;exposition a l&apos;AI Act.
            Gratuit, sans inscription.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center min-h-[52px] px-10 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors gap-2 text-base shadow-xl"
          >
            Demarrer le quiz gratuit
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
