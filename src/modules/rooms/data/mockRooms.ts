import type { Room } from '../types'

const mockRooms: Room[] = [
  {
    id: 'garden-room',
    name: 'The Garden Room',
    description: 'A calm retreat with a private terrace and leafy views.',
    pricePerNight: 189,
    amenities: ['King bed', 'Garden terrace', 'Rain shower'],
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Quiet hotel room with a neatly made bed and warm natural light',
  },
  {
    id: 'city-suite',
    name: 'The City Suite',
    description: 'A considered hideaway above the rhythm of the city.',
    pricePerNight: 245,
    amenities: ['King bed', 'City views', 'Separate lounge'],
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Contemporary hotel suite with a spacious, softly lit interior',
  },
  {
    id: 'corner-room',
    name: 'The Corner Room',
    description: 'An airy corner stay, made for slow mornings and long views.',
    pricePerNight: 215,
    amenities: ['Queen bed', 'Corner windows', 'Soaking tub'],
    image:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Elegant guest room with a large bed and understated decor',
  },
  {
    id: 'signature-suite',
    name: 'The Signature Suite',
    description: 'Our most generous space, with room to truly settle in.',
    pricePerNight: 320,
    amenities: ['King bed', 'Private balcony', 'In-room dining'],
    image:
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Refined suite with a comfortable bed and warm wood details',
  },
]

export function getMockRooms(): Room[] {
  return mockRooms
}
