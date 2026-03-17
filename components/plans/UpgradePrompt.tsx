import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

type UpgradePromptProps = {
  message: string
  upgradeTo: string
}

export function UpgradePrompt({ message, upgradeTo }: UpgradePromptProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
      <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-orange-800">{message}</p>
        <Link
          href="/dashboard/plans"
          className="text-sm font-medium text-orange-900 underline underline-offset-2 hover:text-orange-700 mt-1 inline-block"
        >
          Passer au plan {upgradeTo}
        </Link>
      </div>
    </div>
  )
}
