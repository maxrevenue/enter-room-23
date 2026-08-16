import type { ReactNode } from 'react'
import { Inter, Syne } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import SiteShell from '@/components/site-shell'
import SoftLaunchBanner from '@/components/SoftLaunchBanner'
import AgeGate from '@/components/AgeGate'
import DiscreetNewsletter from '@/components/DiscreetNewsletter'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata = {
  metadataBase: new URL('https://room23.net'),
  title: {
    default: 'Room 23 — Premium Adult Wellness',
    template: '%s | Room 23',
  },
  description:
    'Room 23 offers premium adult wellness products, privately delivered. 18+ only.',
  keywords: [
    'adult wellness',
    'premium intimacy',
    'private delivery',
    'luxury wellness products',
  ],
  authors: [{ name: 'Room 23' }],
  creator: 'Room 23',
  publisher: 'Room 23',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Room 23 — Premium Adult Wellness',
    description:
      'Premium adult wellness products. Private delivery. 18+ only.',
    url: 'https://room23.net',
    siteName: 'Room 23',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Room 23 — Premium Adult Wellness',
    description: 'Premium adult wellness. Private delivery. 18+ only.',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontVars = `${inter.variable} ${syne.variable}`

  return (
    <html lang="en" className={fontVars} data-theme="noir">
      <body>
        <SoftLaunchBanner />
        <AgeGate />
        <a href="#main-content" className="skip-to-content" aria-label="Skip to main content">
          Skip to content
        </a>
        <CartProvider>
          <SiteShell>{children}</SiteShell>
          <DiscreetNewsletter />
        </CartProvider>
      </body>
    </html>
  )
}
