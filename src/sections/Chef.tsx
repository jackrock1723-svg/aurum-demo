import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import SectionTitle from '@/components/SectionTitle'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const PORTRAIT =
  'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=1100&h=1400&q=80'
const PASS_IMAGE =
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&h=1000&q=80'

export default function Chef() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLImageElement>(null)
  const insetRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<SVGPathElement>(null)
  const statsRef = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return

      gsap.fromTo(
        frameRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.7,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: frameRef.current, start: 'top 82%', once: true },
        },
      )

      gsap.fromTo(
        portraitRef.current,
        { scale: 1.28 },
        {
          scale: 1,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: frameRef.current, start: 'top 82%', once: true },
        },
      )

      gsap.to(insetRef.current, {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      const path = signatureRef.current
      if (path) {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: path, start: 'top 92%', once: true },
        })
      }

      gsap.from(statsRef.current?.children ?? [], {
        y: 24,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 90%', once: true },
      })
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  return (
    <section
      ref={sectionRef}
      id="chef"
      className="relative overflow-hidden bg-charcoal/30 py-24 sm:py-32 lg:py-40"
      aria-labelledby="chef-title"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-14 xl:gap-16">
        {/* Portrait */}
        <div className="relative lg:col-span-6 xl:col-span-5">
          <div className="relative">
            <div
              ref={frameRef}
              className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal"
            >
              <img
                ref={portraitRef}
                src={PORTRAIT}
                alt="Portrait of Aurélien Vance, chef patron of AURUM, in a linen chef's jacket"
                className="cinema-img h-full w-full object-cover will-change-transform"
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
              />
              <div aria-hidden="true" className="absolute inset-0 ring-1 ring-gold/15 ring-inset" />
            </div>

            <div
              ref={insetRef}
              className="absolute -right-4 -bottom-10 hidden w-[38%] max-w-[190px] overflow-hidden border border-gold/25 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:block lg:-right-10"
            >
              <img
                src={PASS_IMAGE}
                alt="A chef plating a course at the pass under brass lamps"
                className="cinema-img aspect-[3/4] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <p className="label mt-16 text-ivory/48 lg:mt-20">The pass · 20:12</p>
        </div>

        {/* Story */}
        <div className="lg:col-span-6 lg:col-start-7">
          <SectionTitle
            index="02"
            label="The Chef"
            title="Aurélien Vance"
            titleClassName="text-ivory"
          />

          <div className="mt-8 max-w-xl space-y-5 text-[0.95rem] leading-relaxed font-light text-ivory/55">
            <p>
              He trained in Lyon, then spent four years in the kitchens of Kyoto learning a
              different kind of restraint — the discipline of removing, not adding. In 2009 he
              opened AURUM with nine tables and a single question: what would happen if a restaurant
              behaved like a held breath?
            </p>
            <p>
              Seventeen years later the answer is still served nightly. His cooking is quiet,
              precise, and built on three ingredients he refuses to compromise: the tide, the
              season, and silence.
            </p>
          </div>

          <blockquote className="mt-10 border-l border-gold/25 pl-6">
            <p className="italic-accent text-lg leading-snug text-champagne/85 sm:text-xl">
              “A plate should arrive the way a good sentence ends — inevitable, and a little
              devastating.”
            </p>
          </blockquote>

          {/* Signature */}
          <div className="mt-10 flex flex-col gap-2">
            <span className="italic-accent text-3xl text-ivory/90 sm:text-4xl">Aurélien Vance</span>
            <svg
              viewBox="0 0 260 40"
              className="h-8 w-52 text-gold sm:w-64"
              fill="none"
              aria-hidden="true"
            >
              <path
                ref={signatureRef}
                d="M6 27 C 26 6, 54 5, 62 21 C 68 33, 46 38, 43 26 C 40 12, 80 5, 106 13 C 124 19, 150 26, 176 14 C 192 7, 208 10, 218 18 C 228 26, 240 24, 250 16"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <ul ref={statsRef} className="mt-12 grid grid-cols-3 gap-6 border-t border-white/8 pt-8">
            {[
              { value: '17', label: 'Years at the pass' },
              { value: '3', label: 'Michelin stars' },
              { value: '9', label: 'Tables only' },
            ].map((item) => (
              <li key={item.label}>
                <span className="block font-display text-3xl text-gold sm:text-4xl">
                  {item.value}
                </span>
                <span className="mt-2 block text-[0.55rem] tracking-[0.24em] text-ivory/40 uppercase">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
