import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { createServerClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

async function getOrgNom(): Promise<string | null> {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as unknown as any

    const { data: profile } = (await db
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()) as { data: AnyRecord | null }

    if (!profile?.organization_id) return null

    const { data: org } = (await db
      .from('organizations')
      .select('nom')
      .eq('id', profile.organization_id)
      .single()) as { data: AnyRecord | null }

    return (org?.nom as string) ?? null
  } catch {
    return null
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const orgNom = await getOrgNom()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header orgNom={orgNom} />
        <main className="flex-1 p-6 md:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  )
}
