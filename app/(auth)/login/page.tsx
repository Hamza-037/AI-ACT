import Link from 'next/link'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Bon retour</h1>
        <p className="text-sm text-slate-500">
          Connectez-vous a votre espace conformite AI Act
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-500">
        Pas encore de compte ?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline font-medium">
          Creer un compte gratuit
        </Link>
      </p>
    </div>
  )
}
