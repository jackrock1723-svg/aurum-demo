import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-react'
import { Suspense, lazy, useRef } from 'react'
import SplitType from 'split-type'
import MagneticButton from '@/components/MagneticButton'
import { scrollToSection } from '@/hooks/useLenis'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const GoldParticles = lazy(() => import('@/three/GoldParticles'))

gsap.registerPlugin(ScrollTrigger)

const HERO_IMAGE_A =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1900&q=80'
const HERO_IMAGE_B =
  'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=1900&q=80'

interface HeroProps {
  readonly ready: boolean
}

export default function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const imageARef = useRef<HTMLImageElement>(null)
  const imageBRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineOneRef = useRef<HTMLSpanElement>(null)
  const lineTwoRef = useRef<HTMLSpanElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const footRef = useRef<HTMLDivElement>(null)
  const scrollDotRef = useRef<HTMLSpanElement>(null)

  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Ambient motion: Ken Burns drift and the crossfade between two rooms.
  useGSAP(
    () => {
      if (reduced) return

      gsap.fromTo(
        imageARef.current,
        { scale: 1.08, xPercent: -1 },
        {
          scale: 1.2,
          xPercent: 1,
          duration: 28,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
      )

      gsap.fromTo(
        imageBRef.current,
        { scale: 1.2, xPercent: 1 },
        {
          scale: 1.08,
          xPercent: -1,
          duration: 32,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
      )

      gsap
        .timeline({ repeat: -1 })
        .to(imageBRef.current, { opacity: 1, duration: 2.6, ease: 'power2.inOut' }, 7)
        .to(imageBRef.current, { opacity: 0, duration: 2.6, ease: 'power2.inOut' }, 14)

      gsap.fromTo(
        scrollDotRef.current,
        { y: 0, opacity: 0 },
        {
          y: 46,
          opacity: 1,
          duration: 1.9,
          repeat: -1,
          ease: 'power2.inOut',
          keyframes: [
            { opacity: 0, duration: 0 },
            { opacity: 1, duration: 0.45 },
            { y: 46, opacity: 0, duration: 1.4 },
          ],
        },
      )
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  // Entrance, held until the preloader curtain lifts.
  useGSAP(
    () => {
      if (!ready || reduced || !lineOneRef.current || !lineTwoRef.current) return

      // Line one is plain ivory, so it can be split into words. Line two carries
      // the metallic gradient: splitting it would wrap the glyphs in transformed
      // children and break background-clip, so it is masked and lifted whole.
      const splitOne = new SplitType(lineOneRef.current, {
        types: 'words',
        wordClass: 'split-word',
      })

      const wordsOne = splitOne.words ?? []

      const tl = gsap.timeline({ delay: 0.15 })

      tl.from(wordsOne, {
        yPercent: 118,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.07,
      })
        .fromTo(
          lineTwoRef.current,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.4, ease: 'power4.out' },
          '-=1.05',
        )
        .from(eyebrowRef.current, { opacity: 0, y: 16, duration: 1 }, '-=1.1')

      tl.from(subRef.current, { opacity: 0, y: 22, duration: 1.1, ease: 'power2.out' }, '-=0.85')
        .from(
          ctaRef.current?.children ?? [],
          { opacity: 0, y: 20, duration: 0.9, stagger: 0.12, ease: 'power2.out' },
          '-=0.9',
        )
        .from(footRef.current, { opacity: 0, duration: 1.1 }, '-=0.7')

      return () => {
        splitOne?.revert()
      }
    },
    { scope: sectionRef, dependencies: [ready, reduced] },
  )

  // Scroll-linked parallax and hand-off to the next section.
  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return

      gsap.to(bgRef.current, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(contentRef.current, {
        yPercent: -10,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="AURUM — An Evening in Gold"
    >
      {/* Cinematic backdrop */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <img
          ref={imageARef}
          src={HERO_IMAGE_A}
          alt="A candlelit table at AURUM set with crystal and a plated first course"
          className="absolute inset-0 h-full w-full object-cover opacity-70 will-change-transform"
          fetchPriority="high"
          decoding="async"
        />
        <img
          ref={imageBRef}
          src={HERO_IMAGE_B}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 will-change-transform"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.9)_0%,rgba(7,7,7,0.55)_38%,rgba(7,7,7,0.12)_66%,rgba(7,7,7,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(7,7,7,0.1),rgba(7,7,7,0.82))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(201,164,92,0.16),transparent_55%)]" />
      </div>

      {/* Gold dust */}
      <Suspense fallback={null}>
        <GoldParticles
          count={isDesktop ? 1600 : 420}
          className="pointer-events-none absolute inset-0 z-[1]"
        />
      </Suspense>

      {/* Vertical side rail */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 items-center gap-4 xl:flex"
      >
        <span className="h-16 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        <span className="label rotate-180 text-gold/50 [writing-mode:vertical-rl]">
          Three Michelin Stars · Mayfair
        </span>
        <span className="h-16 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 pt-32 pb-24 sm:px-8 lg:px-14"
      >
        <div ref={eyebrowRef} className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[0.6rem] tracking-[0.4em] text-gold">★★★★★</span>
            <span className="h-px w-10 bg-gold/40" aria-hidden="true" />
            <span className="label text-ivory/55">Est. 2009 · Mayfair</span>
          </div>
        </div>

        <h1 className="headline-xl mt-8 text-ivory sm:mt-10">
          <span className="block overflow-hidden pb-[0.08em]">
            <span ref={lineOneRef} className="block">
              An Evening
            </span>
          </span>
          <span className="mt-1 block overflow-hidden pb-[0.1em] sm:mt-2">
            <span ref={lineTwoRef} className="metallic block italic">
              in Gold
            </span>
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-md text-[0.95rem] leading-relaxed font-light text-ivory/60 [text-shadow:0_1px_24px_rgba(7,7,7,0.85)] sm:mt-10 sm:text-base"
        >
          Seventeen courses. Three Michelin stars. Candlelight, aged gold and the quiet theatre of
          the table — held for one evening, and one table only.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-6 sm:mt-12 sm:gap-8">
          <MagneticButton href="#reservation" onClick={() => scrollToSection('#reservation')}>
            Reserve a Table
          </MagneticButton>

          <button
            type="button"
            onClick={() => scrollToSection('#menu')}
            className="group flex items-center gap-3 text-[0.63rem] tracking-[0.28em] text-ivory/60 uppercase transition-colors duration-500 hover:text-gold"
          >
            Explore the menu
            <span className="h-px w-8 bg-gold/40 transition-all duration-500 ease-luxe group-hover:w-12 group-hover:bg-gold" />
          </button>
        </div>
      </div>

      <div
        ref={footRef}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] items-end justify-between gap-6 px-5 pb-8 sm:px-8 sm:pb-10 lg:px-14"
      >
        <button
          type="button"
          onClick={() => scrollToSection('#philosophy')}
          className="group flex items-center gap-4"
          aria-label="Scroll to the philosophy"
        >
          <span className="relative block h-12 w-px overflow-hidden bg-white/15">
            <span
              ref={scrollDotRef}
              className="absolute inset-x-0 top-0 block h-6 bg-gradient-to-b from-gold to-transparent"
            />
          </span>
          <span className="label text-ivory/40 transition-colors duration-500 group-hover:text-gold">
            Scroll
          </span>
        </button>

        <div className="hidden items-center gap-4 text-right sm:flex">
          <span className="label text-ivory/45">Tonight · 19:00 — 22:30</span>
          <ArrowDown className="h-3.5 w-3.5 text-gold/50" strokeWidth={1} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
