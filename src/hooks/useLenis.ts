import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

/** Access the live Lenis instance from anywhere (nav links, lightbox, menu). */
export function getLenis(): Lenis | null {
  return lenisInstance
}

export function scrollToSection(target: string): void {
  const lenis = getLenis()

  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.6 })
    return
  }

  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function scrollToTop(): void {
  const lenis = getLenis()

  if (lenis) {
    lenis.scrollTo(0, { duration: 1.8 })
    return
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Boots Lenis and drives it from the GSAP ticker so ScrollTrigger and the
 * smooth scroll stay on the same frame. Disabled for reduced motion, where
 * native scrolling is the kinder default.
 */
export function useLenis(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      syncTouch: false,
      autoRaf: false,
    })

    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number): void => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const onRefresh = (): void => {
      lenis.resize()
    }
    ScrollTrigger.addEventListener('refresh', onRefresh)

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}
