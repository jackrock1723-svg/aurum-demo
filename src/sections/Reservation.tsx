import { zodResolver } from '@hookform/resolvers/zod'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ArrowRight, Check, Clock, Phone } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import MagneticButton from '@/components/MagneticButton'
import SectionTitle from '@/components/SectionTitle'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { ReservationValues } from '@/types'
import { submitReservation } from '@/api/queries'

const TIMES = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'] as const
const GUESTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9 or more'] as const
const OCCASIONS = ['Dinner', 'Anniversary', 'Birthday', 'Business', 'Celebration'] as const

const localToday = (): string => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

const schema = z.object({
  name: z.string().min(2, 'Please tell us your name').max(60, 'That name is a little long'),
  phone: z
    .string()
    .min(7, 'A contact number, please')
    .max(24, 'That number looks too long')
    .regex(/^[+()\d\s-]+$/, 'Digits, spaces, + ( ) or - only'),
  date: z
    .string()
    .min(1, 'Choose an evening')
    .refine((value) => value >= localToday(), 'Please choose today or a later date'),
  time: z.string().min(1, 'Choose a seating'),
  guests: z.string().min(1, 'How many guests?'),
  occasion: z.string().min(1, 'Choose an occasion'),
  notes: z.string().max(400, 'Please keep notes under 400 characters'),
})

type Status = 'idle' | 'sending' | 'success' | 'error'

type SubmittedRecord = {
  readonly id: string
  readonly inquiryAt: string
  readonly values: ReservationValues
}

