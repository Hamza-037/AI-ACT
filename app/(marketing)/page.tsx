import Link from 'next/link'
import { ArrowRight, CheckCircle2, Shield, Clock, FileText, ClipboardCheck, GraduationCap, FileOutput, ChevronRight } from 'lucide-react'

function getDaysRemaining(): number {
  const deadline = new Date('2026-08-02T00:00:00Z')
  const now = new Date()
  return Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / 86400000))
}

/* Mockup visuel du dashboard — SVG/HTML pur, pas d'image externe */
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Ombre portée */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-slate-900/20" />
      {/* Fenêtre navigateur */}
      <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xl">
        {/* Barre titre */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="ml-3 flex-1 h-5 rounded bg-slate-200 max-w-[180px]" />
        </div>
        {/* Contenu dashboard */}
        <div className="flex h-52">
          {/* Sidebar mini */}
          <div className="w-12 bg-[#0f0f1a] flex flex-col items-center gap-3 pt-4">
            <div className="w-6 h-6 rounded-md bg-blue-600/30" />
            <div className="w-5 h-1 rounded bg-slate-700" />
            <div className="w-5 h-1 rounded bg-blue-500" />
            <div className="w-5 h-1 rounded bg-slate-700" />
            <div className="w-5 h-1 rounded bg-slate-700" />
          </div>
          {/* Main area */}
          <div className="flex-1 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-5 w-12 rounded-full bg-green-100 text-green-700 text-[8px] font-bold flex items-center justify-center">Conforme</div>
            </div>
            {/* Score */}
            <div className="flex gap-2">
              {[
                { label: 'Score', value: '67%', color: 'bg-orange-400' },
                { label: 'Obligations', value: '5/8', color: 'bg-blue-500' },
                { label: 'Jours', value: '138', color: 'bg-red-400' },
              ].map((m) => (
                <div key={m.label} className="flex-1 rounded-lg border border-slate-100 p-2 space-y-1">
                  <div className="text-[8px] text-slate-400">{m.label}</div>
                  <div className="text-sm font-bold text-slate-800">{m.value}</div>
                  <div className="h-1 rounded-full bg-slate-100">
                    <div className={`h-1 rounded-full ${m.color} w-2/3`} />
                  </div>
                </div>
              ))}
            </div>
            {/* Checklist mini */}
            <div className="space-y-1.5">
              {[
                { label: 'AI Literacy', done: false, urgent: true },
                { label: 'Registre IA', done: true, urgent: false },
                { label: 'Supervision humaine', done: false, urgent: false },
              ].map((item) => (
                <div key={item.label} className={`flex items-center gap-2 rounded px-2 py-1 ${item.urgent ? 'bg-red-50' : 'bg-slate-50'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.done ? 'bg-green-400' : item.urgent ? 'bg-red-400' : 'bg-slate-300'}`} />
                  <div className="text-[8px] text-slate-600 flex-1">{item.label}</div>
                  {item.urgent && <div className="text-[7px] text-red-600 font-semibold">URGENT</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: FileText,
    title: 'Registre des systemes IA',
    desc: "Inventoriez et classifiez automatiquement vos outils IA selon les categories de risque de l'AI Act.",
  },
  {
    icon: ClipboardCheck,
    title: 'Checklist de conformite',
    desc: 'Suivez vos 8 obligations reglementaires avec alertes et guides pratiques pour chaque echeance.',
  },
  {
    icon: GraduationCap,
    title: 'Formation AI Literacy',
    desc: 'Formez vos salaries en 3 modules et conservez les attestations requises pour vos audits.',
  },
  {
    icon: FileOutput,
    title: 'Generateur de documents',
    desc: "Politique IA, notices salaries, rapports de conformite — generez tous vos documents officiels en un clic.",
  },
]

const TESTIMONIALS = [
  {
    quote: "En 20 minutes on avait notre registre complet. L'outil nous a aide a realiser qu'on utilisait 6 systemes IA sans le savoir.",
    name: "Marie L.",
    role: "DRH · PME industrielle, 45 salaries",
  },
  {
    quote: "Simple, clair, au bon prix. Exactement ce qu'il nous fallait sans avoir a embaucher un juriste IA.",
    name: "Thomas B.",
    role: "DSI · Cabinet d'expertise comptable",
  },
  {
    quote: "Le quiz m'a donne une vision immediate de notre exposition. On savait enfin par ou commencer.",
    name: "Sophie M.",
    role: "Directrice · Agence de communication",
  },
]

export default function HomePage() {
  const daysRemaining = getDaysRemaining()

  return (
    <div className="bg-white">

      {/* ─── HERO ─── */}
      <section className="bg-[#FAFAF8] pt-16 pb-0 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Gauche — copy */}
            <div className="space-y-8 pb-16 lg:pb-24">
              {/* Badge sobre */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                AI Act &mdash; En vigueur depuis fevrier 2025
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-bold tracking-tight text-slate-900 leading-[1.08]">
                Pilotez votre<br />
                conformite AI Act<br />
                <span className="text-blue-600">sans juriste.</span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                Inventaire, checklist, formations, documents &mdash; tout ce qu&apos;exige l&apos;AI Act,
                dans un seul outil construit pour les PME fran&ccedil;aises.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors gap-2 shadow-lg shadow-slate-900/20"
                >
                  Tester gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center h-12 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors gap-1.5 underline underline-offset-4 decoration-slate-300"
                >
                  Creer un compte gratuit
                </Link>
              </div>

              {/* Micro-preuve sociale */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['#3b82f6','#10b981','#f59e0b','#8b5cf6'].map((c, i) => (
                    <div key={i} style={{ backgroundColor: c }} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                      {['M','T','S','P'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  Plus de <strong className="text-slate-600">200 PME</strong> l&apos;utilisent &middot; Sans CB &middot; Gratuit pour commencer
                </p>
              </div>
            </div>

            {/* Droite — mockup produit */}
            <div className="hidden lg:flex justify-end items-end pb-0">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-slate-900 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-700">
            <div className="text-center py-8 sm:py-0 sm:px-10 space-y-2">
              <p className="text-5xl font-bold text-white">45<span className="text-blue-400">%</span></p>
              <p className="text-sm text-slate-400 leading-snug">des PME fran&ccedil;aises ignorent qu&apos;elles sont concernees par l&apos;AI Act</p>
            </div>
            <div className="text-center py-8 sm:py-0 sm:px-10 space-y-2">
              <p className="text-5xl font-bold text-white">15<span className="text-red-400">M€</span></p>
              <p className="text-sm text-slate-400 leading-snug">d&apos;amende maximale ou 3% du CA mondial pour les deployers non conformes</p>
            </div>
            <div className="text-center py-8 sm:py-0 sm:px-10 space-y-2">
              <p className="text-5xl font-bold text-white">{daysRemaining}<span className="text-orange-400 text-3xl"> j.</span></p>
              <p className="text-sm text-slate-400 leading-snug">avant la deadline principale du 2 aout 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 ÉTAPES ─── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Processus</p>
            <h2 className="text-4xl font-bold text-slate-900">Conforme en 3 etapes</h2>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Ligne connectrice */}
            <div className="hidden sm:block absolute top-6 left-[20%] right-[20%] h-px bg-slate-200" />
            {[
              { n: '1', title: 'Diagnostiquez', desc: "Repondez a 5 questions et obtenez votre niveau d'exposition a l'AI Act en 2 minutes. Gratuit, sans inscription." },
              { n: '2', title: 'Planifiez', desc: "Votre tableau de bord liste toutes vos obligations avec deadlines, guides pratiques et documents pre-remplis." },
              { n: '3', title: 'Conformez-vous', desc: "Completez la checklist, formez vos equipes via les modules AI Literacy et generez vos documents officiels." },
            ].map((s) => (
              <div key={s.n} className="relative space-y-4 text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white text-lg font-bold shrink-0">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="fonctionnalites" className="bg-[#FAFAF8] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Gauche */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Fonctionnalites</p>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Tout ce dont vous avez besoin pour etre conforme.
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Un outil complet pour couvrir les 8 obligations AI Act, du diagnostic au document final.
                Construit pour les PME, sans jargon juridique.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
              >
                Acceder a la plateforme <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Droite — liste features */}
            <div className="space-y-0">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className={`flex gap-5 py-6 ${i < FEATURES.length - 1 ? 'border-b border-slate-200' : ''}`}>
                    <div className="shrink-0 mt-0.5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-900">{f.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING COMPARAISON ─── */}
      <section id="tarifs" className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Tarif</p>
            <h2 className="text-4xl font-bold text-slate-900">Ce que &ccedil;a co&ucirc;te ailleurs</h2>
            <p className="text-slate-500">La conformite AI Act ne devrait pas etre reservee aux grandes entreprises.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 bg-slate-50 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <span>Solution</span>
              <span className="text-right">Co&ucirc;t estim&eacute;</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-2 px-6 py-5">
                <span className="text-slate-600">Consultant externe</span>
                <span className="text-right text-slate-400">200 000 &ndash; 500 000&thinsp;&euro;</span>
              </div>
              <div className="grid grid-cols-2 px-6 py-5">
                <span className="text-slate-600">Logiciels grands groupes</span>
                <span className="text-right text-slate-400">50 000&thinsp;&euro;+/an</span>
              </div>
              <div className="grid grid-cols-2 px-6 py-5 bg-slate-900">
                <span className="font-bold text-white flex items-center gap-2">
                  aiactio<span className="text-blue-400">·</span>
                </span>
                <span className="text-right font-bold text-white">d&egrave;s 99&thinsp;&euro;/mois</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors gap-2"
            >
              Commencer gratuitement <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-slate-400">Sans carte bancaire &middot; Annulation a tout moment &middot; Plan gratuit permanent</p>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-slate-900 py-24 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Temoignages</p>
            <h2 className="text-4xl font-bold text-white">Ils nous font confiance</h2>
            <p className="text-slate-400">Plus de 200 PME fran&ccedil;aises utilisent aiactio pour leur conformite AI Act.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-800 bg-slate-800/50 p-7 space-y-5">
                <p className="text-slate-200 leading-relaxed text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-4 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">FAQ</p>
            <h2 className="text-4xl font-bold text-slate-900">Questions fr&eacute;quentes</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Mon entreprise est-elle vraiment concernee ?",
                a: "L'AI Act s'applique a toute organisation qui deploie ou utilise des systemes d'IA dans l'UE, quelle que soit sa taille. Si vous utilisez ChatGPT, un CRM predictif, un chatbot ou un logiciel de tri de CV, vous etes concerne.",
              },
              {
                q: "Qu'est-ce que l'AI Literacy et pourquoi c'est urgent ?",
                a: "L'AI Literacy est l'obligation de former vos salaries a comprendre les bases de l'IA et a l'utiliser de maniere responsable. Elle est deja en vigueur depuis fevrier 2025 — vous etes probablement deja en retard.",
              },
              {
                q: "Quelle est la deadline principale ?",
                a: "Le 2 aout 2026 : inventaire des systemes IA, supervision humaine documentee, notices d'information obligatoires. L'AI Literacy (Article 4) est, elle, deja applicable depuis fevrier 2025.",
              },
              {
                q: "Que risque-t-on en cas de non-conformite ?",
                a: "Jusqu'a 15 millions d'euros ou 3% du CA annuel mondial pour les infractions aux obligations des deployers. Jusqu'a 35 millions d'euros pour les violations d'interdictions.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-semibold text-slate-900 list-none gap-4">
                  <span>{faq.q}</span>
                  <ChevronRight className="h-5 w-5 text-slate-400 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#FAFAF8] px-4 py-2 text-sm text-slate-600">
            <Clock className="h-4 w-4 text-orange-500" />
            {daysRemaining} jours avant la deadline du 2 aout 2026
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Votre conformite AI Act<br />commence aujourd&apos;hui.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Rejoignez les PME fran&ccedil;aises qui ont deja securise leur conformite avant la deadline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center h-13 min-h-[52px] px-10 rounded-xl bg-slate-900 text-white text-base font-bold hover:bg-slate-700 transition-colors gap-2 shadow-xl shadow-slate-900/10"
            >
              Tester gratuitement en 2 minutes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Sans carte bancaire</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Plan gratuit permanent</span>
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-blue-500" /> Conforme RGPD</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Annulation a tout moment</span>
          </div>
        </div>
      </section>

    </div>
  )
}
