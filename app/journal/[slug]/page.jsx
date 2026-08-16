import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Calendar, ArrowLeft } from 'lucide-react'
import { JOURNAL_ARTICLES, getJournalArticle } from '@/lib/journal'
import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/product-card'

export function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({ slug: article.id }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = getJournalArticle(slug)
  if (!article) return { title: 'Journal' }
  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function JournalArticlePage({ params }) {
  const { slug } = await params
  const article = getJournalArticle(slug)
  if (!article) notFound()

  const recommendedProducts = PRODUCTS.filter((p) =>
    article.recommendedProductIds?.includes(p.id),
  )

  return (
    <article className="py-12 sm:py-16 min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-8"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to the Journal
        </Link>

        <div className="mb-4">
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full border border-zinc-700">
            {article.category}
          </span>
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          {article.title}
        </h1>

        <p className="text-lg leading-relaxed mb-6 font-light" style={{ color: 'var(--color-text-secondary)' }}>
          {article.subtitle}
        </p>

        <div
          className="flex flex-wrap items-center justify-between gap-4 py-4 border-y text-xs mb-10"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
          </div>
          <span>{article.author}</span>
        </div>

        <div className="space-y-6 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {article.content.map((paragraph, idx) => (
            <p key={idx} style={{ lineHeight: 1.85 }}>{paragraph}</p>
          ))}
        </div>

        {recommendedProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              From this article
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
