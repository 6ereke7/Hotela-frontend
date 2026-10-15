import type { ReactNode } from 'react'
import shellStyles from './StaffDashboardShell.module.css'
import commonStyles from './StaffDashboardCommon.module.css'

const styles = { ...shellStyles, ...commonStyles }
import { LucideLogOut } from 'lucide-react'

type StaffDashboardShellProps = {
  staffName: string
  staffTitle: string
  sidebarLabel: string
  navigationLabel: string
  breadcrumb: ReactNode
  liveStatus: string
  navigation: ReactNode
  onLogout: () => void
  children: ReactNode
}

export function StaffDashboardShell({
  staffName,
  staffTitle,
  sidebarLabel,
  navigationLabel,
  breadcrumb,
  liveStatus,
  navigation,
  onLogout,
  children,
}: StaffDashboardShellProps) {
  const initials = staffName
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <main className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <p className={styles.sidebarLabel}>{sidebarLabel}</p>
        <nav className={styles.sideNav} aria-label={navigationLabel}>
          {navigation}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.profileAvatar}>{initials}</div>
          <div className={styles.profileText}>
            <strong>{staffName}</strong>
            <span>{staffTitle}</span>
          </div>
          <button
            className={styles.logoutButton}
            onClick={onLogout}
            type="button"
            aria-label="Sign out"
          >
            <LucideLogOut/>
          </button>
        </div>
      </aside>

      <section className={styles.mainPanel}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.breadcrumb}>{breadcrumb}</p>
            <p className={styles.currentDate}>Monday, October 13, 2026</p>
          </div>
          <div className={styles.topbarActions}>
            <span className={styles.liveIndicator}>
              <i /> {liveStatus}
            </span>
            <button className={styles.iconButton} type="button" aria-label="Notifications">
              ♧<span className={styles.notificationDot} />
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  )
}
