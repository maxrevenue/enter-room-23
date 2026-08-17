import type { Metadata } from 'next'
import Link from 'next/link'
import { COLLECTIONS } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Collections | Room 23',
  description: 'Curated essentials and new arrivals from Room 23.',
}

const VISIBLE_COLLECTIONS = ['essentials', 'new-arrivals'] as const

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-theme-bg px-6 py-20 text-theme-text">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">The edit</p>
        <h1 className="mt-4 font-serif text-3xl uppercase tracking-[0.22em] text-theme-text md:text-4xl">
          Collections
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-theme-muted">
          Tightly held groupings. Nothing ornamental.
        </p>
      </header>

      <ul className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {VISIBLE_COLLECTIONS.map((slug) => {
          const collection = COLLECTIONS[slug]
          return (
            <li key={slug}>
              <Link
                href={`/collections/${slug}`}
                className="block border border-theme-border bg-theme-surface p-8 transition-colors hover:border-theme-border"
              >
                <h2 className="font-serif text-lg tracking-[0.12em] text-theme-text">{collection.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-theme-muted">{collection.subtitle}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
