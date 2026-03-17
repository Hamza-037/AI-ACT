import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NouveauSystemePage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/registre"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Retour
        </Link>
        <h1 className="text-2xl font-bold">Nouveau système IA</h1>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations du système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du système *</Label>
            <Input id="nom" placeholder="ex: ChatGPT, Salesforce Einstein..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fournisseur">Fournisseur</Label>
            <Input id="fournisseur" placeholder="ex: OpenAI, Salesforce..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usage">Usage dans l&apos;entreprise</Label>
            <Textarea id="usage" placeholder="Décrivez comment vous utilisez ce système..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departement">Département</Label>
            <Input id="departement" placeholder="ex: RH, Marketing, Finance..." />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Enregistrer
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
