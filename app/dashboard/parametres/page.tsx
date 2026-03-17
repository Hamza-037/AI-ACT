import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ParametresPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de l&apos;organisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l&apos;entreprise</Label>
            <Input id="nom" placeholder="Ma Société SAS" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siren">SIREN</Label>
            <Input id="siren" placeholder="123456789" maxLength={9} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secteur">Secteur d&apos;activité</Label>
            <Input id="secteur" placeholder="ex: Retail, Finance, Santé..." />
          </div>
          <Button className="h-11">Enregistrer</Button>
        </CardContent>
      </Card>
    </div>
  )
}
