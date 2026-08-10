export default function BrandPhilosophy() {
  return (
    <section
      className="relative px-4 py-16 sm:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)' }}
      aria-labelledby="philosophy-heading"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 w-[70%] max-w-2xl aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(212,168,83,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl text-center relative z-10">
        {/* Official Brand Emblem */}
        <div className="flex justify-center mb-6">
          <img
            src="/new logo 2.png"
            alt="Room 23 — Private Wellness"
            className="h-24 w-auto object-contain animate-float"
            style={{ filter: 'drop-shadow(0 4px 16px rgba(0,134,107,0.12))' }}
          />
        </div>


        <h2
          id="philosophy-heading"
          className="font-syne text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase mb-6"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          Considered pleasure.{' '}
          <span style={{ color: 'var(--color-brass)' }}>Discreet delivery.</span>
        </h2>

        <div className="space-y-5 mb-12">
          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Room 23 is a private members&rsquo; club for those who believe intimacy
            deserves the same refinement as a well-cut suit or a perfectly aged
            spirit. We exist at the intersection of design, wellness, and desire —
            curating objects that elevate the private self.
          </p>
          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every product in our collection is selected with intention. We reject
            the disposable, the garish, the mass-produced. What remains is a
            tightly edited catalog of essentials — delivered in plain packaging,
            billed discreetly, and kept between you and your postman.
          </p>
        </div>

        {/* ── Three Pillars — elevated with bordered boxes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: '◈',
              title: 'Curated',
              body: 'Hand-selected, not warehouse-sourced. Every piece earns its place.',
            },
            {
              icon: '◻',
              title: 'Discreet',
              body: 'Plain packaging. Private billing. Appears as ROOM23 on your statement.',
            },
            {
              icon: '◆',
              title: 'Elevated',
              body: 'Materials and design that belong in a gallery, not a novelty shop.',
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="text-center p-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="text-2xl mb-3"
                style={{ color: 'var(--color-brass)', opacity: 0.7 }}
              >
                {pillar.icon}
              </div>
              <h3
                className="font-syne text-sm font-bold tracking-[0.12em] uppercase mb-2"
                style={{ color: 'var(--color-brass)' }}
              >
                {pillar.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="mx-auto mt-12 h-[1px] max-w-xs"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-brass), transparent)',
          }}
        />
      </div>
    </section>
  )
}
