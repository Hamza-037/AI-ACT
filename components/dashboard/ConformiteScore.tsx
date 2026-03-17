import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ConformiteScoreProps = {
  score: number
  completees: number
  total: number
}

export function ConformiteScore({ score, completees, total }: ConformiteScoreProps) {
  const colorClass =
    score >= 67 ? 'text-green-600' : score >= 34 ? 'text-orange-500' : 'text-red-600'

  const progressColorClass =
    score >= 67 ? '[&>div]:bg-green-500' : score >= 34 ? '[&>div]:bg-orange-500' : '[&>div]:bg-red-500'

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Score de conformité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('text-3xl font-bold mb-2', colorClass)}>{score}%</div>
        <Progress value={score} className={cn('h-2 mb-2', progressColorClass)} />
        <p className="text-xs text-muted-foreground">
          {completees}/{total} obligations complétées
        </p>
      </CardContent>
    </Card>
  )
}
