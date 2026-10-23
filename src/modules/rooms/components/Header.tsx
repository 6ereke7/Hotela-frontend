const navLinks = [
  {
    label: "services",
    link: "/services",
  },
  {
    label: "Images",
    link: "/images",
  },
  {
    label: "explore",
    link: "/explore",
  },
];
export default function Header() {
  return (
    <header className="container-xl d-flex align-items-center justify-content-between border-bottom py-3">
      <a className="text-success fs-3 fw-bold text-decoration-none" href="/" aria-label="Hotela home">
        hotela<span>.</span>
      </a>
      <nav className="d-flex align-items-center gap-2 gap-md-4 small" aria-label="Main navigation">
        {navLinks.map((nav, index) => (
          <a
            className={`text-body text-decoration-none ${index === 1 ? "d-none d-md-inline" : ""}`}
            href={nav.link}
            key={nav.label}
          >
            {nav.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
