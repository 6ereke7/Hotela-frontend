import { ThemeContext } from "@/app/providers";
import { useContext, type ReactNode } from "react";
import {
  BookBookmarkIcon,
  HotelIcon,
  Image,
  LucideMoonStar,
  LucideSunMedium,
} from "lucide-react";
import "@/components/Wraper.css";

const navLinks = [
  {
    link: "/services",
    icon: HotelIcon,
    label: "services",
  },
  {
    link: "/images",
    icon: Image,
    label: "Images",
  },
  {
    link: "/explore",
    icon: BookBookmarkIcon,
    label: "explore",
  },
];
export default function Wraper({ children }: { children: ReactNode }) {
  const themeCtx = useContext(ThemeContext);
  const { theme, setTheme } = themeCtx ?? {};
  return (
    <>
      <header className="header">
        <div
          className={` container-xl d-flex align-items-center justify-content-between py-2 `}
        >
          <a
            className="text-success fs-3 fw-bold text-decoration-none"
            href="/"
            aria-label="Hotela home"
          >
            hotela<span>.</span>
          </a>
          <nav
            className="d-flex align-items-center justify-content-around gap-2 gap-md-4 small"
            aria-label="Main navigation"
          >
            {navLinks.map((nav, index) => (
              <a
                className={`text-body text-decoration-none ${index === 1 ? "d-none d-md-inline" : ""}`}
                href={nav.link}
                key={nav.label}
              >
                <nav.icon style={{ color: "var(--ink)" }} />
              </a>
            ))}
            <div
              onClick={() =>
                setTheme ? setTheme(theme === "dark" ? "light" : "dark") : 1
              }
            >
              {theme === "light" ? <LucideMoonStar /> : <LucideSunMedium />}
            </div>
          </nav>
        </div>
      </header>

      {children}
    </>
  );
}
