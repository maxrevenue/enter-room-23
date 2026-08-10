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
    subtitle: 'Beyond soap and water \u2014 a modern guide to pH-conscious care, barrier-friendly routines, and why the most sensitive skin on your body deserves considered formulations.',
    content: [
      'For decades, intimate care was treated as an afterthought \u2014 an extension of the shower routine rather than a discipline in its own right. Standard body washes, formulated with aggressive surfactants like sodium lauryl sulfate and calibrated to heavily alkaline pH levels, were routinely applied to delicate mucosal tissue. These are areas that require a tightly controlled, acidic microenvironment to function at their best.',
      'Today, a modern understanding of barrier function and microbiome health has fundamentally rewritten the rules of intimate care. Intimate skin naturally maintains a pH range of 3.8 to 4.5 \u2014 a carefully balanced acidic environment. Conventional alkaline soaps, which often register a pH between 9 and 10, strip away this protective acid mantle, creating conditions for irritation, dryness, and microbial imbalance.',
      'A thoughtful intimate wellness routine is built on three essential pillars: gentle pH alignment, moisture barrier support, and uncompromising ingredient integrity. Seek out formulations enriched with organic aloe vera, plant-derived propanediol, and bio-identical lactic acid \u2014 ingredients that respect your body\'s natural ecology while delivering genuine, high-performance comfort.',
      'When choosing personal care products, always prioritize non-comedogenic, water-soluble formulas that are entirely free from parabens and synthetic fragrances. Demand transparent ingredient lists from every brand you trust. Taking considered care behind closed doors is not an indulgence \u2014 it is a fundamental act of self-regard.'
    ],
    recommendedProductIds: ['lube-water-01', 'lube-aloe-01']
  },
  'lubricant-formulations': {
    title: 'Understanding Personal Lubricant Formulations',
    date: 'July 22, 2026',
    readTime: '8 min read',
    author: 'Room 23 Editorial',
    category: 'Education',
    subtitle: 'Water-based. Silicone. Hybrid. Aloe. A clear-eyed breakdown of the chemistry, compatibility, and performance behind every formulation type.',
    content: [
      'Not all personal lubricants are created equal. While the market overflows with options, remarkably few consumers understand the fundamental chemistry that separates a premium formulation from a mass-market compromise. Here is what actually matters.',
      'Water-based lubricants remain the gold standard for everyday versatility and universal material compatibility. Formulated from purified water and plant-derived cellulose, high-grade water-based options deliver an effortless, natural glide and rinse away cleanly with water alone. The critical factor few brands discuss: osmolality \u2014 the concentration of dissolved particles \u2014 must be carefully calibrated to remain under 1,200 mOsm/kg to match the body\'s own fluids and prevent cellular dehydration.',
      'Platinum silicone lubricants occupy a different tier entirely. Using medical-grade dimethicone, they deliver an ultra-concentrated, waterproof glide from a single drop. Because silicone neither evaporates nor absorbs into the skin, it is the definitive choice for shower intimacy and full-body massage. Cleanup requires a mild cleanser, and one essential rule applies: silicone lubricants should never be paired with silicone-based wellness devices.',
      'Hybrid formulas bridge both worlds \u2014 blending purified water with a measured addition of dimethicone for long-lasting silkiness that still washes off with ease. For those with heightened sensitivity, organic aloe-based formulas replace water entirely with certified aloe vera juice, delivering deeply soothing, plant-powered moisture designed for the most delicate skin.'
    ],
    recommendedProductIds: ['lube-water-01', 'lube-silicone-01', 'lube-hybrid-01']
  },
  'discreet-luxury': {
    title: 'Why Discretion Is the Ultimate Luxury',
    date: 'July 10, 2026',
    readTime: '4 min read',
    author: 'Room 23 Editorial',
    category: 'Lifestyle',
    subtitle: 'In an era of performative transparency and digital oversharing, deliberate privacy has become the most refined statement of all.',
    content: [
      'In today\'s digital landscape, genuine privacy has become the scarcest luxury of all. Between public unboxing culture, relentless algorithmic advertising, and pervasive data harvesting, the most intimate dimensions of personal life are increasingly \u2014 and often involuntarily \u2014 laid bare.',
      'Room 23 was built on a conviction that true luxury belongs behind closed doors. You should never have to sacrifice personal privacy to access world-class intimate wellness products. That principle informs every decision we make \u2014 from product sourcing to the moment your order reaches your hands.',
      'From completely plain, unmarked shipping boxes that reveal nothing about their contents, to neutral credit card descriptors that protect your statement, privacy logistics are woven into the very architecture of our business. What happens in Room 23 stays in Room 23 \u2014 because we believe the most intimate parts of your life belong exclusively to you.'
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
    <article className="py-12 sm:py-16 min-h-screen bg-[var(--bg-base)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-[#C9A060] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to The Column
        </Link>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full border border-[#C9A060]/40 text-[#C9A060] bg-[#C9A060]/10">
            {article.category}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[var(--font-syne)] text-white leading-tight mb-4">
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white/70 leading-relaxed mb-6 font-light">
          {article.subtitle}
        </p>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 text-xs text-white/50 mb-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white/80">
              <Calendar className="w-3.5 h-3.5 text-[#C9A060]" /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C9A060]" /> {article.readTime}
            </span>
          </div>
          <span className="text-[#C9A060] font-semibold">{article.author}</span>
        </div>

        {/* Article Content Paragraphs */}
        <div className="prose prose-invert max-w-none space-y-6 text-base sm:text-lg leading-relaxed text-white/80 font-normal">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Recommended Products Bar */}
        {recommendedProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#C9A060]" />
              <h3 className="text-lg font-bold text-white font-[var(--font-syne)] uppercase tracking-wider">
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
