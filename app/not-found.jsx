import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div
      className="container-narrow"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: '2rem',
          border: '1px solid var(--color-border-accent)', backgroundColor: 'rgba(200,16,46,0.05)',
        }}
        className="animate-pulse-glow"
      >
        <span style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brass)', letterSpacing: '0.1em' }}>R23</span>
      </div>

      <p style={{ fontSize: 'var(--text-5xl)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1, marginBottom: '0.5rem' }}>404</p>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
        This Door Does Not Exist
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: 'var(--text-base)', lineHeight: 1.7, marginBottom: '2rem' }}>
        The page you are looking for has been moved, removed, or never existed.
        All valid paths lead through the entrance.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn-primary">Return Home</Link>
        <Link href="/shop" className="btn-secondary">Browse Shop</Link>
        <Link href="/contact" className="btn-ghost">Contact Support</Link>
      </div>
    </div>
  )
}
