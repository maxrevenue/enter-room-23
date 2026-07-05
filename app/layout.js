import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'AW — Adult Wellness',
  description: 'Premium adult wellness. Discreet shipping and billing.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased min-h-screen selection:bg-white selection:text-black`}>
        {children}
      </body>
    </html>
  )
}
