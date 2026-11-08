import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { CounterStat } from '@/types'

gsap.registerPlugin(ScrollTrigger)

const STATS: readonly CounterStat[] = [
  { id: 'stars', value: 3, suffix: '', label: 'Michelin stars', detail: 'Held since 2016' },
  {
    id: 'years',
    value: 17,
    suffix: '',
    label: 'Years at the pass',
    detail: 'Same address, same room',
  },
  {
    id: 'wines',
    value: 1400,
    suffix: '',
    label: 'Wines in the cellar',
    detail: 'Eleven sommeliers',
  },
  {
    id: 'awards',
    value: 12,
    suffix: '',
    label: 'International awards',
    detail: 'Including World’s 50 Best',
  },
]

const format = (value: number): string => value.toLocaleString('en-GB')

export default function Counters() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return

      const values = gsap.utils.toArray<HTMLElement>('.stat-value')

      values.forEach((node) => {
        const target = Number(node.dataset.value ?? '0')
        const suffix = node.dataset.suffix ?? ''
        const counter = { value: 0 }

        node.textContent = `0${suffix}`

        gsap.to(counter, {
          value: target,
          duration: 2.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          onUpdate: () => {
            node.textContent = `${format(Math.round(counter.value))}${suffix}`
          },
        })
      })

      gsap.from('.stat-item', {
        y: 34,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
      })
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/[0.06] bg-ink py-20 sm:py-24 lg:py-28"
      aria-label="AURUM by the numbers"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_50%_120%,rgba(201,164,92,0.08),transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-y-14 px-5 sm:px-8 lg:grid-cols-4 lg:gap-y-0 lg:px-14">
        {STATS.map((stat, index) => (
          <div
            key={stat.id}
            className={`stat-item flex flex-col items-center text-center ${
              index > 0 ? 'lg:border-l lg:border-white/8' : ''
            }`}
          >
            <span
              className="stat-value font-display text-[clamp(2.8rem,6vw,4.6rem)] leading-none font-light text-gold tabular-nums"
              data-value={stat.value}
              data-suffix={stat.suffix}
            >
              {format(stat.value)}
              {stat.suffix}
            </span>
            <span className="mt-4 text-[0.6rem] tracking-[0.3em] text-ivory/70 uppercase">
              {stat.label}
            </span>
            <span className="mt-2 text-[0.58rem] tracking-[0.18em] text-ivory/45 uppercase">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
