import Link from 'next/link'
import { ArrowRight, FileText, CheckSquare, GraduationCap, FileOutput } from 'lucide-react'

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
      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="bg-[#FAFAF8] py-24 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-4 py-1.5 text-sm font-medium mb-8">
            AI Act &mdash; En vigueur depuis 2025
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05] mb-6">
            Pilotez votre conformit&eacute;
            <br />
            AI Act sans juriste.
          </h1>

          <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
            Inventaire, checklist, formations, documents &mdash; tout ce qu&apos;exige l&apos;AI
            Act, dans un seul outil construit pour les PME fran&ccedil;aises.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors gap-2"
            >
              Tester gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center h-11 text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4 transition-colors"
            >
              Voir la d&eacute;mo
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            Plus de 200 PME l&apos;utilisent &middot; Sans CB &middot; Gratuit pour commencer
          </p>
        </div>
      </section>

      {/* ============================================================
          STATS
      ============================================================ */}
      <section className="bg-white py-16 px-4 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div className="space-y-2">
              <p className="text-5xl font-bold text-slate-900 tracking-tight">45%</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                des PME fran&ccedil;aises ne savent pas qu&apos;elles sont concern&eacute;es par
                l&apos;AI Act
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold text-slate-900 tracking-tight">15M&euro;</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                d&apos;amende maximale pour les deployers non conformes
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold text-slate-900 tracking-tight">
                {daysRemaining}&nbsp;j.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                avant la deadline principale du 2&nbsp;ao&ucirc;t&nbsp;2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3 ETAPES
      ============================================================ */}
      <section className="bg-[#FAFAF8] py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-16">
            Conforme en 3&nbsp;&eacute;tapes
          </h2>

          <div className="relative">
            {/* Ligne horizontale — desktop uniquement */}
            <div className="hidden sm:block absolute top-[23px] left-6 right-6 h-px bg-slate-200 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="relative space-y-4">
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 font-semibold text-base z-10">
                  1
                </div>
                <h3 className="font-bold text-lg text-slate-900">Diagnostiquez</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  R&eacute;pondez au quiz de 5 questions et obtenez votre niveau
                  d&apos;exposition &agrave; l&apos;AI Act en 2 minutes.
                </p>
              </div>

              <div className="relative space-y-4">
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 font-semibold text-base z-10">
                  2
                </div>
                <h3 className="font-bold text-lg text-slate-900">Planifiez</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Votre tableau de bord liste toutes vos obligations avec les deadlines et
                  guides pratiques.
                </p>
              </div>

              <div className="relative space-y-4">
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 font-semibold text-base z-10">
                  3
                </div>
                <h3 className="font-bold text-lg text-slate-900">Conformez-vous</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Compl&eacute;tez la checklist, formez vos &eacute;quipes et
                  g&eacute;n&eacute;rez vos documents officiels en un clic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FONCTIONNALITES
      ============================================================ */}
      <section id="fonctionnalites" className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Gauche */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  Fonctionnalites
                </p>
                <h2 className="text-3xl font-bold text-slate-900 leading-snug">
                  Tout ce dont vous avez besoin pour &ecirc;tre conforme
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  Un outil complet pour couvrir toutes vos obligations AI Act, sans
                  complexit&eacute; inutile. Con&ccedil;u pour les PME, pas pour les cabinets
                  conseil.
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors gap-2"
              >
                Acc&eacute;der &agrave; la plateforme
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Droite — liste verticale */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-0.5 bg-blue-600 shrink-0 rounded-full" />
                <div className="space-y-1 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Registre des syst&egrave;mes IA
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Inventoriez et classifiez tous vos outils IA selon les cat&eacute;gories
                    de risque de l&apos;AI Act.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-0.5 bg-blue-600 shrink-0 rounded-full" />
                <div className="space-y-1 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-slate-400 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-sm">Checklist conformit&eacute;</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Suivez chaque obligation r&eacute;glementaire avec des alertes proactives
                    avant les &eacute;ch&eacute;ances critiques.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-0.5 bg-blue-600 shrink-0 rounded-full" />
                <div className="space-y-1 pb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-sm">Formation AI Literacy</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Formez vos salari&eacute;s en 3 micro-modules et conservez les
                    attestations pour vos audits.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-0.5 bg-blue-600 shrink-0 rounded-full" />
                <div className="space-y-1 pb-2">
                  <div className="flex items-center gap-2">
                    <FileOutput className="h-4 w-4 text-slate-400 shrink-0" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      G&eacute;n&eacute;rateur de documents
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Produisez en un clic politique IA, notices salari&eacute;s, rapports de
                    conformit&eacute;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARAISON PRIX
      ============================================================ */}
      <section id="tarifs" className="bg-[#FAFAF8] py-24 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Ce que &ccedil;a co&ucirc;te ailleurs</h2>
            <p className="text-slate-500">
              La conformit&eacute; AI Act ne devrait pas &ecirc;tre r&eacute;serv&eacute;e aux
              grandes entreprises.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {/* En-tete */}
            <div className="grid grid-cols-2 bg-slate-50 px-6 py-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Solution
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">
                Co&ucirc;t estim&eacute;
              </span>
            </div>

            {/* Lignes */}
            <div className="grid grid-cols-2 px-6 py-4 border-b border-slate-100">
              <span className="text-sm text-slate-600">Consultant externe</span>
              <span className="text-sm text-right text-slate-400">
                200&nbsp;000 &ndash; 500&nbsp;000&euro;
              </span>
            </div>
            <div className="grid grid-cols-2 px-6 py-4 border-b border-slate-100">
              <span className="text-sm text-slate-600">Logiciels grands groupes</span>
              <span className="text-sm text-right text-slate-400">50&nbsp;000&euro;+/an</span>
            </div>
            <div className="grid grid-cols-2 px-6 py-4 bg-slate-900">
              <span className="text-sm font-semibold text-white">aiactio</span>
              <span className="text-sm text-right font-semibold text-white">
                &agrave; partir de 99&euro;/mois
              </span>
            </div>
          </div>

          <div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors gap-2"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          TEMOIGNAGES
      ============================================================ */}
      <section className="bg-slate-900 py-24 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Ils nous font confiance</h2>
            <p className="text-slate-400">
              Plus de 200 PME fran&ccedil;aises utilisent aiactio pour leur conformit&eacute;
              AI Act.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <p className="text-white italic leading-relaxed">
                &ldquo;On ne savait pas par o&ugrave; commencer avec l&apos;AI Act. En 20 minutes
                on avait notre registre complet et un plan d&apos;action clair.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-slate-200">Marie L.</p>
                <p className="text-xs text-slate-500">
                  DRH, PME industrielle &mdash; 45 salari&eacute;s
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white italic leading-relaxed">
                &ldquo;Le quiz m&apos;a permis de r&eacute;aliser qu&apos;on utilisait 6 outils IA
                sans le savoir. L&apos;outil nous a aid&eacute; &agrave; tout documenter
                rapidement.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-slate-200">Thomas B.</p>
                <p className="text-xs text-slate-500">DSI, cabinet d&apos;expertise comptable</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white italic leading-relaxed">
                &ldquo;Simple, clair, au bon prix. Exactement ce qu&apos;il faut pour une
                &eacute;quipe sans juriste d&eacute;di&eacute;.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-slate-200">Sophie M.</p>
                <p className="text-xs text-slate-500">
                  Directrice, agence de communication
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL
      ============================================================ */}
      <section className="bg-[#FAFAF8] py-24 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Votre conformit&eacute; AI Act commence aujourd&apos;hui.
          </h2>
          <p className="text-slate-500 text-lg">
            Rejoignez les PME fran&ccedil;aises qui ont d&eacute;j&agrave; s&eacute;curis&eacute;
            leur conformit&eacute; avant la deadline de 2026.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors gap-2"
            >
              Tester gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-slate-400">
              Sans carte bancaire &middot; Acc&egrave;s imm&eacute;diat &middot; R&eacute;siliable
              &agrave; tout moment
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
