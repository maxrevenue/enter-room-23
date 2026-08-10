import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The Platinum Silicone formula is quite literally the best I have ever used. Impossibly smooth, effortless cleanup, and the packaging is completely anonymous.",
    author: "DEVON K.",
    location: "BROOKLYN, NY",
    rating: 5,
  },
  {
    id: 2,
    quote: "Room 23 understands what adult wellness should look like. High-end, impeccably designed, and no unnecessary frills. A true luxury experience from start to finish.",
    author: "SARAH M.",
    location: "LOS ANGELES, CA",
    rating: 5,
  },
  {
    id: 3,
    quote: "Finally, products that look beautiful on the nightstand and perform exactly as promised. Shipping was incredibly fast and completely discreet.",
    author: "JAMES P.",
    location: "CHICAGO, IL",
    rating: 5,
  }
]

export default function Testimonials() {
  return (
    <section
      className="w-full py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(200,16,46,0.04) 0%, transparent 70%)' }}
        />
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.3em] uppercase font-bold mb-3"
            style={{ color: '#C8102E' }}
          >
            Testimonials
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-[0.15em] uppercase"
            style={{ color: '#F4F4F6', fontFamily: 'var(--font-display)' }}
          >
            What They Say
          </h2>
          <div
            className="w-16 h-px mx-auto mt-5"
            style={{ background: 'linear-gradient(90deg, transparent, #C8102E, transparent)' }}
          />
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative flex flex-col p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(200,16,46,0.25)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              {/* Quote icon */}
              <Quote
                className="w-6 h-6 mb-4 opacity-30"
                style={{ color: '#C8102E' }}
              />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-current"
                    style={{ color: '#C8102E' }}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="flex-1 text-sm leading-relaxed mb-6 italic"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}
              >
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Divider */}
              <div
                className="h-px mb-4"
                style={{ background: 'linear-gradient(90deg, rgba(200,16,46,0.3), transparent)' }}
              />

              {/* Author */}
              <div>
                <span
                  className="block text-xs font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: '#F4F4F6' }}
                >
                  {testimonial.author}
                </span>
                <span
                  className="text-[10px] uppercase tracking-widest"
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
