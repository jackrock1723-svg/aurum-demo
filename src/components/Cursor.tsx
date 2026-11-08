import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Cursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()
  const enabled = finePointer && !reduced

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!enabled) return

      const dot = dotRef.current
      const ring = ringRef.current
      const label = labelRef.current
      if (!dot || !ring || !label) return

      document.documentElement.classList.add('has-custom-cursor')

      gsap.set([dot, ring], {
        xPercent: -50,
        yPercent: -50,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' })
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' })
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' })
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' })

      const setState = (state: 'idle' | 'link' | 'view'): void => {
        const isView = state === 'view'
        const isLink = state === 'link' || isView

        gsap.to(ring, {
          scale: isView ? 1.85 : isLink ? 1.42 : 1,
          borderColor: isView ? 'rgba(232, 211, 162, 0.9)' : 'rgba(201, 164, 92, 0.65)',
          backgroundColor: isView ? 'rgba(201, 164, 92, 0.1)' : 'rgba(201, 164, 92, 0)',
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        })

        gsap.to(dot, {
          scale: isLink ? 0.4 : 1,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        })

        gsap.to(label, {
          opacity: isView ? 1 : 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      const onPointerMove = (event: PointerEvent): void => {
        dotX(event.clientX)
        dotY(event.clientY)
        ringX(event.clientX)
        ringY(event.clientY)
      }

      const onPointerOver = (event: PointerEvent): void => {
        const target = event.target
        if (!(target instanceof Element)) return

        if (target.closest('[data-cursor="view"]')) {
          setState('view')
          return
        }

        if (target.closest('a, button, [data-cursor="link"], input, select, textarea')) {
          setState('link')
          return
        }

        setState('idle')
      }

      const onPointerDown = (): void => {
        gsap.to(ring, { scale: 0.86, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
      }

      const onPointerUp = (): void => {
        gsap.to(ring, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
      }

      const onLeave = (): void => {
        gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
      }

      const onEnter = (): void => {
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerover', onPointerOver, { passive: true })
      window.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointerup', onPointerUp)
      document.addEventListener('mouseleave', onLeave)
      document.addEventListener('mouseenter', onEnter)

      return () => {
        document.documentElement.classList.remove('has-custom-cursor')
        window.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerover', onPointerOver)
        window.removeEventListener('pointerdown', onPointerDown)
        window.removeEventListener('pointerup', onPointerUp)
        document.removeEventListener('mouseleave', onLeave)
        document.removeEventListener('mouseenter', onEnter)
      }
    },
    { dependencies: [enabled] },
  )

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label">
          View
        </span>
      </div>
    </>
  )
}
