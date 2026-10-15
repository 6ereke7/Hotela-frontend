type RouteLink = {
  href: string
  label: string
}

type RoutePlaceholderProps = {
  section: string
  title: string
  description: string
}

const links: RouteLink[] = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/booking', label: 'Booking' },
  { href: '/booking/checkout', label: 'Checkout' },
  { href: '/staff/login', label: 'Staff login' },
  { href: '/staff/manager', label: 'Manager' },
  { href: '/staff/receptionist', label: 'Receptionist' },
]

export function RoutePlaceholder({
  section,
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <main className="page">
      <header className="page-header">
        <a className="brand" href="/" aria-label="Hotela home">
          Hotela
        </a>
        <span className="section-label">{section}</span>
      </header>

      <section className="page-content" aria-labelledby="page-title">
        <p className="eyebrow">Application shell</p>
        <h1 id="page-title">{title}</h1>
        <p className="description">{description}</p>
        <nav className="route-nav" aria-label="Application routes">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </section>
    </main>
  )
}
