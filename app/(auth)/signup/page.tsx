import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SignupForm } from './SignupForm'

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
        <p className="text-sm text-center text-muted-foreground">
          Commencez votre mise en conformité AI Act gratuitement
        </p>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
