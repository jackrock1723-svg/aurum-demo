export interface NavLink {
  readonly label: string
  readonly href: string
}

export interface MenuCourse {
  readonly id: string
  readonly numeral: string
  readonly name: string
  readonly description: string
  readonly price: string
  readonly pairing: string
  readonly image: string
  readonly alt: string
}

export interface Testimonial {
  readonly id: string
  readonly quote: string
  readonly name: string
  readonly title: string
  /** 1–5 */
  readonly rating: number
}

export type GallerySpan = 'tall' | 'wide' | 'square'

export interface GalleryItem {
  readonly id: string
  readonly src: string
  readonly alt: string
  readonly caption: string
  readonly span: GallerySpan
}

export interface CounterStat {
  readonly id: string
  readonly value: number
  readonly suffix: string
  readonly label: string
  readonly detail: string
}

export type Occasion = 'Dinner' | 'Anniversary' | 'Birthday' | 'Business' | 'Celebration'

export interface ReservationValues {
  readonly name: string
  readonly phone: string
  readonly date: string
  readonly time: string
  readonly guests: string
  readonly occasion: string
  readonly notes: string
}

export interface SocialLink {
  readonly label: string
  readonly href: string
}
