import type { GalleryItem } from '@/types'

const unsplash = (id: string, width = 1400, ratio = 1.4): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${Math.round(
    width * ratio,
  )}&q=80`

export const galleryItems: readonly GalleryItem[] = [
  {
    id: 'champagne',
    src: unsplash('1547595628-c61a29f496f0', 1000, 1.35),
    alt: 'Champagne poured into a crystal flute in low light',
    caption: 'The pour, 19:48',
    span: 'tall',
  },
  {
    id: 'dining-room',
    src: unsplash('1543007630-9710e4a00a20', 1600, 0.75),
    alt: 'The candlelit dining room at AURUM with dark timber and low brass light',
    caption: 'The dining room',
    span: 'wide',
  },
  {
    id: 'negroni',
    src: unsplash('1470337458703-46ad1756a187', 1000, 1),
    alt: 'An amber cocktail being strained into a glass at the bar',
    caption: 'Ambré, the bar',
    span: 'square',
  },
  {
    id: 'kitchen',
    src: unsplash('1577219491135-ce391730fb2c', 1000, 1.35),
    alt: 'A chef plating a course under warm brass heat lamps',
    caption: 'Pass, 20:12',
    span: 'tall',
  },
  {
    id: 'table',
    src: unsplash('1414235077428-338989a2e8c0', 1600, 0.72),
    alt: 'A plated first course on a linen table beside crystal wine glasses',
    caption: 'Table nine',
    span: 'wide',
  },
  {
    id: 'nigiri',
    src: unsplash('1615361200141-f45040f367be', 1000, 1),
    alt: 'A single nigiri resting on black stone',
    caption: 'Toro, course one',
    span: 'square',
  },
]
