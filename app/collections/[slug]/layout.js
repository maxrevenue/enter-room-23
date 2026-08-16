import { COLLECTIONS } from '@/lib/products'

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const meta = COLLECTIONS[slug]
  if (!meta) return { title: 'Collection' }
  return {
    title: meta.title,
    description: meta.subtitle,
  }
}

export default function CollectionLayout({ children }) {
  return children
}
