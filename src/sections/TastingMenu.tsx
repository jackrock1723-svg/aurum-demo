import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { courses, menuNote } from '@/data/menu'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function TastingMenu() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track || reduced) return

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const getDistance = (): number => Math.max(0, track.scrollWidth - window.innerWidth)

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`
              }
            },
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      })

      mm.add('(max-width: 1023px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.menu-card')

        cards.forEach((card) => {
          gsap.from(card, {
            y: 46,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          })
        })
      })

      return () => {
        mm.revert()
      }
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="relative overflow-hidden bg-charcoal/40"
      aria-labelledby="menu-title"
    >
      <div
        className={`flex flex-col justify-center py-24 sm:py-32 ${
          reduced ? '' : 'lg:h-svh lg:pt-[104px] lg:pb-5'
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span className="label text-gold/55">04</span>
                <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
                <span className="label text-gold">Tasting Menu</span>
              </div>
              <h2
                id="menu-title"
                className="font-display text-[clamp(2.2rem,5.4vw,4.6rem)] leading-[0.95] font-light text-ivory"
              >
                Seventeen courses,
                <br />
                <span className="text-gold/90 italic">six of them here.</span>
              </h2>
            </div>

            <div className="max-w-sm lg:text-right">
              <p className="text-[0.85rem] leading-relaxed font-light text-ivory/45">{menuNote}</p>
              <p className="mt-4 font-display text-xl text-champagne/90">
                £385 <span className="text-sm text-ivory/40">per guest · wine pairing £210</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex-none overflow-hidden lg:mt-8">
          <div
            ref={trackRef}
            className={`flex flex-col gap-14 px-5 sm:px-8 ${
              reduced
                ? ''
                : 'will-change-transform lg:w-max lg:flex-row lg:items-start lg:gap-10 lg:px-14'
            }`}
          >
            {courses.map((course) => (
              <article
                key={course.id}
                className="menu-card group relative flex w-full flex-col gap-5 lg:w-auto lg:shrink-0"
              >
                <div
                  className={`relative aspect-[4/5] overflow-hidden bg-charcoal ${
                    reduced ? '' : 'lg:h-[40svh] lg:w-auto'
                  }`}
                >
                  <img
                    src={course.image}
                    alt={course.alt}
                    className="cinema-img h-full w-full object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.05]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 ring-1 ring-white/10 transition-all duration-700 ring-inset group-hover:shadow-[inset_0_0_60px_-20px_rgba(201,164,92,0.5)] group-hover:ring-gold/45"
                  />

                  <span className="absolute top-4 left-5 font-display text-lg text-champagne/85">
                    {course.numeral}
                  </span>
                  <span className="absolute top-5 right-5 text-[0.6rem] tracking-[0.22em] text-champagne/90">
                    {course.price}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="label text-gold/70">{course.pairing}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-2xl leading-tight text-ivory transition-colors duration-500 group-hover:text-champagne sm:text-[1.7rem]">
                    {course.name}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-sm leading-relaxed font-light text-ivory/45">
                    {course.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          className={`mx-auto mt-8 w-full max-w-[1600px] items-center gap-6 px-5 sm:px-8 lg:px-14 ${
            reduced ? 'hidden' : 'hidden lg:flex'
          }`}
        >
          <span className="label shrink-0 text-ivory/48">01</span>
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <span
              ref={progressRef}
              className="block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold to-champagne"
            />
          </div>
          <span className="label shrink-0 text-ivory/48">06</span>
          <span className="ml-4 flex shrink-0 items-center gap-2 text-[0.55rem] tracking-[0.28em] text-gold/60 uppercase">
            Scroll <ArrowRight className="h-3 w-3" strokeWidth={1} aria-hidden="true" />
          </span>
        </div>
      </div>
    </section>
  )
}
