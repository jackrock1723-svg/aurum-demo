import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import SplitType from 'split-type'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface SectionTitleProps {
  readonly index?: string
  readonly label: string
  readonly title: string
  readonly description?: string
  readonly align?: 'left' | 'center'
  readonly className?: string
  readonly titleClassName?: string
}

export default function SectionTitle({
  index,
  label,
  title,
  description,
  align = 'left',
  className = '',
  titleClassName = '',
}: SectionTitleProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !titleRef.current || !rootRef.current) return

      const split = new SplitType(titleRef.current, {
        types: 'lines,words',
        lineClass: 'split-line',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 84%',
          once: true,
        },
      })

      tl.from(metaRef.current, { y: 22, duration: 0.9, ease: 'power3.out' }).from(
        split.words,
        {
          yPercent: 118,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.035,
        },
        0.08,
      )

      return () => {
        split.revert()
      }
    },
    { scope: rootRef, dependencies: [reduced, title] },
  )

  return (
    <div
      ref={rootRef}
      className={`flex flex-col gap-6 ${
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      } ${className}`}
    >
      <div
        ref={metaRef}
        className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}
      >
        {index && <span className="label text-gold/55">{index}</span>}
        <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
        <span className="label text-gold">{label}</span>
      </div>

      <h2 ref={titleRef} className={`headline text-ivory ${titleClassName}`}>
        {title}
      </h2>

      {description && (
        <p
          className={`max-w-xl text-[0.95rem] leading-relaxed font-light text-ivory/50 ${
            align === 'center' ? 'mx-auto text-center' : ''
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}
