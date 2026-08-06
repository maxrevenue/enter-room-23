export default function BrandPhilosophy() {
  return (
    <section
      className="relative px-4 py-14 sm:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bne-espresso, var(--bg-base))' }}
      aria-labelledby="philosophy-heading"
    >
      {/* Subtle brass glow in background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 w-[60%] max-w-2xl aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.025]"
          style={{
            background: 'radial-gradient(ellipse, var(--bne-brass, #c8a34e) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl text-center relative z-10">
        {/* Lock icon / "23" mark */}
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-8 border"
          style={{
            borderColor: 'var(--bne-brass, var(--accent))',
            backgroundColor: 'var(--bg-elevated, var(--bg-surface))',
          }}
          aria-hidden="true"
        >
          <span
            className="font-syne text-xl font-bold tracking-[0.05em]"
            style={{ color: 'var(--bne-brass, var(--accent))' }}
          >
            23
          </span>
        </div>

        <h2
          id="philosophy-heading"
          className="font-syne text-2xl sm:text-3xl font-bold tracking-[0.08em] uppercase mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Considered pleasure. Discreet delivery.
        </h2>

        <div className="space-y-5">
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

        {/* ── Three Pillars ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-10 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {[
            {
              title: 'Curated',
              body: 'Hand-selected, not warehouse-sourced. Every piece earns its place.',
            },
            {
              title: 'Discreet',
              body: 'Plain packaging. Private billing. Appears as ROOM23 on your statement.',
            },
            {
              title: 'Elevated',
              body: 'Materials and design that belong in a gallery, not a novelty shop.',
            },
          ].map((pillar) => (
            <div key={pillar.title} className="text-center">
              <h3
                className="font-syne text-sm font-bold tracking-[0.12em] uppercase mb-2"
                style={{ color: 'var(--bne-brass, var(--accent))' }}
              >
                {pillar.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="mx-auto mt-10 h-[1px] max-w-xs"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--bne-brass, var(--accent)), transparent)',
          }}
        />
      </div>
    </section>
  )
}
