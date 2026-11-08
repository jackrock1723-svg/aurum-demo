import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import SplitType from 'split-type'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const QUOTE =
  'We do not serve dinner. We keep the light low, the room quiet, and time slow — and then we step back.'

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const closingRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !quoteRef.current) return

      const split = new SplitType(quoteRef.current, {
        types: 'lines,words',
        lineClass: 'split-line',
      })

      const words = split.words ?? []

      gsap.set(words, { color: 'rgba(242, 237, 228, 0.14)' })

      gsap.to(words, {
        color: '#F2EDE4',
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 78%',
          end: 'bottom 62%',
          scrub: 0.7,
        },
      })

      gsap.from(closingRef.current, {
        y: 30,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: closingRef.current,
          start: 'top 88%',
          once: true,
        },
      })

      gsap.from(metaRef.current, {
        y: 18,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: metaRef.current,
          start: 'top 92%',
          once: true,
        },
      })

      gsap.fromTo(
        markRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.6,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        },
      )

      return () => {
        split.revert()
      }
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative overflow-hidden py-28 sm:py-36 lg:py-52"
      aria-labelledby="philosophy-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,164,92,0.07),transparent_65%)]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 text-center sm:px-8">
        <div ref={markRef} className="flex origin-center items-center gap-4" aria-hidden="true">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-[0.6rem] text-gold">✦</span>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        <h2 id="philosophy-heading" className="sr-only">
          Our philosophy
        </h2>

        <p
          ref={quoteRef}
          className="mt-12 font-display text-[clamp(1.7rem,4.4vw,4rem)] leading-[1.18] font-light tracking-[-0.01em] text-ivory"
        >
          {QUOTE}
        </p>

        <p
          ref={closingRef}
          className="italic-accent mt-8 text-[clamp(1.4rem,3vw,2.6rem)] text-gold/90"
        >
          Everything else is seasoning.
        </p>

        <div ref={metaRef} className="mt-14 flex flex-col items-center gap-4">
          <span
            className="h-10 w-px bg-gradient-to-b from-gold/40 to-transparent"
            aria-hidden="true"
          />
          <p className="label text-ivory/40">Aurélien Vance · Chef Patron</p>
        </div>
      </div>
    </section>
  )
}
