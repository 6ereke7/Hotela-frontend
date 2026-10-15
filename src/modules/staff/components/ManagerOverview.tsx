import { mockStaffMembers } from '../data/mockOperations'
import styles from './ManagerOverview.module.css'
import commonStyles from './StaffDashboardCommon.module.css'

const dashboardStyles = { ...commonStyles, ...styles }

type ManagerOverviewProps = {
  onNavigate: (section: 'Rooms' | 'Team') => void
}

export function ManagerOverview({ onNavigate }: ManagerOverviewProps) {
  return (
    <>
      <div className={dashboardStyles.statsGrid}>
        <article className={dashboardStyles.statCard}>
          <div className={dashboardStyles.statCardTop}><span>Occupancy</span><span aria-hidden="true">↗</span></div>
          <strong>78<span>%</span></strong>
          <p><span className={dashboardStyles.positive}>↑ 6.2%</span> compared to last week</p>
          <div className={dashboardStyles.miniProgress}><span style={{ width: '78%' }} /></div>
        </article>
        <article className={dashboardStyles.statCard}>
          <div className={dashboardStyles.statCardTop}><span>Rooms occupied</span><span aria-hidden="true">⌂</span></div>
          <strong>31<span className={dashboardStyles.statUnit}>/ 40</span></strong>
          <p>9 rooms available tonight</p>
          <div className={dashboardStyles.miniProgress}><span style={{ width: '78%' }} /></div>
        </article>
        <article className={dashboardStyles.statCard}>
          <div className={dashboardStyles.statCardTop}><span>Revenue this month</span><span aria-hidden="true">$</span></div>
          <strong className={dashboardStyles.revenue}>$42,860</strong>
          <p><span className={dashboardStyles.positive}>↑ 12.8%</span> compared to last month</p>
          <div className={dashboardStyles.miniProgress}><span style={{ width: '65%' }} /></div>
        </article>
        <article className={dashboardStyles.statCard}>
          <div className={dashboardStyles.statCardTop}><span>Today’s arrivals</span><span aria-hidden="true">↘</span></div>
          <strong>8</strong>
          <p>4 check-ins still expected</p>
          <div className={dashboardStyles.arrivalAvatars} aria-label="Four guests arriving">
            <span>AP</span><span>JL</span><span>+2</span>
          </div>
        </article>
      </div>

      <div className={styles.overviewGrid}>
        <section
          className={`${dashboardStyles.panelCard} ${styles.overviewPanelCard}`}
          aria-labelledby="revenue-title"
        >
          <div className={dashboardStyles.panelHeading}>
            <div><p className={dashboardStyles.eyebrow}>PERFORMANCE</p><h2 id="revenue-title">Revenue overview</h2></div>
            <select aria-label="Revenue chart period" defaultValue="7 days">
              <option>7 days</option><option>30 days</option>
            </select>
          </div>
          <div className={styles.chartSummary}>
            <strong>$12,480</strong><span className={dashboardStyles.positive}>↑ 8.4%</span><small>vs previous period</small>
          </div>
          <div className={styles.chart} role="img" aria-label="Revenue chart placeholder showing a generally rising weekly trend">
            <div className={styles.chartYAxis}><span>$4k</span><span>$3k</span><span>$2k</span><span>$1k</span></div>
            <div className={styles.chartPlot}>
              <div className={styles.chartGrid}><i /><i /><i /><i /></div>
              <svg viewBox="0 0 600 190" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#527b62" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#527b62" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 146 C34 135 48 127 82 134 S139 111 170 119 S225 80 260 99 S315 90 344 72 S392 88 428 63 S479 72 514 42 S566 54 600 21 L600 190 L0 190 Z" fill="url(#chart-fill)" />
                <path d="M0 146 C34 135 48 127 82 134 S139 111 170 119 S225 80 260 99 S315 90 344 72 S392 88 428 63 S479 72 514 42 S566 54 600 21" fill="none" stroke="#527b62" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className={styles.chartXAxis}>
                <span>Oct 07</span><span>Oct 08</span><span>Oct 09</span><span>Oct 10</span><span>Oct 11</span><span>Oct 12</span><span>Oct 13</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${dashboardStyles.panelCard} ${styles.overviewPanelCard}`}
          aria-labelledby="rooms-glance"
        >
          <div className={dashboardStyles.panelHeading}>
            <div><p className={dashboardStyles.eyebrow}>ROOM STATUS</p><h2 id="rooms-glance">Rooms at a glance</h2></div>
            <button className={dashboardStyles.panelLink} onClick={() => onNavigate('Rooms')} type="button">View rooms ↗</button>
          </div>
          <div className={styles.occupancyRingWrap}>
            <div className={styles.occupancyRing}><div><strong>78%</strong><span>occupied</span></div></div>
            <ul className={styles.legend}>
              <li><i className={styles.legendOccupied} /> Occupied <strong>31</strong></li>
              <li><i className={styles.legendAvailable} /> Available <strong>6</strong></li>
              <li><i className={styles.legendService} /> Needs service <strong>3</strong></li>
            </ul>
          </div>
          <div className={styles.roomNote}><span>✳</span> 3 rooms are waiting for a little care.</div>
        </section>
      </div>

      <section
        className={`${dashboardStyles.panelCard} ${styles.overviewPanelCard}`}
        aria-labelledby="team-today"
      >
        <div className={dashboardStyles.panelHeading}>
          <div><p className={dashboardStyles.eyebrow}>THE PEOPLE MAKING IT HAPPEN</p><h2 id="team-today">On the team today</h2></div>
          <button className={dashboardStyles.panelLink} onClick={() => onNavigate('Team')} type="button">Meet the team ↗</button>
        </div>
        <div className={styles.teamPreview}>
          {mockStaffMembers.map((member) => (
            <div
              className={`${dashboardStyles.teamMember} ${styles.teamPreviewMember}`}
              key={member.name}
            >
              <span className={dashboardStyles.profileAvatar}>{member.initials}</span>
              <span className={dashboardStyles.teamMemberInfo}><strong>{member.name}</strong><small>{member.role}</small></span>
              <span
                className={`${member.status === 'On property' ? dashboardStyles.staffPresent : dashboardStyles.staffAbsent} ${styles.teamPreviewStatus}`}
              >
                <i />{member.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
