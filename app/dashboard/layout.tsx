import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { createServerClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

type OrgInfo = { nom: string | null; plan: string | null }

async function getOrgInfo(): Promise<OrgInfo> {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { nom: null, plan: null }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as unknown as any

    const { data: profile } = (await db
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()) as { data: AnyRecord | null }

    if (!profile?.organization_id) return { nom: null, plan: null }

    const { data: org } = (await db
      .from('organizations')
      .select('nom, plan')
      .eq('id', profile.organization_id)
      .single()) as { data: AnyRecord | null }

    return {
      nom: (org?.nom as string) ?? null,
      plan: (org?.plan as string) ?? null,
    }
  } catch {
    return { nom: null, plan: null }
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { nom: orgNom, plan } = await getOrgInfo()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header orgNom={orgNom} plan={plan} />
        <main className="flex-1 p-6 md:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  )
}
