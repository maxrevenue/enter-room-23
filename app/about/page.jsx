import BrandPhilosophy from '@/components/brand-philosophy'
import Testimonials from '@/components/testimonials'
import VipWaitlist from '@/components/vip-waitlist'

export const metadata = {
  title: 'About',
  description: 'The Room 23 philosophy — considered pleasure, curated essentials, private delivery.',
}

export default function AboutPage() {
  return (
    <div>
      <BrandPhilosophy />
      <Testimonials />
      <VipWaitlist />
    </div>
  )
}
