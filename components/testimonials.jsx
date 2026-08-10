import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The Platinum Silicone formula is quite literally the best I have ever used. Impossibly smooth, effortless cleanup, and completely discreet packaging.",
    author: "DEVON K.",
    location: "BROOKLYN, NY"
  },
  {
    id: 2,
    quote: "Room 23 understands what adult wellness should look like. High-end, impeccably designed, and no unnecessary frills. A true luxury experience.",
    author: "SARAH M.",
    location: "LOS ANGELES, CA"
  },
  {
    id: 3,
    quote: "Finally, products that look beautiful on the nightstand and perform exactly as promised. The shipping was incredibly fast and completely anonymous.",
    author: "JAMES P.",
    location: "CHICAGO, IL"
  }
]

export default function Testimonials() {
  return (
    <section className="w-full py-24 md:py-32 px-4 sm:px-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="mx-auto max-w-4xl">
        {/* ── Section Title ── */}
        <h2 
          className="text-center mb-16 font-bold tracking-[0.25em] uppercase text-sm md:text-base"
          style={{ color: 'var(--color-emerald)', fontFamily: 'var(--font-display)' }}
        >
          WHAT THEY SAY
        </h2>

        {/* ── Review Cards ── */}
        <div className="flex flex-col space-y-8">
          {TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="flex flex-col items-center justify-center p-12 text-center rounded-lg shadow-xl"
              style={{ 
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)' 
              }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-current" 
                    style={{ color: 'var(--color-emerald)' }} 
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote 
                className="mb-8 text-xl md:text-2xl leading-relaxed italic"
                style={{ 
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-display)' 
                }}
              >
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author & Location */}
              <div className="flex flex-col items-center gap-1">
                <span 
                  className="font-bold uppercase tracking-widest text-sm"
                  style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
                >
                  {testimonial.author}
                </span>
                <span 
                  className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {testimonial.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
