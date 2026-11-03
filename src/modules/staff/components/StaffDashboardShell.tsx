import { useContext, useState, type ReactNode } from "react";
import {
  LucideLogOut,
  LucideMoonStar,
  LucideSunMedium,
  MenuIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import shellStyles from "./StaffDashboardShell.module.css";
import { authContext, ThemeContext } from "@/app/contexts";
import { NavLink } from "react-router-dom";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type StaffDashboardShellProps = {
  navList: NavItem[];
  children: ReactNode;
};

export function StaffDashboardShell({
  navList,
  children,
}: StaffDashboardShellProps) {
  const auth = useContext(authContext);
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === "dark";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const staff = auth?.staff;
  const initials = staff?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className={shellStyles.main}>
      <aside className={shellStyles.navPanel}>
        <div className={shellStyles.brandRow}>
          <a className={shellStyles.brand} href="/" aria-label="Hotela home">
            hotela<span>.</span>
          </a>
          <button
            className={shellStyles.themeToggle}
            type="button"
            onClick={() =>
              themeContext?.setTheme?.(isDark ? "light" : "dark")
            }
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            aria-pressed={isDark}
          >
            {isDark ? (
              <LucideSunMedium size={19} aria-hidden="true" />
            ) : (
              <LucideMoonStar size={19} aria-hidden="true" />
            )}
          </button>
        </div>
        <nav
          className={`${shellStyles.navList} ${isMenuOpen ? shellStyles.navListOpen : ""}`}
          id="staff-navigation"
          aria-label="Staff navigation"
        >
          {navList.map((nav) => (
            <NavLink
              key={nav.href}
              to={nav.href}
              className={({ isActive }) =>
                `${shellStyles.navLink} ${isActive ? shellStyles.navLinkActive : ""}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {nav.icon && (
                <span className={shellStyles.navIcon} aria-hidden="true">
                  <nav.icon size={20} />
                </span>
              )}
              {nav.label}
            </NavLink>
          ))}
        </nav>
        <section className={shellStyles.user}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={shellStyles.menuButton}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="staff-navigation"
            type="button"
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
          <button
            className={shellStyles.avatar}
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            aria-label="Toggle user menu"
            aria-expanded={isPopupOpen}
            aria-controls="staff-user-menu"
            type="button"
          >
            {initials ?? "U"}
          </button>
          <section
            className={`${shellStyles.userPopup} ${isPopupOpen ? shellStyles.open : ""}`}
            id="staff-user-menu"
            aria-label="User menu"
          >
            <div className={shellStyles.popupName}>{staff?.name ?? "User"}</div>
            <div className={shellStyles.popupEmail}>{staff?.email ?? ""}</div>
            <button
              className={shellStyles.logoutBtn}
              type="button"
              onClick={() => {
                auth?.onLogout?.();
                setIsPopupOpen(false);
              }}
            >
              <LucideLogOut size={16} />
              Logout
            </button>
          </section>
        </section>
      </aside>
      <section className={shellStyles.mainPanel}>{children}</section>
    </main>
  );
}
