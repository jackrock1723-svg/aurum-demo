import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useState } from 'react'
import Cursor from '@/components/Cursor'
import Marquee from '@/components/Marquee'
import MobileMenu from '@/components/MobileMenu'
import Navbar from '@/components/Navbar'
import Preloader from '@/components/Preloader'
import { getLenis, useLenis } from '@/hooks/useLenis'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Chef from '@/sections/Chef'
import Counters from '@/sections/Counters'
import Footer from '@/sections/Footer'
import Gallery from '@/sections/Gallery'
import Hero from '@/sections/Hero'
import Location from '@/sections/Location'
import Philosophy from '@/sections/Philosophy'
import Reservation from '@/sections/Reservation'
import TastingMenu from '@/sections/TastingMenu'
import Testimonials from '@/sections/Testimonials'

gsap.registerPlugin(ScrollTrigger)

const MARQUEE_ITEMS = ['Michelin ★', 'Tasting Menu', 'Since 2009'] as const

export default function App() {
  const reduced = useReducedMotion()
  const [loading, setLoading] = useState(!reduced)
  const [ready, setReady] = useState(reduced)
  const [menuOpen, setMenuOpen] = useState(false)

  useLenis(!loading && !reduced)

  // Hold the page still while the curtain is down.
  useEffect(() => {
    if (!loading) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [loading])

  // Lock the page behind the mobile menu.
  useEffect(() => {
    const lenis = getLenis()

    if (menuOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Keep pinned measurements honest once images and fonts settle.
  useEffect(() => {
    const refresh = (): void => ScrollTrigger.refresh()
    const timer = window.setTimeout(refresh, 1200)

    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => undefined)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', refresh)
    }
  }, [])

  const handlePreloaderComplete = (): void => {
    setLoading(false)
    setReady(true)
    ScrollTrigger.refresh()
  }

  return (
    <div className="relative bg-ink">
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Cursor />

      <a
        href="#philosophy"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-300 focus:bg-gold focus:px-5 focus:py-3 focus:text-[0.6rem] focus:tracking-[0.28em] focus:text-ink focus:uppercase"
      >
        Skip to content
      </a>

      <Navbar onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} ready={ready} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main id="main">
        <Hero ready={ready} />
        <Marquee items={MARQUEE_ITEMS} />
        <Philosophy />
        <Chef />
        <TastingMenu />
        <Counters />
        <Gallery />
        <Testimonials />
        <Reservation />
        <Location />
      </main>

      <Footer />

      {loading && <Preloader onComplete={handlePreloaderComplete} />}
    </div>
  )
}
