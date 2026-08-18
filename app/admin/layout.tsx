import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { logoutAdmin } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAdminAuthenticated(await cookies())

  return (
    <div id="main-content" className="fixed inset-0 z-[200] overflow-auto bg-zinc-950 text-zinc-100 antialiased">
      {authed ? (
        <div className="mx-auto flex min-h-full max-w-5xl flex-col px-6 py-8 sm:px-8">
          <header className="mb-12 flex flex-col gap-8 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-2xl tracking-[0.28em] text-zinc-100">ROOM 23</p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                Admin
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <nav aria-label="Admin">
                <ul className="flex flex-wrap gap-x-8 gap-y-3">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-100"
                >
                  Sign out
                </button>
              </form>
            </div>
          </header>
          <div className="flex-1 pb-16">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
