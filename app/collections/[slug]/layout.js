import { COLLECTIONS } from '@/lib/products'

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }))
}

export default function CollectionLayout({ children }) {
  return children
}
