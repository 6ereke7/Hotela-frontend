import { useState } from 'react'
import { mockStaffMembers } from '../data/mockOperations'
import commonStyles from './StaffDashboardCommon.module.css'
const dashboardStyles = commonStyles

export function ManagerTeamSection() {
  const [inviteNoted, setInviteNoted] = useState(false)

  return (
    <section className={dashboardStyles.panelCard} aria-labelledby="team-list-title">
      <div className={dashboardStyles.panelHeading}>
        <div>
          <p className={dashboardStyles.eyebrow}>PEOPLE & PERMISSIONS</p>
          <h2 id="team-list-title">Staff overview</h2>
        </div>
        <button
          className={dashboardStyles.smallPrimaryButton}
          type="button"
          onClick={() => setInviteNoted(true)}
        >
          {inviteNoted ? 'Invite noted ✓' : '＋ Invite a teammate'}
        </button>
      </div>
      <div className={dashboardStyles.teamList}>
        {mockStaffMembers.map((member) => (
          <div className={dashboardStyles.teamMember} key={member.name}>
            <span className={dashboardStyles.profileAvatar}>{member.initials}</span>
            <span className={dashboardStyles.teamMemberInfo}>
              <strong>{member.name}</strong>
              <small>{member.role}</small>
            </span>
            <span className={member.status === 'On property' ? dashboardStyles.staffPresent : dashboardStyles.staffAbsent}>
              <i />{member.status}
            </span>
            <button
              className={dashboardStyles.moreButton}
              type="button"
              aria-label={`More actions for ${member.name}`}
            >
              ···
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
