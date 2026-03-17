import { OBLIGATION_LABELS, OBLIGATION_DEADLINES } from '@/types/shared.types'
import { Badge } from '@/components/ui/badge'

export default function ChecklistPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checklist de conformité AI Act</h1>
      <div className="space-y-3">
        {Object.entries(OBLIGATION_LABELS).map(([code, label]) => (
          <div
            key={code}
            className="flex items-center justify-between p-4 border rounded-lg bg-card"
          >
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-sm text-muted-foreground">
                {OBLIGATION_DEADLINES[code as keyof typeof OBLIGATION_DEADLINES]}
              </p>
            </div>
            <Badge variant="secondary">Non évalué</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
