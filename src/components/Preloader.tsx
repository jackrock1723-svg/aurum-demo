import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

interface PreloaderProps {
  readonly onComplete: () => void
}

const LETTERS = ['A', 'U', 'R', 'U', 'M'] as const

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const completeRef = useRef(onComplete)

  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const q = gsap.utils.selector(root)
      const outlines = q('.pre-outline')
      const fills = q('.pre-fill')
      const panels = q('.pre-panel')

      const count = { value: 0 }

      gsap.set(fills, { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(barRef.current, { scaleX: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => completeRef.current(),
      })

      tl.from(outlines, {
        yPercent: 118,
        duration: 1.05,
        stagger: 0.075,
      })
        .to(
          fills,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.3,
            ease: 'power2.inOut',
            stagger: 0.055,
          },
          '-=0.62',
        )
        .to(
          count,
          {
            value: 100,
            duration: 2.15,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(count.value)).padStart(2, '0')
              }
            },
          },
          0.1,
        )
        .to(barRef.current, { scaleX: 1, duration: 2.15, ease: 'power1.inOut' }, 0.1)
        .to(contentRef.current, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, '+=0.3')
        .to(
          panels,
          {
            yPercent: -101,
            duration: 1.2,
            stagger: 0.085,
            ease: 'power4.inOut',
          },
          '-=0.2',
        )
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-200 overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="AURUM is preparing your table"
    >
      <div className="absolute inset-0 flex">
        {[0, 1, 2].map((panel) => (
          <div
            key={panel}
            className="pre-panel h-full flex-1 border-r border-white/[0.035] bg-ink last:border-r-0"
          />
        ))}
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center gap-12 px-6"
      >
        <div className="flex items-end font-display text-[clamp(3.4rem,15vw,10rem)] leading-none font-light">
          {LETTERS.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="relative block overflow-hidden"
              style={{ clipPath: 'inset(-15% -8% -15% -8%)' }}
            >
              <span
                className="pre-outline block text-transparent"
                style={{ WebkitTextStroke: '1px rgba(201, 164, 92, 0.9)' }}
              >
                {letter}
              </span>
              <span aria-hidden="true" className="pre-fill metallic absolute inset-0 block">
                {letter}
              </span>
            </span>
          ))}
        </div>

        <div className="flex w-full max-w-[240px] flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="label text-ivory/48">Preparing the room</span>
            <span className="font-display text-lg text-champagne tabular-nums">
              <span ref={counterRef}>00</span>
              <span className="ml-0.5 text-xs text-gold/60">%</span>
            </span>
          </div>
          <div className="h-px w-full overflow-hidden bg-white/10">
            <span
              ref={barRef}
              className="block h-px w-full origin-left bg-gradient-to-r from-gold to-champagne"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
