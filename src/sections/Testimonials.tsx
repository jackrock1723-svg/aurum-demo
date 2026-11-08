import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { testimonials } from '@/data/testimonials'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const AUTOPLAY_MS = 7200

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  const total = testimonials.length

  const go = useCallback(
    (direction: 1 | -1) => {
      setIndex((current) => (current + direction + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (reduced || paused) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total)
    }, AUTOPLAY_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [reduced, paused, total])

  const active = useMemo(() => testimonials[index], [index])

  return (
    <section
      className="relative overflow-hidden border-y border-white/[0.06] bg-charcoal/30 py-24 sm:py-32 lg:py-40"
      aria-labelledby="testimonials-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,164,92,0.06),transparent_65%)]"
      />

      <div
        className="relative mx-auto w-full max-w-5xl px-5 sm:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-4">
            <span className="label text-gold/55">06</span>
            <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
            <span className="label text-gold">In Their Words</span>
          </div>

          <h2 id="testimonials-title" className="sr-only">
            Guest testimonials
          </h2>

          <div className="mt-12 w-full overflow-hidden">
            <div
              className="flex transition-transform duration-[1100ms] ease-luxe"
              style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
            >
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex w-full shrink-0 flex-col items-center px-2"
                  aria-hidden={testimonial.id !== active?.id}
                >
                  <div
                    className="flex items-center gap-1.5"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-3 w-3 fill-gold text-gold"
                        strokeWidth={0}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote className="mt-8 min-h-[160px] sm:min-h-[180px]">
                    <p className="font-display text-[clamp(1.35rem,2.9vw,2.35rem)] leading-[1.3] font-light text-ivory/90">
                      “{testimonial.quote}”
                    </p>
                  </blockquote>

                  <figcaption className="mt-6">
                    <p className="text-[0.68rem] tracking-[0.26em] text-champagne uppercase">
                      {testimonial.name}
                    </p>
                    <p className="mt-2 text-[0.6rem] tracking-[0.18em] text-ivory/48 uppercase">
                      {testimonial.title}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-12 flex w-full items-center justify-between gap-6 sm:justify-center sm:gap-10">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-ivory/60 transition-all duration-500 hover:border-gold/60 hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1} aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3" role="tablist" aria-label="Testimonials">
              {testimonials.map((testimonial, dotIndex) => (
                <button
                  key={testimonial.id}
                  type="button"
                  role="tab"
                  aria-selected={dotIndex === index}
                  aria-label={`Testimonial ${dotIndex + 1}`}
                  onClick={() => setIndex(dotIndex)}
                  className={`h-px transition-all duration-700 ease-luxe ${
                    dotIndex === index ? 'w-10 bg-gold' : 'w-5 bg-ivory/25 hover:bg-ivory/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-ivory/60 transition-all duration-500 hover:border-gold/60 hover:text-gold"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-6 text-[0.55rem] tracking-[0.28em] text-ivory/40 uppercase">
            {String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
          </p>
        </div>
      </div>
    </section>
  )
}
