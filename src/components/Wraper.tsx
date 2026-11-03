import { useContext, type ReactNode } from "react";
import { LucideMoonStar, LucideSunMedium } from "lucide-react";
import { ThemeContext } from "@/app/contexts";
import "@/components/Wraper.css";

type WraperProps = {
  children: ReactNode;
};

export default function Wraper({ children }: WraperProps) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme ?? "light";
  const isDark = theme === "dark";

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__brand" href="/" aria-label="Hotela home">
            hotela<span>.</span>
          </a>
          <nav className="site-nav" aria-label="Main navigation">
            <a className="site-nav__link" href="#stays">
              Stays
            </a>
            <a className="site-nav__link" href="#the-hotela-way">
              Our approach
            </a>
            <button
              className="site-nav__theme-toggle"
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
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
