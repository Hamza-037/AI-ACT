import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { SignupForm } from './SignupForm'

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Creer votre compte gratuit</h1>
        <p className="text-sm text-slate-500">
          Commencez votre mise en conformite AI Act en 2 minutes
        </p>
      </div>

      {/* Reassurance */}
      <div className="space-y-2 p-4 rounded-xl bg-blue-50 border border-blue-100">
        {[
          'Gratuit, sans carte bancaire',
          'Rapport de diagnostic immediat',
          'Toutes vos obligations AI Act en un coup d\'oeil',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-blue-800">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
            {item}
          </div>
        ))}
      </div>

      <SignupForm />

      <p className="text-center text-sm text-slate-500">
        Deja un compte ?{' '}
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
