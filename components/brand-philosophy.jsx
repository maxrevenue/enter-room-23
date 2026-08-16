import HoverCard from '@/components/hover-card'

export default function BrandPhilosophy() {
  return (
    <section
      className="relative px-4 py-20 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)' }}
      aria-labelledby="philosophy-heading"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 w-[80%] max-w-3xl aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(200,16,46,0.04) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(200,16,46,0.03) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(200,16,46,0.03) 0%, transparent 40%)',
        }} />
      </div>

      <div className="mx-auto max-w-4xl text-center relative z-10">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-4 font-semibold"
          style={{ color: '#C8102E' }}
        >
          Est. 2024
        </p>

        <h2
          id="philosophy-heading"
          className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          Considered pleasure.{' '}
          <span style={{ color: '#C8102E' }}>Private delivery.</span>
        </h2>

        <div className="space-y-5 mb-14 max-w-2xl mx-auto">
          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Room 23 is a house for those who believe intimacy
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
            tightly edited catalog of essentials — selected with intention,
            delivered quietly, and kept between you and your door.
          </p>
        </div>

        {/* ── Three Pillars ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: '⬡',
              title: 'Curated',
              body: 'Hand-selected, not warehouse-sourced. Every piece earns its place in the catalog.',
            },
            {
              icon: '⬢',
              title: 'Private',
              body: 'Orders arrive quietly. Billing stays unremarkable.',
            },
            {
              icon: '◆',
              title: 'Elevated',
              body: 'Materials and design that belong in a gallery, not a novelty shop.',
            },
          ].map((pillar) => (
            <HoverCard
              key={pillar.title}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center transition-colors"
            >
              <div
                className="text-3xl mb-4 transition-all duration-300"
                style={{ color: '#C8102E' }}
              >
                {pillar.icon}
              </div>
              <h3
                className="font-syne text-sm font-bold tracking-[0.12em] uppercase mb-3"
                style={{ color: '#F4F4F6' }}
              >
                {pillar.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {pillar.body}
              </p>
            </HoverCard>
          ))}
        </div>

        {/* Divider */}
        <div
          className="mx-auto mt-16 h-[1px] max-w-xs"
          style={{
            background: 'linear-gradient(90deg, transparent, #C8102E, transparent)',
          }}
        />
      </div>
    </section>
  )
}
