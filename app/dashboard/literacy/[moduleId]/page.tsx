import { notFound } from 'next/navigation'
import { getModuleById } from '@/lib/literacy/modules'
import { ModuleViewer } from '@/components/literacy/ModuleViewer'

export default function LiteracyModulePage({ params }: { params: { moduleId: string } }) {
  const module = getModuleById(params.moduleId)
  if (!module) notFound()
  return (
    <div className="py-4 px-2">
      <ModuleViewer module={module} />
    </div>
  )
}
