import { useState } from 'react'
import { CalendarDays, Search, UsersRound } from 'lucide-react'
import styles from './Filter.module.css'

export default function Filter() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const today = new Date()
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const minDate = formatDate(today)
  const minCheckOutDate = checkIn ? new Date(`${checkIn}T00:00:00`) : today
  if (checkIn) {
    minCheckOutDate.setDate(minCheckOutDate.getDate() + 1)
  }

  function handleCheckInChange(value: string) {
    setCheckIn(value)
    if (checkOut && checkOut <= value) {
      setCheckOut('')
    }
  }

  return (
    <form className={styles.searchBar} action="/catalog" method="get">
      <div className={styles.searchIntro}>
        <div>
          <p>Make room for a getaway</p>
          <span>Find a stay that feels just right.</span>
        </div>
        <span className={styles.searchNote}>Your next stay starts here</span>
      </div>

      <div className={styles.searchFields}>
        <label className={styles.searchField}>
          <CalendarDays className={styles.searchIcon} size={20} aria-hidden="true" />
          <span className={styles.searchFieldContent}>
            <span>Check in</span>
            <input
              type="date"
              name="checkIn"
              aria-label="Check-in date"
              min={minDate}
              value={checkIn}
              onChange={(event) => handleCheckInChange(event.target.value)}
              required
            />
          </span>
        </label>

        <label className={styles.searchField}>
          <CalendarDays className={styles.searchIcon} size={20} aria-hidden="true" />
          <span className={styles.searchFieldContent}>
            <span>Check out</span>
            <input
              type="date"
              name="checkOut"
              aria-label="Check-out date"
              min={formatDate(minCheckOutDate)}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              required
            />
          </span>
        </label>

        <label className={styles.searchField}>
          <UsersRound className={styles.searchIcon} size={20} aria-hidden="true" />
          <span className={styles.searchFieldContent}>
            <span>Guests</span>
            <select name="guests" defaultValue="2" aria-label="Number of guests">
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
            </select>
          </span>
        </label>

        <button className={styles.searchButton} type="submit">
          <span>Find a room</span>
          <Search size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