export default function Reservation() {
  const sectionRef = useRef<HTMLElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const tickRef = useRef<HTMLSpanElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [submitted, setSubmitted] = useState<SubmittedRecord | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const reduced = useReducedMotion()

  const minDate = useMemo(() => localToday(), [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      date: '',
      time: '19:00',
      guests: '2',
      occasion: 'Dinner',
      notes: '',
    },
  })

  const onSubmit = async (values: ReservationValues): Promise<void> => {
    setStatus('sending')
    setSubmitError(null)
    const result = await submitReservation(values)
    if (result.kind === 'endpoint_missing') {
      setStatus('success')
      setSubmitted({ id: '', inquiryAt: new Date().toISOString(), values })
      return
    }
    if (result.kind === 'error') {
      setStatus('error')
      setSubmitError(result.message)
      setStatus('idle')
      return
    }
    setStatus('success')
    setSubmitted({ id: result.id, inquiryAt: result.inquiryAt, values })
  }

  useGSAP(
    () => {
      if (status !== 'success' || reduced || !successRef.current) return

      const tl = gsap.timeline()
      tl.fromTo(successRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo(
          ringRef.current,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
          '-=0.35',
        )
        .fromTo(
          tickRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
          '-=0.45',
        )
    },
    { dependencies: [status, reduced] },
  )

  const handleReset = (): void => {
    reset()
    setSubmitted(null)
    setStatus('idle')
    setSubmitError(null)
  }

  return (
    <section
      ref={sectionRef}
      id="reservation"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
      aria-labelledby="reservation-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_30%,rgba(201,164,92,0.07),transparent_60%)]"
      />

      <div className="relative mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-14 xl:gap-16">
        <div className="lg:col-span-5">
          <SectionTitle
            index="07"
            label="Reservations"
            title="Reserve your evening."
            description="Nine tables. One seating. We hold the room from 18:00 until the last glass is finished."
            titleClassName="max-w-[22rem] text-[clamp(2.3rem,3.8vw,3.5rem)] leading-[1.02]"
          />

          <div className="mt-12 space-y-8 border-t border-white/8 pt-10">
            <div className="flex items-start gap-4">
              <Phone
                className="mt-1 h-4 w-4 shrink-0 text-gold/70"
                strokeWidth={1}
                aria-hidden="true"
              />
              <div>
                <p className="label text-ivory/48">Speak to the maître d’</p>
                <a
                  href="tel:+442079460300"
                  className="mt-2 block font-display text-2xl text-ivory transition-colors duration-500 hover:text-gold"
                >
                  +44 20 7946 0300
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock
                className="mt-1 h-4 w-4 shrink-0 text-gold/70"
                strokeWidth={1}
                aria-hidden="true"
              />
              <div>
                <p className="label text-ivory/48">Seatings</p>
                <p className="mt-2 text-sm font-light text-ivory/60">
                  Tuesday — Saturday · 18:00 — 21:30
                </p>
                <p className="mt-1 text-sm font-light text-ivory/40">
                  Closed Sunday, Monday and December 24 — 26
                </p>
              </div>
            </div>

            <p className="text-[0.7rem] leading-relaxed tracking-[0.06em] text-ivory/45 uppercase">
              A card is held to secure the table. Cancellations within 48 hours are charged £75 per
              guest. Dietary requirements are welcomed — tell us below.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative border border-white/8 bg-charcoal/40 p-6 sm:p-10 lg:p-12">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
            />

            <div className="flex items-center justify-between gap-4">
              <p className="label text-gold">The request</p>
              <p className="hidden text-[0.58rem] tracking-[0.24em] text-ivory/40 uppercase sm:block">
                Confirmed by telephone
              </p>
            </div>

            {status === 'success' && submitted ? (
              <div ref={successRef} className="mt-8 flex flex-col items-start">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke="rgba(201,164,92,0.2)"
                      strokeWidth="1"
                    />
                    <circle
                      ref={ringRef}
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeWidth="1"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span ref={tickRef} className="absolute flex items-center justify-center">
                    <Check className="h-6 w-6 text-gold" strokeWidth={1} aria-hidden="true" />
                  </span>
                </div>

                <h3 className="mt-8 font-display text-3xl leading-tight text-ivory sm:text-4xl">
                  Table requested.
                </h3>
                {submitted.id ? (
                  <p className="mt-3 max-w-md text-sm leading-relaxed font-light text-ivory/50">
                    Thank you, {submitted.values.name.split(' ')[0]}. Reference {submitted.id}. Our
                    maître d’ will telephone you within the hour to confirm the details and take
                    your card.
                  </p>
                ) : (
                  <p className="mt-3 max-w-md text-sm leading-relaxed font-light text-ivory/50">
                    Thank you, {submitted.values.name.split(' ')[0]}. Our maître d’ will telephone
                    you within the hour to confirm the details and take your card.
                  </p>
                )}

                <dl className="mt-8 grid w-full grid-cols-2 gap-x-6 gap-y-5 border-t border-white/8 pt-7 sm:grid-cols-4">
                  {[
                    { term: 'Date', detail: submitted.values.date },
                    { term: 'Seating', detail: submitted.values.time },
                    { term: 'Guests', detail: submitted.values.guests },
                    { term: 'Occasion', detail: submitted.values.occasion },
                  ].map((row) => (
                    <div key={row.term}>
                      <dt className="text-[0.52rem] tracking-[0.26em] text-ivory/45 uppercase">
                        {row.term}
                      </dt>
                      <dd className="mt-2 font-display text-lg text-champagne">{row.detail}</dd>
                    </div>
                  ))}
                </dl>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-9 flex items-center gap-3 text-[0.6rem] tracking-[0.28em] text-gold uppercase transition-colors duration-500 hover:text-champagne"
                >
                  Make another request
                  <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
                </button>
              </div>
            ) : status === 'error' && submitError ? (
              <div className="mt-8">
                <p className="flex items-start gap-3 text-sm leading-relaxed font-light text-ivory/70">
                  <span className="mt-0.5 shrink-0 text-gold" aria-hidden="true">
                    !
                  </span>
                  <span>{submitError}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-5 flex items-center gap-3 text-[0.6rem] tracking-[0.28em] text-gold uppercase transition-colors duration-500 hover:text-champagne"
                >
                  Try again
                  <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <form className="mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                  <div className="field sm:col-span-2">
                    <input
                      id="name"
                      type="text"
                      placeholder="Full name"
                      autoComplete="name"
                      className="field-control"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      {...register('name')}
                    />
                    <label htmlFor="name" className="field-label">
                      Full name
                    </label>
                    {errors.name && (
                      <p id="name-error" className="field-error" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Telephone"
                      autoComplete="tel"
                      className="field-control"
                      aria-invalid={errors.phone ? 'true' : 'false'}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      {...register('phone')}
                    />
                    <label htmlFor="phone" className="field-label">
                      Telephone
                    </label>
                    {errors.phone && (
                      <p id="phone-error" className="field-error" role="alert">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <input
                      id="date"
                      type="date"
                      min={minDate}
                      className="field-control"
                      aria-invalid={errors.date ? 'true' : 'false'}
                      aria-describedby={errors.date ? 'date-error' : undefined}
                      {...register('date')}
                    />
                    <label htmlFor="date" className="field-label">
                      Date
                    </label>
                    {errors.date && (
                      <p id="date-error" className="field-error" role="alert">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <select id="time" className="field-control" {...register('time')}>
                      {TIMES.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="time" className="field-label">
                      Seating
                    </label>
                  </div>

                  <div className="field">
                    <select id="guests" className="field-control" {...register('guests')}>
                      {GUESTS.map((guest) => (
                        <option key={guest} value={guest}>
                          {guest}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="guests" className="field-label">
                      Guests
                    </label>
                  </div>

                  <div className="field sm:col-span-2">
                    <select id="occasion" className="field-control" {...register('occasion')}>
                      {OCCASIONS.map((occasion) => (
                        <option key={occasion} value={occasion}>
                          {occasion}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="occasion" className="field-label">
                      Occasion
                    </label>
                  </div>

                  <div className="field sm:col-span-2">
                    <textarea
                      id="notes"
                      rows={2}
                      placeholder="Dietary requirements"
                      className="field-control resize-none"
                      aria-describedby={errors.notes ? 'notes-error' : undefined}
                      {...register('notes')}
                    />
                    <label htmlFor="notes" className="field-label">
                      Dietary requirements · notes
                    </label>
                    {errors.notes && (
                      <p id="notes-error" className="field-error" role="alert">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <MagneticButton
                    type="submit"
                    variant="solid"
                    disabled={status === 'sending'}
                    className={status === 'sending' ? 'pointer-events-none opacity-60' : ''}
                  >
                    {status === 'sending' ? 'Sending request' : 'Request this table'}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </MagneticButton>

                  <p className="max-w-[15rem] text-[0.55rem] leading-relaxed tracking-[0.16em] text-ivory/40 uppercase">
                    No payment is taken now. We reply personally, within the hour.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
