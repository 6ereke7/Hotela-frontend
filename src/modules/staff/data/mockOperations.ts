export type ManagedRoom = {
  id: string
  name: string
  category: string
  rate: number
  status: 'Available' | 'Occupied' | 'Needs service'
}

export type GuestBooking = {
  id: string
  guest: string
  room: string
  roomStatus: 'Ready' | 'Occupied' | 'Needs service'
  arrival: string
  departure: string
  bookingStatus: 'Arriving' | 'In house' | 'Departed'
}

export const initialManagedRooms: ManagedRoom[] = [
  { id: 'r-101', name: '101', category: 'The Garden Room', rate: 189, status: 'Available' },
  { id: 'r-204', name: '204', category: 'The City Suite', rate: 245, status: 'Occupied' },
  { id: 'r-308', name: '308', category: 'The Corner Room', rate: 215, status: 'Needs service' },
  { id: 'r-412', name: '412', category: 'The Signature Suite', rate: 320, status: 'Available' },
]

export const mockStaffMembers = [
  { name: 'Morgan Ellis', role: 'Hotel manager', initials: 'ME', status: 'On property' },
  { name: 'Riley James', role: 'Reception', initials: 'RJ', status: 'On property' },
  { name: 'Taylor Reed', role: 'Guest services', initials: 'TR', status: 'Off today' },
]

export const initialGuestBookings: GuestBooking[] = [
  {
    id: 'BK-24081',
    guest: 'Avery Parker',
    room: '204 · City Suite',
    roomStatus: 'Ready',
    arrival: 'Today, 2:00 PM',
    departure: 'Oct 16',
    bookingStatus: 'Arriving',
  },
  {
    id: 'BK-24076',
    guest: 'Jordan Lee',
    room: '101 · Garden Room',
    roomStatus: 'Ready',
    arrival: 'Today, 1:30 PM',
    departure: 'Oct 15',
    bookingStatus: 'Arriving',
  },
  {
    id: 'BK-24062',
    guest: 'Casey Morgan',
    room: '308 · Corner Room',
    roomStatus: 'Needs service',
    arrival: 'Oct 12',
    departure: 'Today, 11:00 AM',
    bookingStatus: 'In house',
  },
  {
    id: 'BK-24051',
    guest: 'Quinn Taylor',
    room: '412 · Signature Suite',
    roomStatus: 'Ready',
    arrival: 'Oct 10',
    departure: 'Today, 10:00 AM',
    bookingStatus: 'In house',
  },
]
