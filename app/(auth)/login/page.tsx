import Link from 'next/link'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
        <p className="text-sm text-slate-500">
          Acc&egrave;s &agrave; votre espace de conformit&eacute; AI Act
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-slate-500">
        Pas encore de compte&nbsp;?{' '}
        <Link href="/signup" className="font-medium text-slate-900 hover:underline">
          Cr&eacute;er un compte gratuit
        </Link>
      </p>
    </div>
  )
}
