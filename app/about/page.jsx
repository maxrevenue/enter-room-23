import BrandPhilosophy from '@/components/brand-philosophy'
import JournalSignup from '@/components/journal-signup'

export const metadata = {
  title: 'About Room 23 - Considered Pleasure',
  description:
    'Room 23 is a considered adult wellness house: body-safe essentials, quiet packaging, and a tightly edited catalog. 18+ only.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div>
      <BrandPhilosophy />
      <JournalSignup />
    </div>
  )
}
