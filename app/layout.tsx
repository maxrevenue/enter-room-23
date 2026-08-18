import type { ReactNode } from 'react'
import { Inter, Syne, Cormorant_Garamond } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import SiteShell from '@/components/site-shell'
import AgeGate from '@/components/AgeGate'
import DiscreetNewsletter from '@/components/DiscreetNewsletter'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { DEFAULT_PALETTE, THEME_INIT_SCRIPT } from '@/lib/theme-palettes'
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

export const metadata = {
  metadataBase: new URL('https://room23.net'),
  title: {
    default: 'Room 23 — Premium Adult Wellness',
    template: '%s | Room 23',
  },
  description:
    'Room 23 offers premium adult wellness products with body-safe materials and secure checkout. 18+ only.',
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
    title: 'Room 23 — Premium Adult Wellness',
    description:
      'Premium adult wellness products. Body-safe essentials. 18+ only.',
    url: 'https://room23.net',
    siteName: 'Room 23',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Room 23 — Premium Adult Wellness',
    description: 'Premium adult wellness. Body-safe essentials. 18+ only.',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SCRIPT,
          }}
        />
      </head>
      <body>
        <AgeGate />
        <a href="#main-content" className="skip-to-content" aria-label="Skip to main content">
          Skip to content
        </a>
        <CartProvider>
          <SiteShell>{children}</SiteShell>
          <DiscreetNewsletter />
        </CartProvider>
        <ThemeSwitcher />
      </body>
    </html>
  )
}
