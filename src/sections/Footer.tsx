import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { useRef, useState } from 'react'
import { NAV_LINKS } from '@/data/nav'
import { scrollToSection, scrollToTop } from '@/hooks/useLenis'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type SocialName = 'instagram' | 'facebook' | 'youtube'

const SOCIALS: readonly { label: string; href: string; glyph: SocialName }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/', glyph: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/', glyph: 'facebook' },
  { label: 'YouTube', href: 'https://www.youtube.com/', glyph: 'youtube' },
]

function SocialGlyph({ name }: { readonly name: SocialName }) {
  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1" />
        <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M15.2 5.5h-1.7c-2 0-3.3 1.3-3.3 3.4V11H7.9v3.1h2.3V21h3.2v-6.9h2.4l.4-3.1h-2.8V9.2c0-.6.3-.9.9-.9h1.9V5.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="3.6" stroke="currentColor" strokeWidth="1" />
      <path d="M10.6 9.7 15.4 12l-4.8 2.3V9.7Z" fill="currentColor" />
    </svg>
  )
}

type NewsletterState = 'idle' | 'error' | 'done'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<NewsletterState>('idle')
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !wordmarkRef.current) return

      gsap.fromTo(
        wordmarkRef.current,
        { yPercent: 22 },
        {
          yPercent: 0,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: wordmarkRef.current, start: 'top 95%', once: true },
        },
      )
    },
    { scope: footerRef, dependencies: [reduced] },
  )

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (!EMAIL_PATTERN.test(email.trim())) {
      setNewsletterState('error')
      return
    }

    setNewsletterState('done')
    setEmail('')
  }

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-gold/12 bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 pt-20 pb-10 sm:px-8 sm:pt-24 lg:px-14">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Newsletter */}
          <div className="lg:col-span-5">
            <p className="label text-gold">The Gold List</p>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05] font-light text-ivory">
              Letters from the cellar.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed font-light text-ivory/40">
              Six times a year: new menus, cellar releases, and the occasional table held back for
              the list. No noise.
            </p>

            <form className="mt-8 max-w-md" onSubmit={handleSubscribe} noValidate>
              <div className="field">
                <input
                  id="newsletter"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (newsletterState !== 'idle') setNewsletterState('idle')
                  }}
                  aria-invalid={newsletterState === 'error'}
                  aria-describedby={newsletterState === 'error' ? 'newsletter-error' : undefined}
                  className="field-control pr-14"
                  {...(newsletterState === 'error' ? { 'aria-live': 'polite' as const } : {})}
                />
                <label htmlFor="newsletter" className="field-label">
                  Email address
                </label>
                <button
                  type="submit"
                  aria-label="Subscribe to the Gold List"
                  className="absolute top-1/2 right-0 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-gold transition-transform duration-500 ease-luxe hover:translate-x-1"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.2} aria-hidden="true" />
                </button>
              </div>

              {newsletterState === 'error' && (
                <p id="newsletter-error" className="field-error" role="alert">
                  Please enter a valid email address
                </p>
              )}
              {newsletterState === 'done' && (
                <p className="mt-3 text-[0.6rem] tracking-[0.24em] text-champagne uppercase">
                  ✦ Welcome to the list
                </p>
              )}
            </form>
          </div>

          {/* Links */}
          <nav className="lg:col-span-3 lg:col-start-7" aria-label="Footer">
            <p className="label text-ivory/45">Explore</p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault()
                      scrollToSection(link.href)
                    }}
                    className="text-[0.8rem] font-light text-ivory/55 transition-colors duration-500 hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#reservation"
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection('#reservation')
                  }}
                  className="text-[0.8rem] font-light text-ivory/55 transition-colors duration-500 hover:text-gold"
                >
                  Reservations
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="label text-ivory/45">Visit</p>
            <address className="mt-5 text-[0.8rem] leading-relaxed font-light text-ivory/55 not-italic">
              12 Berkeley Square
              <br />
              Mayfair, London W1J 6BR
              <br />
              <a
                href="tel:+442079460300"
                className="mt-2 inline-block transition-colors duration-500 hover:text-gold"
              >
                +44 20 7946 0300
              </a>
            </address>

            <p className="label mt-7 text-ivory/45">Follow</p>
            <ul className="mt-4 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ivory/50 transition-all duration-500 hover:border-gold/60 hover:text-gold"
                  >
                    <SocialGlyph name={social.glyph} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Wordmark */}
        <div ref={wordmarkRef} className="mt-16 overflow-hidden sm:mt-20">
          <span
            aria-hidden="true"
            className="metallic block text-center font-display text-[clamp(4.2rem,19vw,17rem)] leading-[0.78] font-light tracking-[0.02em] select-none"
          >
            AURUM
          </span>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
          <p className="text-[0.55rem] tracking-[0.22em] text-ivory/40 uppercase">
            © {new Date().getFullYear()} AURUM Restaurant · All rights reserved
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              onClick={(event) => event.preventDefault()}
              className="text-[0.55rem] tracking-[0.22em] text-ivory/40 uppercase transition-colors duration-500 hover:text-gold"
            >
              Privacy
            </a>
            <a
              href="#terms"
              onClick={(event) => event.preventDefault()}
              className="text-[0.55rem] tracking-[0.22em] text-ivory/40 uppercase transition-colors duration-500 hover:text-gold"
            >
              Terms
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-gold/70 transition-all duration-500 hover:border-gold hover:text-gold"
            >
              <ArrowUp
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5"
                strokeWidth={1}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
