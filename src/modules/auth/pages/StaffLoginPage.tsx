import { useState, type FormEvent } from 'react'
import { verifyMockStaffLogin } from '../data/mockStaff'
import type { StaffRole, StaffUser } from '../types'
import styles from './StaffLoginPage.module.css'

type StaffLoginPageProps = {
  onLogin: (user: StaffUser) => void
}

export function StaffLoginPage({ onLogin }: StaffLoginPageProps) {
  const [email, setEmail] = useState('manager@hotel.com')
  const [password, setPassword] = useState('welcome123')
  const [error, setError] = useState('')
  const role: StaffRole = email.toLowerCase().startsWith('receptionist@')
    ? 'receptionist'
    : 'manager'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const user = verifyMockStaffLogin(email, password)
    if (!user) {
      setError('That email and password do not match our demo staff accounts.')
      return
    }
    setError('')
    onLogin(user)
  }

  const selectDemoRole = (selectedRole: StaffRole) => {
    setEmail(
      selectedRole === 'manager'
        ? 'manager@hotel.com'
        : 'receptionist@hotel.com',
    )
    setPassword('welcome123')
    setError('')
  }

  return (
    <main className={styles.loginPage}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <a className={styles.guestLink} href="/">
          Back to guest site <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className={styles.loginCard} aria-labelledby="login-title">
        <div className={styles.loginMark} aria-hidden="true">h.</div>
        <p className={styles.eyebrow}>The team at Hotela</p>
        <h1 id="login-title">Welcome back.</h1>
        <p className={styles.description}>
          Sign in to your workspace and make someone’s stay.
        </p>

        <div className={styles.rolePicker} aria-label="Demo role selection">
          <button
            aria-pressed={role === 'manager'}
            className={role === 'manager' ? styles.roleActive : ''}
            onClick={() => selectDemoRole('manager')}
            type="button"
          >
            Manager
          </button>
          <button
            aria-pressed={role === 'receptionist'}
            className={role === 'receptionist' ? styles.roleActive : ''}
            onClick={() => selectDemoRole('receptionist')}
            type="button"
          >
            Receptionist
          </button>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Work email</span>
            <input
              autoComplete="username"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className={styles.submitButton} type="submit">
            Sign in to workspace <span aria-hidden="true">↗</span>
          </button>
        </form>

        <p className={styles.demoHint}>
          Demo access · {role === 'manager' ? 'manager' : 'receptionist'}
          @hotel.com · password <code>welcome123</code>
        </p>
      </section>
      <footer className={styles.footer}>Thoughtful stays start with a thoughtful team.</footer>
    </main>
  )
}
