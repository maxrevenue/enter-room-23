<<<<<<< HEAD
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "../lib/theme-context";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
=======
import { Inter, Syne } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import SiteShell from '@/components/site-shell'
import './globals.css'
>>>>>>> 686c236 (feat: finalize luxury entrance landing page with atmospheric depth and levitating door animation)

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

<<<<<<< HEAD
export const metadata = {
  title: "ROOM 23 — Enter Your Private Side",
  description:
    "A private members club and underground gallery. Discreet. Curated. Yours.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
=======
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata = {
  title: 'ROOM 23 — Discreet. Curated. Exclusive.',
  description: 'An exclusive sanctuary for sensual well-being. Enter your private side.',
  metadataBase: new URL('https://enterroom23.com'),
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
                  // Default to dark (neon noir) if no stored preference
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
>>>>>>> 686c236 (feat: finalize luxury entrance landing page with atmospheric depth and levitating door animation)
