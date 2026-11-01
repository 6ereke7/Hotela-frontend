import { useContext, useState, type ReactNode } from "react";
import { LucideLogOut, MenuIcon, XIcon, type LucideIcon } from "lucide-react";
import shellStyles from "./StaffDashboardShell.module.css";
import { authContext } from "@/app/contexts";
import { Link } from "react-router-dom";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const staff = auth?.staff;
  const initials = staff?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <main className={shellStyles.main}>
      <aside className={shellStyles.navPanel}>
        <section className={isMenuOpen ? shellStyles.dNone : shellStyles.brand}>
          hotela.
        </section>
        <section
          className={isMenuOpen ? shellStyles.navList : shellStyles.dNone}
        >
          {navList.map((nav, index) => (
            <Link key={index} to={nav.href} className={shellStyles.navLink}>
              {nav.icon && (
                <span className={shellStyles.navIcon} aria-hidden="true">
                  <nav.icon size={20} />
                </span>
              )}
              {nav.label}
            </Link>
          ))}
        </section>
        <section className={shellStyles.user}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={shellStyles.menuButton}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
          <div
            className={shellStyles.avatar}
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            role="button"
            aria-label="User menu"
            tabIndex={0}
          >
            {initials}
          </div>
          <section
            className={`${shellStyles.userPopup} ${isPopupOpen ? shellStyles.open : ""}`}
            aria-hidden={!isPopupOpen}
          >
            <div className={shellStyles.popupName}>{staff?.name ?? "User"}</div>
            <div className={shellStyles.popupEmail}>{staff?.email ?? ""}</div>
            <button
              className={shellStyles.logoutBtn}
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
