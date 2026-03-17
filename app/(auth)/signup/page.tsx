import Link from 'next/link'
import { SignupForm } from './SignupForm'

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Cr&eacute;er votre compte</h1>
        <p className="text-sm text-slate-500">
          D&eacute;marrez votre conformit&eacute; AI Act en quelques minutes
        </p>
      </div>

      {/* Reassurance — sobre, sans fond colore */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
          Inclus gratuitement
        </p>
        <ul className="space-y-1">
          <li className="text-sm text-slate-500">Rapport de diagnostic imm&eacute;diat</li>
          <li className="text-sm text-slate-500">
            Toutes vos obligations AI Act en un coup d&apos;&oelig;il
          </li>
          <li className="text-sm text-slate-500">Sans carte bancaire requise</li>
        </ul>
      </div>

      <SignupForm />

      <p className="text-center text-sm text-slate-500">
        D&eacute;j&agrave; un compte&nbsp;?{' '}
        <Link href="/login" className="font-medium text-slate-900 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
