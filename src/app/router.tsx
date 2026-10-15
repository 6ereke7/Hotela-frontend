import { useState } from 'react'
import { StaffLoginPage, type StaffUser } from '../modules/auth'
import { BookingCheckoutScreen } from '../modules/bookings'
import { buildBookingSummary } from '../modules/bookings/builders'
import { getMockRooms, HomePage } from '../modules/rooms'
import type { Room } from '../modules/rooms'
import { ManagerDashboard, ReceptionistDashboard } from '../modules/staff'
import { RoutePlaceholder } from './RoutePlaceholder'
import { useRouter } from '../hooks/useRouter'

const routes = {
  '/': {
    section: 'Guest',
    title: 'Welcome to Hotela',
    description: 'Explore stays and start planning your next visit.',
  },
  '/catalog': {
    section: 'Guest',
    title: 'Catalog',
    description: 'Browse the available rooms and hotel experiences.',
  },
  '/booking': {
    section: 'Guest',
    title: 'Booking',
    description: 'Begin a booking and review your stay details.',
  },
  '/booking/checkout': {
    section: 'Guest',
    title: 'Booking checkout',
    description: 'Review booking details before completing checkout.',
  },
  '/staff/login': {
    section: 'Staff',
    title: 'Staff login',
    description: 'Sign in to access the staff workspace.',
  },
  '/staff/manager': {
    section: 'Staff dashboard',
    title: 'Manager dashboard',
    description: 'Manager tools and hotel overview will appear here.',
  },
  '/staff/receptionist': {
    section: 'Staff dashboard',
    title: 'Receptionist dashboard',
    description: 'Reception tools and guest activity will appear here.',
  },
} as const

type RoutePath = keyof typeof routes

function getRoutePath(pathname: string): RoutePath {
  return pathname in routes ? (pathname as RoutePath) : '/'
}

const DEFAULT_CHECK_IN_OFFSET_DAYS = 14
const DEFAULT_NIGHTS = 3

function resolveRoom(searchParams: URLSearchParams): Room {
  const rooms = getMockRooms()
  const selected = rooms.find((room) => room.id === searchParams.get('room'))
  return selected ?? rooms[0]
}

export function Router() {
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null)
  const { location, handleNavigation, navigateTo } = useRouter()

  const handleStaffLogin = (user: StaffUser) => {
    setStaffUser(user)
    navigateTo(user.role === 'manager' ? '/staff/manager' : '/staff/receptionist')
  }

  const handleStaffLogout = () => {
    setStaffUser(null)
    navigateTo('/staff/login')
  }

  const pathname = getRoutePath(location.pathname)
  const searchParams = new URLSearchParams(location.search)
  const room = resolveRoom(searchParams)
  const bookingSummary = buildBookingSummary(
    room,
    DEFAULT_CHECK_IN_OFFSET_DAYS,
    DEFAULT_NIGHTS,
  )

  return (
    <div className="app-shell" onClick={handleNavigation}>
      {pathname === '/' ? (
        <HomePage />
      ) : pathname === '/staff/login' ? (
        staffUser ? (
          staffUser.role === 'manager' ? (
            <ManagerDashboard staffName={staffUser.name} onLogout={handleStaffLogout} />
          ) : (
            <ReceptionistDashboard staffName={staffUser.name} onLogout={handleStaffLogout} />
          )
        ) : (
          <StaffLoginPage onLogin={handleStaffLogin} />
        )
      ) : pathname === '/staff/manager' || pathname === '/staff/receptionist' ? (
        !staffUser ? (
          <StaffLoginPage onLogin={handleStaffLogin} />
        ) : staffUser.role === 'manager' ? (
          <ManagerDashboard staffName={staffUser.name} onLogout={handleStaffLogout} />
        ) : (
          <ReceptionistDashboard staffName={staffUser.name} onLogout={handleStaffLogout} />
        )
      ) : pathname === '/booking' || pathname === '/booking/checkout' ? (
        <BookingCheckoutScreen room={room} summary={bookingSummary} />
      ) : (
        <RoutePlaceholder {...routes[pathname]} />
      )}
    </div>
  )
}
