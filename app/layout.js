import './globals.css'
import { Inter, Fraunces } from 'next/font/google'
import SiteShell from '@/components/site-shell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

export const metadata = {
  title: 'AW — Adult Wellness',
  description: 'Premium adult wellness. Discreet shipping and billing.',
}

// No-flash theme init: reads localStorage and applies the class before React hydrates.
const themeInit = `
(function() {
  try {
    var t = localStorage.getItem('aw_theme');
    var root = document.documentElement;
    if (t === 'light') { root.classList.remove('dark'); }
    else { root.classList.add('dark'); }
  } catch(e) { document.documentElement.classList.add('dark'); }
})();
`

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans bg-background text-foreground antialiased min-h-screen selection:bg-foreground selection:text-background`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
