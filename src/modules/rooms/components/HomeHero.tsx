import { ArrowRight } from "lucide-react";
import styles from "./HomeHero.module.css";

export function HomeHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>A softer place to land</p>
        <h1 id="hero-title">Make yourself at home.</h1>
        <p className={styles.description}>
          A thoughtful stay, a softer pace, and a place that feels like it was
          waiting just for you.
        </p>
        <a className={styles.cta} href="#stays">
          Explore stays <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.imageFrame}>
        <img
          src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85"
          alt="Warm, inviting hotel room with a neatly made bed"
          fetchPriority="high"
        />
        <span className={styles.imageCaption}>Thoughtful stays, made simple</span>
      </div>
    </div>
  );
}
