import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ConformiteScoreProps = {
  score: number
  label?: string
}

export function ConformiteScore({ score, label = 'Score de conformité global' }: ConformiteScoreProps) {
  const color =
    score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold mb-2 ${color}`}>{score}%</div>
        <Progress value={score} className="h-2" />
      </CardContent>
    </Card>
  )
}
