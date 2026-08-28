import type { ReactNode } from 'react'
import { Inter, Syne, Cormorant_Garamond } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import SiteShell from '@/components/site-shell'
import AgeGate from '@/components/AgeGate'
import DiscreetNewsletter from '@/components/DiscreetNewsletter'
import { DEFAULT_PALETTE } from '@/lib/theme-palettes'
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

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const DEFAULT_TITLE = 'Premium Adult Wellness - Body-Safe Essentials | Room 23'
const DEFAULT_DESCRIPTION =
  'Shop body-safe adult wellness essentials from Room 23: refined lubricants, intimate care, and discreet checkout. Considered pleasure. 18+ only.'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata = {
  metadataBase: new URL('https://room23.net'),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Room 23',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'adult wellness',
    'premium intimacy',
    'body-safe',
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
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: 'https://room23.net',
    siteName: 'Room 23',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontVars = `${inter.variable} ${syne.variable} ${cormorant.variable}`

  return (
    <html
      lang="en"
      className={fontVars}
      data-palette={DEFAULT_PALETTE}
      suppressHydrationWarning
    >
      <body>
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
