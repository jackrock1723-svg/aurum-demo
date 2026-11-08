import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ArrowUpRight, X } from 'lucide-react'
import { useRef } from 'react'
import { NAV_LINKS } from '@/data/nav'
import { scrollToSection } from '@/hooks/useLenis'

interface MobileMenuProps {
  readonly open: boolean
  readonly onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const q = gsap.utils.selector(root)
      const panel = q('.menu-panel')
      const links = q('.menu-item')
      const meta = q('.menu-meta')
      const firstRun = !mountedRef.current
      mountedRef.current = true

      if (open) {
        gsap.set(root, { pointerEvents: 'auto' })
        const tl = gsap.timeline()
        tl.set(panel, { yPercent: -100 })
          .to(panel, { yPercent: 0, duration: 0.95, ease: 'power4.inOut' })
          .fromTo(
            links,
            { yPercent: 130, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.055, ease: 'power3.out' },
            '-=0.5',
          )
          .fromTo(
            meta,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 },
            '-=0.45',
          )
      } else if (firstRun) {
        // Park the panel offscreen without animating on first paint.
        gsap.set(panel, { yPercent: -100 })
        gsap.set(links, { yPercent: 130, opacity: 0 })
        gsap.set(root, { pointerEvents: 'none' })
      } else {
        const tl = gsap.timeline({ onComplete: () => gsap.set(root, { pointerEvents: 'none' }) })
        tl.to(links, {
          yPercent: 120,
          opacity: 0,
          duration: 0.35,
          stagger: 0.025,
          ease: 'power2.in',
        }).to(panel, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.15')
      }
    },
    { scope: rootRef, dependencies: [open] },
  )

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, href: string): void => {
    event.preventDefault()
    onClose()
    window.setTimeout(() => scrollToSection(href), 420)
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-80 lg:hidden"
      aria-hidden={!open}
    >
      <div className="menu-panel absolute inset-0 flex flex-col bg-ink">
        <div aria-hidden="true" className="grain opacity-[0.05]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(201,164,92,0.13),transparent_60%)]"
        />

        <div className="relative flex h-[74px] shrink-0 items-center justify-between px-5 sm:px-8">
          <span className="font-display text-xl tracking-[0.34em] text-champagne">AURUM</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-ivory/80 transition-colors duration-500 hover:border-gold/60 hover:text-gold"
          >
            <X className="h-5 w-5" strokeWidth={1} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="relative flex flex-1 flex-col justify-center px-5 sm:px-8"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} className="overflow-hidden border-b border-white/[0.06]">
                <a
                  href={link.href}
                  onClick={(event) => handleNavigate(event, link.href)}
                  className="menu-item group flex items-baseline justify-between gap-6 py-5"
                  tabIndex={open ? 0 : -1}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-[0.55rem] tracking-[0.3em] text-gold/60">
                      0{index + 1}
                    </span>
                    <span className="font-display text-[clamp(2.1rem,9vw,3.2rem)] leading-none font-light text-ivory transition-colors duration-500 group-hover:text-champagne">
                      {link.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-gold/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#reservation"
            onClick={(event) => handleNavigate(event, '#reservation')}
            className="menu-meta mt-10 flex items-center justify-center gap-3 border border-gold/35 px-6 py-4 text-[0.6rem] tracking-[0.32em] text-ivory uppercase transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink"
            tabIndex={open ? 0 : -1}
          >
            Reserve a table
          </a>
        </nav>

        <div className="relative flex shrink-0 flex-col gap-3 border-t border-white/[0.06] px-5 py-7 sm:px-8">
          <div className="menu-meta flex items-center justify-between text-[0.6rem] tracking-[0.22em] text-ivory/60 uppercase">
            <a href="tel:+442079460300" className="transition-colors hover:text-gold">
              +44 20 7946 0300
            </a>
            <span>Tue — Sat · 18:00</span>
          </div>
          <p className="menu-meta text-[0.55rem] tracking-[0.28em] text-gold/50 uppercase">
            12 Berkeley Square · Mayfair · London
          </p>
        </div>
      </div>
    </div>
  )
}
