// Template page dashboard — Server Component
// Remplacer RESOURCE, fetchRESOURCES, etc. par les noms reels
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlusCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RESOURCE — aiactio',
}

async function fetchRESOURCES(userId: string) {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function RESOURCESPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const items = await fetchRESOURCES(user.id)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">RESOURCES</h1>
          <p className="text-sm text-slate-500 mt-1">Description courte</p>
        </div>
        <Link
          href="/dashboard/resources/nouveau"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Nouveau
        </Link>
      </div>

      {/* Liste vide */}
      {items.length === 0 && (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <FileText className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Aucun element pour le moment</p>
          <Link
            href="/dashboard/resources/nouveau"
            className="inline-flex items-center gap-2 mt-4 h-10 px-5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Creer le premier
          </Link>
        </div>
      )}

      {/* Grille */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-slate-900">{item.nom}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <Link
                  href={`/dashboard/resources/${item.id}`}
                  className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                >
                  Voir le detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
