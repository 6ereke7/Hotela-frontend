import type { StaffUser } from '../types'

type MockCredential = {
  email: string
  password: string
  user: StaffUser
}

const credentials: MockCredential[] = [
  {
    email: 'manager@hotel.com',
    password: 'welcome123',
    user: {
      name: 'Morgan Ellis',
      email: 'manager@hotel.com',
      role: 'manager',
    },
  },
  {
    email: 'receptionist@hotel.com',
    password: 'welcome123',
    user: {
      name: 'Riley James',
      email: 'receptionist@hotel.com',
      role: 'receptionist',
    },
  },
]

export function verifyMockStaffLogin(
  email: string,
  password: string,
): StaffUser | null {
  const credential = credentials.find(
    (item) =>
      item.email === email.trim().toLowerCase() && item.password === password,
  )
  return credential?.user ?? null
}
