import BrandPhilosophy from '@/components/brand-philosophy'
import VipWaitlist from '@/components/vip-waitlist'

export const metadata = {
  title: 'About',
  description:
    'The Room 23 philosophy — considered pleasure, curated essentials, and private delivery of body-safe adult wellness products.',
}

export default function AboutPage() {
  return (
    <div>
      <BrandPhilosophy />
      <VipWaitlist />
    </div>
  )
}
