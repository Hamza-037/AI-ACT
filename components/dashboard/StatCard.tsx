import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatCardProps = {
  titre: string
  valeur: string | number
  description?: string
  icon: React.ReactNode
  variante?: 'default' | 'success' | 'warning' | 'danger'
}

const variantStyles = {
  default: 'text-foreground',
  success: 'text-green-600',
  warning: 'text-orange-500',
  danger: 'text-red-600',
}

export function StatCard({ titre, valeur, description, icon, variante = 'default' }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{titre}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', variantStyles[variante])}>{valeur}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
