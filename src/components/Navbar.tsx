import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import MagneticButton from '@/components/MagneticButton'
import { NAV_LINKS } from '@/data/nav'
import { scrollToSection } from '@/hooks/useLenis'

gsap.registerPlugin(ScrollTrigger)

interface NavbarProps {
  readonly onOpenMenu: () => void
  readonly menuOpen: boolean
  readonly ready: boolean
}

export default function Navbar({ onOpenMenu, menuOpen, ready }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 40)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useGSAP(
    () => {
      if (!ready) return

      gsap.fromTo(
        headerRef.current,
        { yPercent: -120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.35 },
      )

      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
          },
        )
      }
    },
    { dependencies: [ready] },
  )

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, href: string): void => {
    event.preventDefault()
    scrollToSection(href)
  }

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-70 transition-[background-color,backdrop-filter,border-color,opacity] duration-700 ${
        menuOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
      } ${
        scrolled
          ? 'border-b border-gold/12 bg-ink/75 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[74px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-[86px] lg:px-14">
        <a
          href="#home"
          onClick={(event) => handleNavigate(event, '#home')}
          className="group flex items-baseline gap-3"
          aria-label="AURUM — home"
        >
          <span className="font-display text-xl leading-none font-normal tracking-[0.34em] text-ivory transition-colors duration-500 group-hover:text-champagne sm:text-2xl">
            AURUM
          </span>
          <span className="hidden text-[0.5rem] tracking-[0.32em] text-gold/70 sm:inline">★★★</span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => handleNavigate(event, link.href)}
                  className="group relative inline-block py-2 text-[0.65rem] tracking-[0.28em] text-ivory/65 uppercase transition-colors duration-500 hover:text-ivory"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-luxe group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 sm:gap-7">
          <a
            href="tel:+442079460300"
            className="hidden text-[0.65rem] tracking-[0.22em] text-ivory/50 transition-colors duration-500 hover:text-gold xl:inline"
          >
            +44 20 7946 0300
          </a>

          <div className="hidden sm:block">
            <MagneticButton
              href="#reservation"
              onClick={() => scrollToSection('#reservation')}
              variant="outline"
              className="px-6 py-3 text-[0.58rem]"
            >
              Reserve
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="group flex items-center gap-3 text-ivory/80 transition-colors duration-500 hover:text-gold lg:hidden"
          >
            <span className="hidden text-[0.6rem] tracking-[0.3em] uppercase sm:inline">Menu</span>
            <Menu className="h-5 w-5" strokeWidth={1} aria-hidden="true" />
          </button>
        </div>
      </div>

      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-gold/60 via-champagne to-gold/60"
      />
    </header>
  )
}
