import { Inter, Syne } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import SiteShell from '@/components/site-shell'
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
    default: 'Room 23 — Premium Adult Wellness · Discreet & Private',
    template: '%s | Room 23',
  },
  description:
    'Room 23 offers premium adult wellness products with discreet packaging and private billing. 18+ only. Secure, private, and judgment-free.',
  keywords: [
    'adult wellness',
    'premium intimacy',
    'discreet shipping',
    'private billing',
    'luxury wellness products',
  ],
  authors: [{ name: 'Room 23' }],
  creator: 'Room 23',
  publisher: 'Room 23',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Room 23 — Premium Adult Wellness',
    description:
      'Premium adult wellness products. Discreet packaging. Private billing. 18+ only.',
    url: 'https://room23.net',
    siteName: 'Room 23',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Room 23 — Premium Adult Wellness',
    description: 'Discreet packaging. Private billing. 18+ only.',
  },
}

export default function RootLayout({ children }) {
  const fontVars = `${inter.variable} ${syne.variable}`

  return (
    <html lang="en" className={`dark ${fontVars}`} suppressHydrationWarning>
      <head>
        {/* Inline theme init — matches React default of 'dark' to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('aw_theme');
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch(e) {}
              })()
            `,
          }}
        />
      </head>
      <body>
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  )
}
