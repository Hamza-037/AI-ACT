import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Connexion</CardTitle>
        <p className="text-sm text-center text-muted-foreground">
          Connectez-vous à votre espace aiactio
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            S&apos;inscrire
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
