'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function NavMobile() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 text-slate-700 hover:text-slate-900 transition-colors"
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 py-4 px-6 space-y-4 z-50 shadow-sm">
          <Link
            href="/#fonctionnalites"
            className="block text-sm text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            Fonctionnalites
          </Link>
          <Link
            href="/#tarifs"
            className="block text-sm text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            Tarifs
          </Link>
          <Link
            href="/#apropos"
            className="block text-sm text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            A propos
          </Link>
          <hr className="border-slate-100" />
          <Link
            href="/login"
            className="block text-sm text-slate-500 hover:text-slate-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            Commencer
          </Link>
        </div>
      )}
    </div>
  )
}
