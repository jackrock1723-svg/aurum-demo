import type { MenuCourse } from '@/types'

const unsplash = (id: string, width = 1200): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${Math.round(
    width * 1.25,
  )}&q=80`

export const courses: readonly MenuCourse[] = [
  {
    id: 'bluefin',
    numeral: 'I',
    name: 'Bluefin Toro',
    description:
      'Hand-cut belly, aged soy caramel, frozen wasabi snow. Served on black slate at four degrees.',
    price: '£48',
    pairing: 'Krug Grande Cuvée',
    image: unsplash('1615361200141-f45040f367be'),
    alt: 'A single piece of toro nigiri lifted by chopsticks against a black background',
  },
  {
    id: 'langoustine',
    numeral: 'II',
    name: 'Langoustine',
    description:
      'Scottish langoustine, brown butter, sea buckthorn, a veil of gold leaf and shellfish bisque.',
    price: '£56',
    pairing: 'Chablis Grand Cru, Les Clos',
    image: unsplash('1467003909585-2f8a72700288'),
    alt: 'A delicate plated langoustine course with vegetable garnish on dark ceramic',
  },
  {
    id: 'turbot',
    numeral: 'III',
    name: 'Line-Caught Turbot',
    description:
      'Roasted on the bone, champagne beurre blanc, caviar, sea herbs gathered at dawn in Cornwall.',
    price: '£62',
    pairing: 'Puligny-Montrachet 1er Cru',
    image: unsplash('1519708227418-c8fd9a32b7a2'),
    alt: 'A fillet of turbot plated with greens on a black plate',
  },
  {
    id: 'wagyu',
    numeral: 'IV',
    name: 'Aged Wagyu',
    description:
      'Sixty-day aged A5, charcoal embers, bone marrow jus, smoked potato and black garlic.',
    price: '£88',
    pairing: 'Château Margaux 2010',
    image: unsplash('1600891964092-4316c288032e'),
    alt: 'Sliced aged wagyu steak with charred edges on a dark plate',
  },
  {
    id: 'pigeon',
    numeral: 'V',
    name: 'Bresse Pigeon',
    description:
      'Lacquered in honey and juniper, beetroot cooked in salt, pickled elderberry and foie gras.',
    price: '£74',
    pairing: 'Échezeaux Grand Cru',
    image: unsplash('1504674900247-0877df9cc836'),
    alt: 'A dark plated meat course with seasonal garnish photographed from above',
  },
  {
    id: 'souffle',
    numeral: 'VI',
    name: 'Valrhona Soufflé',
    description:
      'Warm Guanaja chocolate, salted caramel poured at the table, toasted buckwheat ice cream.',
    price: '£32',
    pairing: 'Château d’Yquem 2009',
    image: unsplash('1551024506-0bccd828d307'),
    alt: 'A warm chocolate dessert with caramel poured over it on a black background',
  },
]

export const menuNote =
  'Seventeen courses. Two hundred and forty minutes. The menu changes with the tide, the market and the season — this is an excerpt from tonight.'
