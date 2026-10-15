import { BadgePercent, Headset, UserRoundCheck } from 'lucide-react'
import Filter from '../components/Filter'
import RoomCard from '../components/RoomCard'
import styles from './HomePage.module.css'
import { getMockRooms } from '../data/mockRooms'

const rooms = getMockRooms()
const benefits = [
  {
    number: '01',
    title: 'No account needed',
    description: 'A simple email verification is all it takes to confirm your stay.',
    icon: UserRoundCheck,
  },
  {
    number: '02',
    title: 'Our best rate, always',
    description: 'Book directly for thoughtful extras and our best available price.',
    icon: BadgePercent,
  },
  {
    number: '03',
    title: 'Here when you need us',
    description: 'Our reception team is ready to help, before and throughout your stay.',
    icon: Headset,
  },
]

export function HomePage() {
  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a href="/catalog">Stay</a>
          <a href="#the-hotela-way">The Hotela way</a>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            <span aria-hidden="true" /> A little more room to be
          </p>
          <h1 id="hero-title">
            Make yourself
            <br />
            <em>at somewhere.</em>
          </h1>
          <p className={styles.heroDescription}>
            A thoughtful stay, a softer pace, and a place that feels like it was
            waiting just for you.
          </p>
          <a className={styles.textLink} href="#stays">
            Find your kind of stay <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className={styles.heroImage} role="img" aria-label="Sunlit, serene hotel suite" />

        {/* quick filter */}
        <Filter />

      </section>

      <section className={styles.roomsSection} id="stays" aria-labelledby="rooms-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>A place for every pace</p>
            <h2 id="rooms-title">Find your room to exhale.</h2>
          </div>
          <a className={styles.textLink} href="/catalog">
            Explore all stays <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className={styles.roomGrid}>
          {
            rooms.map((room, index) => (
              <RoomCard room={room} index={index} />
            ))
          }
        </div>
      </section>

      <section
        className={styles.valuesSection}
        id="the-hotela-way"
        aria-labelledby="values-title"
      >
        <div className={styles.valuesIntro}>
          <p className={styles.kicker}>Good to know</p>
          <h2 id="values-title">The details make the difference.</h2>
        </div>
        <div className={styles.benefits}>
          {benefits.map((benefit) => {
            const BenefitIcon = benefit.icon

            return (
              <article className={styles.benefit} key={benefit.number}>
                <div className={styles.benefitMeta}>
                  <span className={styles.benefitNumber}>{benefit.number}</span>
                  <span className={styles.benefitIcon} aria-hidden="true">
                    <BenefitIcon size={20} strokeWidth={1.5} />
                  </span>
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <p>A softer place to land.</p>
        <a href="/booking">book now</a>
      </footer>
    </main >
  )
}
