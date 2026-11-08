import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import SectionTitle from '@/components/SectionTitle'

const HOURS = [
  { days: 'Tuesday — Thursday', time: '18:00 — 23:00' },
  { days: 'Friday — Saturday', time: '18:00 — 23:30' },
  { days: 'Sunday — Monday', time: 'Closed' },
] as const

const MAP_QUERY = 'Berkeley Square, Mayfair, London W1J 6BR'

export default function Location() {
  return (
    <section
      id="location"
      className="relative overflow-hidden border-t border-white/[0.06] bg-charcoal/30 py-24 sm:py-32 lg:py-40"
      aria-labelledby="location-title"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-14 xl:gap-16">
        <div className="lg:col-span-5">
          <SectionTitle
            index="08"
            label="Visit"
            title="Find the gold room."
            description="A black door on the east side of the square, without a sign. Ring the bell and give your name."
            titleClassName="max-w-sm"
          />

          <div className="mt-12 space-y-8 border-t border-white/8 pt-10">
            <div className="flex items-start gap-4">
              <MapPin
                className="mt-1 h-4 w-4 shrink-0 text-gold/70"
                strokeWidth={1}
                aria-hidden="true"
              />
              <div>
                <p className="label text-ivory/48">Address</p>
                <address className="mt-2 font-display text-xl leading-snug text-ivory not-italic">
                  12 Berkeley Square
                  <br />
                  Mayfair, London W1J 6BR
                </address>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(MAP_QUERY)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group mt-3 inline-flex items-center gap-2 text-[0.55rem] tracking-[0.24em] text-gold uppercase transition-colors duration-500 hover:text-champagne"
                >
                  Get directions
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone
                className="mt-1 h-4 w-4 shrink-0 text-gold/70"
                strokeWidth={1}
                aria-hidden="true"
              />
              <div>
                <p className="label text-ivory/48">Reservations</p>
                <a
                  href="tel:+442079460300"
                  className="mt-2 block font-display text-xl text-ivory transition-colors duration-500 hover:text-gold"
                >
                  +44 20 7946 0300
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail
                className="mt-1 h-4 w-4 shrink-0 text-gold/70"
                strokeWidth={1}
                aria-hidden="true"
              />
              <div>
                <p className="label text-ivory/48">Private dining</p>
                <a
                  href="mailto:salon@aurum.restaurant"
                  className="mt-2 block font-display text-xl text-ivory transition-colors duration-500 hover:text-gold"
                >
                  salon@aurum.restaurant
                </a>
              </div>
            </div>

            <dl className="border-t border-white/8 pt-8">
              {HOURS.map((row) => (
                <div
                  key={row.days}
                  className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-3 last:border-b-0"
                >
                  <dt className="text-[0.58rem] tracking-[0.22em] text-ivory/45 uppercase">
                    {row.days}
                  </dt>
                  <dd
                    className={`text-[0.65rem] tracking-[0.18em] uppercase ${
                      row.time === 'Closed' ? 'text-ivory/40' : 'text-champagne/85'
                    }`}
                  >
                    {row.time}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-[0.55rem] leading-relaxed tracking-[0.18em] text-ivory/40 uppercase">
              Valet from 18:00 · Green Park, four minutes on foot · Jacket preferred
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative h-[360px] w-full overflow-hidden border border-white/8 bg-ink sm:h-[460px] lg:h-full lg:min-h-[560px]">
            <iframe
              title="Map showing AURUM at 12 Berkeley Square, Mayfair, London"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`}
              className="h-full w-full border-0 brightness-[0.8] contrast-[0.92] grayscale invert-[0.92]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 ring-1 ring-gold/20 ring-inset"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(7,7,7,0.55)_100%)]"
            />
            <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-3 bg-ink/80 px-4 py-3 backdrop-blur-sm">
              <span className="text-[0.6rem] text-gold" aria-hidden="true">
                ✦
              </span>
              <span className="text-[0.55rem] tracking-[0.26em] text-ivory/70 uppercase">
                AURUM · Berkeley Square
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
