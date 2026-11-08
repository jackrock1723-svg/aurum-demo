import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'ghost'

interface MagneticButtonProps {
  readonly children: ReactNode
  readonly href?: string
  readonly onClick?: () => void
  readonly variant?: Variant
  readonly className?: string
  readonly type?: 'button' | 'submit'
  readonly strength?: number
  readonly ariaLabel?: string
  readonly disabled?: boolean
}

const BASE =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-[0.63rem] font-medium tracking-[0.28em] uppercase transition-colors duration-500 ease-luxe'

const VARIANTS: Record<Variant, string> = {
  solid: 'bg-gold text-ink hover:bg-champagne',
  outline: 'border border-gold/40 text-ivory hover:border-gold hover:text-ink',
  ghost: 'text-ivory/80 hover:text-gold',
}

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'outline',
  className = '',
  type = 'button',
  strength = 0.34,
  ariaLabel,
  disabled = false,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const moveX = useRef<((value: number) => void) | null>(null)
  const moveY = useRef<((value: number) => void) | null>(null)

  useGSAP(
    () => {
      const inner = innerRef.current
      if (!inner) return

      moveX.current = gsap.quickTo(inner, 'x', { duration: 0.7, ease: 'power3.out' })
      moveY.current = gsap.quickTo(inner, 'y', { duration: 0.7, ease: 'power3.out' })
    },
    { scope: wrapRef },
  )

  const handleMove = (event: MouseEvent<HTMLDivElement>): void => {
    const wrap = wrapRef.current
    if (!wrap) return

    const rect = wrap.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)

    moveX.current?.(offsetX * strength)
    moveY.current?.(offsetY * strength)
  }

  const handleLeave = (): void => {
    moveX.current?.(0)
    moveY.current?.(0)
  }

  const content = (
    <>
      {variant === 'outline' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-700 ease-luxe group-hover:translate-y-0"
        />
      )}
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  )

  const classes = `${BASE} ${VARIANTS[variant]} ${className}`

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block will-change-transform"
      data-cursor="link"
    >
      <span ref={innerRef} className="inline-flex will-change-transform">
        {href ? (
          <a
            href={href}
            onClick={(event) => {
              if (!onClick) return
              event.preventDefault()
              onClick()
            }}
            className={classes}
            aria-label={ariaLabel}
          >
            {content}
          </a>
        ) : (
          <button
            type={type}
            onClick={onClick}
            className={classes}
            aria-label={ariaLabel}
            disabled={disabled}
          >
            {content}
          </button>
        )}
      </span>
    </div>
  )
}
