import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import SectionTitle from '@/components/SectionTitle'
import { galleryItems } from '@/data/gallery'
import { getLenis } from '@/hooks/useLenis'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { GalleryItem, GallerySpan } from '@/types'

gsap.registerPlugin(ScrollTrigger)

const ASPECT: Record<GallerySpan, string> = {
  tall: 'aspect-[3/4]',
  wide: 'aspect-[4/3]',
  square: 'aspect-square',
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const isOpen = active !== null
  const activeItem: GalleryItem | undefined = active === null ? undefined : galleryItems[active]

  const close = useCallback(() => setActive(null), [])

  const step = useCallback((direction: 1 | -1) => {
    setActive((current) => {
      if (current === null) return current
      const next = (current + direction + galleryItems.length) % galleryItems.length
      return next
    })
  }, [])

  useGSAP(
    () => {
      if (reduced) return

      const items = gsap.utils.toArray<HTMLElement>('.gal-item')

      items.forEach((item) => {
        const image = item.querySelector('img')
        if (!image) return

        gsap.fromTo(
          image,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      gsap.from(items, {
        y: 50,
        duration: 1.1,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  useGSAP(
    () => {
      if (!isOpen || !overlayRef.current) return

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' },
      )
      gsap.fromTo(
        overlayRef.current.querySelector('.lb-figure'),
        { opacity: 0, scale: 0.95, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power3.out' },
      )
    },
    { dependencies: [isOpen, active] },
  )

  useEffect(() => {
    if (!isOpen) return

    const lenis = getLenis()
    lenis?.stop()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      lenis?.start()
    }
  }, [isOpen, close, step])

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
      aria-labelledby="gallery-title"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionTitle
            index="05"
            label="The Gallery"
            title="Evenings, kept."
            description="Photographed between courses, without a flash. What the room looks like when nobody is asking it to."
            titleClassName="max-w-xl"
          />

          <p className="label hidden text-ivory/45 lg:block">Mayfair · 2019 — 2026</p>
        </div>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 sm:gap-5 lg:mt-20 lg:columns-3 lg:gap-6">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              data-cursor="view"
              className="gal-item group mb-4 block w-full break-inside-avoid text-left sm:mb-5 lg:mb-6"
              aria-label={`View image: ${item.caption}`}
            >
              <div className={`relative w-full overflow-hidden bg-charcoal ${ASPECT[item.span]}`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="cinema-img h-[116%] w-full scale-105 object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.09]"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-95"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 ring-1 ring-white/8 transition-all duration-700 ring-inset group-hover:ring-gold/40"
                />
                <span className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-ink/40 text-gold opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                  <Plus className="h-4 w-4" strokeWidth={1} aria-hidden="true" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span className="text-[0.58rem] tracking-[0.26em] text-ivory/45 uppercase transition-colors duration-500 group-hover:text-gold">
                  {item.caption}
                </span>
                <span className="text-[0.55rem] tracking-[0.2em] text-ivory/20">0{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && activeItem && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-150 flex flex-col bg-ink/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image: ${activeItem.caption}`}
        >
          <div className="flex items-center justify-between px-5 py-5 sm:px-8">
            <span className="label text-ivory/40">
              {(active ?? 0) + 1} / {galleryItems.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close image"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-ivory/70 transition-colors duration-500 hover:border-gold/70 hover:text-gold"
            >
              <X className="h-5 w-5" strokeWidth={1} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-4 sm:px-10">
            <figure className="lb-figure flex max-h-full w-full max-w-5xl flex-col items-center">
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-6 text-center">
                <p className="font-display text-xl text-champagne">{activeItem.caption}</p>
                <p className="mt-1 text-[0.55rem] tracking-[0.28em] text-ivory/48 uppercase">
                  AURUM · Mayfair
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="flex items-center justify-center gap-8 pb-8">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-ivory/70 transition-colors duration-500 hover:border-gold/60 hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1} aria-hidden="true" />
            </button>
            <span className="h-px w-16 bg-gold/30" aria-hidden="true" />
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-ivory/70 transition-colors duration-500 hover:border-gold/60 hover:text-gold"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
