import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Calendar, ArrowLeft, Share2, Sparkles, BookOpen } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'
import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/product-card'

const ARTICLES = {
  'wellness-maintenance': {
    title: 'The Art of Intimate Wellness Maintenance',
    date: 'August 1, 2026',
    readTime: '6 min read',
    author: 'Room 23 Editorial',
    category: 'Wellness',
    subtitle: 'Beyond soap and water \u2014 a modern guide to pH-aware hygiene, barrier-friendly routines, and why intimate skin deserves considered formulations.',
    content: [
      'For decades, intimate care was treated as an afterthought in personal grooming. Standard body washes\u2014often formulated with harsh surfactants like sodium lauryl sulfate and heavily alkaline pH levels\u2014were routinely applied to delicate mucosal membranes. These are areas that actually require a tightly controlled, acidic microenvironment to thrive.',
      'Today, a modern understanding of barrier function and skin microbiome health has revolutionized intimate care. Intimate skin naturally maintains a delicate pH range of 3.8 to 4.5. Exposing this area to conventional alkaline soaps, which often carry a pH of 9 to 10, strips away the natural acid mantle, opening the door to irritation, dryness, and imbalance.',
      'A thoughtful, considered intimate wellness routine is built on three core pillars: gentle pH alignment, moisture barrier support, and absolute ingredient integrity. Look for formulations rich in organic aloe vera, plant-derived propanediol, and bio-identical lactic acid. These elements respect your body\'s natural ecology while providing high-performance comfort.',
      'When selecting personal products, always prioritize non-comedogenic, water-soluble formulas that are completely free from parabens and synthetic fragrances, and demand clear ingredient transparency. Taking extra care behind closed doors isn\'t just a luxury\u2014it is a fundamental act of self-regard.'
    ],
    recommendedProductIds: ['lube-water-01', 'lube-aloe-01']
  },
  'lubricant-formulations': {
    title: 'Understanding Personal Lubricant Formulations',
    date: 'July 22, 2026',
    readTime: '8 min read',
    author: 'Room 23 Editorial',
    category: 'Education',
    subtitle: 'Water-based. Silicone. Hybrid. Aloe. Demystifying the chemistry, osmolality, and performance of personal lubricants.',
    content: [
      'Not all personal lubricants are created equal. While the market is saturated with options, very few consumers understand the fundamental chemistry that distinguishes water-based, silicone, hybrid, and aloe-based formulations.',
      'Water-Based Formulas: The gold standard for daily versatility and universal toy compatibility. Crafted from purified water and plant cellulose, high-grade water lubricants offer an effortless glide and rinse away cleanly with just water. Crucially, osmolality (the concentration of dissolved particles) must be carefully calibrated to match body fluids\u2014remaining under 1200 mosm/kg\u2014to prevent cellular dehydration.',
      'Silicone-Based Formulas: Platinum silicone lubricants provide an ultra-concentrated, waterproof glide using medical-grade dimethicone. A single drop lasts indefinitely, making silicone the ultimate choice for shower intimacy and body massage. Because it neither evaporates nor absorbs into the skin, it requires a mild soap for cleanup. Note: Silicone lubricants should never be paired with silicone-based wellness devices.',
      'Hybrid & Aloe-Based Formulas: Hybrid formulas offer the best of both worlds, infusing purified water with a whisper of dimethicone for a long-lasting, silky feel that still washes off with ease. Alternatively, organic aloe-based formulas replace water with certified aloe vera juice, delivering deeply soothing moisture explicitly designed for sensitive skin.'
    ],
    recommendedProductIds: ['lube-water-01', 'lube-silicone-01', 'lube-hybrid-01']
  },
  'discreet-luxury': {
    title: 'Why Discretion Is the Ultimate Luxury',
    date: 'July 10, 2026',
    readTime: '4 min read',
    author: 'Room 23 Editorial',
    category: 'Lifestyle',
    subtitle: 'In an era of public unboxing and digital data harvesting, quiet privacy belongs behind closed doors.',
    content: [
      'In today\'s digital landscape, true privacy has become the rarest of luxuries. Between public unboxing videos, relentless targeted advertising, and invasive data harvesting, the most intimate corners of our personal lives are increasingly exposed.',
      'Room 23 was founded on a radical premise: true luxury belongs behind closed doors. You should never have to compromise your personal privacy to access world-class intimate wellness products.',
      'From our completely plain, unbranded shipping boxes that offer zero hints about their contents, to our neutral and discreet credit card statement descriptors, privacy logistics are woven into our very foundation. We believe that what happens in Room 23 belongs solely to you.'
    ],
    recommendedProductIds: ['toy-wand-01', 'toy-couples-01']
  }
}



export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }))
}

export default async function JournalArticlePage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug
  const article = ARTICLES[slug] || ARTICLES['wellness-maintenance']

  const recommendedProducts = PRODUCTS.filter((p) =>
    article.recommendedProductIds?.includes(p.id)
  )

  return (
    <article className="py-12 sm:py-16 min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors mb-8 hover:text-[color:var(--color-emerald)]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to the Journal
        </Link>

        {/* Category Badge */}
        <div className="mb-4">
          <span
            className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full"
            style={{
              border: '1px solid rgba(0,134,107,0.35)',
              color: 'var(--color-emerald)',
              backgroundColor: 'rgba(0,134,107,0.07)',
            }}
          >
            {article.category}
          </span>
        </div>

        {/* Article Title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)',
          }}
        >
          {article.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg leading-relaxed mb-6 font-light"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {article.subtitle}
        </p>

        {/* Metadata Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 py-4 border-y text-xs mb-10"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-emerald)' }} /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-emerald)' }} /> {article.readTime}
            </span>
          </div>
          <span className="font-semibold" style={{ color: 'var(--color-emerald)' }}>{article.author}</span>
        </div>

        {/* Article Content Paragraphs */}
        <div
          className="prose max-w-none space-y-6 text-base sm:text-lg leading-relaxed font-normal"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {article.content.map((paragraph, idx) => (
            <p key={idx} style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85 }}>{paragraph}</p>
          ))}
        </div>

        {/* Recommended Products Bar */}
        {recommendedProducts.length > 0 && (
          <div
            className="mt-14 pt-10 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              <h3
                className="text-lg font-bold uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Featured in this Article
              </h3>
            </div>
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
