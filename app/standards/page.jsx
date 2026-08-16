import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Materials & Standards',
  description: 'Body-safe materials, care, and compatibility for Room 23 physical goods.',
}

export default function StandardsPage() {
  return (
    <main className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <p className="last-updated">Last Updated: {SITE_CONFIG.lastUpdated}</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, marginBottom: '1rem' }}>
        Materials &amp; Standards
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
        Every SKU in this catalog is a physical product. We publish composition, care, lubricant
        compatibility, and phthalate-free status on each product page. This page is the house summary.
      </p>

      <section className="space-y-8 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
        <div>
          <h2 className="font-syne text-xl text-white mb-2">Platinum-cure silicone</h2>
          <p>
            The house lubricant is platinum-cure dimethicone. Phthalate-free. Fragrance-free. Latex- and
            polyisoprene-condom compatible. Do not use with silicone toys.
          </p>
        </div>
        <div>
          <h2 className="font-syne text-xl text-white mb-2">Borosilicate glass</h2>
          <p>
            The wand is annealed borosilicate glass: non-porous, phthalate-free, compatible with all
            lubricant types including silicone. Inspect for chips before use. No electronics.
          </p>
        </div>
        <div>
          <h2 className="font-syne text-xl text-white mb-2">Botanical oil</h2>
          <p>
            Midnight Bloom is a skin massage oil: sweet almond, jojoba, evening primrose, vitamin E.
            External use only. Not a dietary supplement. Not a treatment claim. Oils degrade latex.
          </p>
        </div>
        <div>
          <h2 className="font-syne text-xl text-white mb-2">Mulberry silk</h2>
          <p>
            Noir is 22-momme mulberry silk with an adjustable strap. Hand wash cold. Lay flat to dry.
          </p>
        </div>
      </section>

      <ul className="mt-10 space-y-2 text-sm">
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.slug}`} className="link-brass">
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
