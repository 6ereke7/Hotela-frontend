import {
  BookBookmarkIcon,
  HotelIcon,
  Image,
  LucideMoonStar,
  LucideSunMedium,
} from "lucide-react";
import style from "./Header.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/components/ThemeProvider";

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
export default function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <header
      className={`container-xl d-flex align-items-center justify-content-between border-bottom py-2 rounded-4 ${style.header}`}
    >
      <a
        className="text-success fs-3 fw-bold text-decoration-none"
        href="/"
        aria-label="Hotela home"
      >
        hotela<span>.</span>
      </a>
      <nav
        className="d-flex align-items-center gap-2 gap-md-4 small"
        aria-label="Main navigation"
      >
        {navLinks.map((nav, index) => (
          <a
            className={`text-body text-decoration-none ${index === 1 ? "d-none d-md-inline" : ""}`}
            href={nav.link}
            key={nav.label}
          >
            <nav.icon />
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
    </header>
  );
}
