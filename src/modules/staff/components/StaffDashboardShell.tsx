import { useContext, type ReactNode } from "react";
import { LucideLogOut } from "lucide-react";
import shellStyles from "./StaffDashboardShell.module.css";
import commonStyles from "./StaffDashboardCommon.module.css";
import { authContext } from "@/app/contexts";

type StaffDashboardShellProps = {
  staffTitle: string;
  sidebarLabel: string;
  navigationLabel: string;
  navigation: ReactNode;
  children: ReactNode;
};

export function StaffDashboardShell({
  staffTitle,
  sidebarLabel,
  navigationLabel,
  navigation,
  children,
}: StaffDashboardShellProps) {
  const auth = useContext(authContext);

  const staff = auth?.staff;
  const initials = staff?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <main
      className={`${shellStyles.dashboard} d-flex flex-column flex-md-row min-vh-100`}
    >
      <aside
        className={`${shellStyles.sidebar} d-flex flex-column p-3 bg-white`}
      >
        <a
          className={`${shellStyles.wordmark} text-success fs-3 fw-bold text-decoration-none`}
          href="/"
          aria-label="Hotela home"
        >
          hotela<span>.</span>
        </a>
        <p className={shellStyles.sidebarLabel}>{sidebarLabel}</p>
        <nav
          className={`${shellStyles.sideNav} d-grid gap-1`}
          aria-label={navigationLabel}
        >
          {navigation}
        </nav>
        <div className={shellStyles.sidebarBottom}>
          <div className={commonStyles.profileAvatar}>{initials}</div>
          <div className={shellStyles.profileText}>
            <strong>{staff?.name}</strong>
            <span>{staffTitle}</span>
          </div>
          <button
            className={shellStyles.logoutButton}
            onClick={auth?.onLogout}
            type="button"
            aria-label="Sign out"
          >
            <LucideLogOut />
          </button>
        </div>
      </aside>

      <section className={`${shellStyles.mainPanel} flex-grow-1`}>
        {children}
      </section>
    </main>
  );
}
