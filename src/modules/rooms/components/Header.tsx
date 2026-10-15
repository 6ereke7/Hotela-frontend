import styles from './Header.module.css'
const navLinks = [
    {
        label: 'services',
        link: '/services'
    },
    {
        label: 'Images',
        link: '/images'
    },
    {
        label: 'explore',
        link: '/explore'
    }
]
export default function Header() {
    return (
        <header className={styles.header}>
            <a className={styles.wordmark} href="/" aria-label="Hotela home">
                hotela<span>.</span>
            </a>
            <nav className={styles.navigation} aria-label="Main navigation">
                {navLinks.map((nav) => (
                    <a href={nav.link}>{nav.label}</a>
                ))}

            </nav>
        </header>
    )
}