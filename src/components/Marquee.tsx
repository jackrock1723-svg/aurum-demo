interface MarqueeProps {
  readonly items: readonly string[]
  readonly reverse?: boolean
  readonly className?: string
  readonly label?: string
}

export default function Marquee({
  items,
  reverse = false,
  className = '',
  label = 'AURUM — Michelin tasting menu, Mayfair London',
}: MarqueeProps) {
  return (
    <div
      className={`marquee relative overflow-hidden border-y border-gold/12 bg-ink py-5 select-none sm:py-6 ${className}`}
      role="group"
      aria-label={label}
    >
      <div aria-hidden="true" className="marquee-track" data-reverse={reverse ? 'true' : 'false'}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item, index) => (
              <span
                key={`${copy}-${index}`}
                className="flex shrink-0 items-center gap-8 px-8 sm:gap-10 sm:px-10"
              >
                <span className="label whitespace-nowrap text-ivory/60">{item}</span>
                <span className="text-[0.55rem] text-gold/55" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent sm:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent sm:w-40"
      />
    </div>
  )
}
