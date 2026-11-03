import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FallBackRoute.module.css";

type FallBackRouteProps = {
  redirectTo: string;
};

export function FallBackRoute({ redirectTo }: FallBackRouteProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (secondsRemaining === 0) {
      navigate(redirectTo, { replace: true });
      return;
    }

    const timeout = window.setTimeout(
      () => setSecondsRemaining((seconds) => seconds - 1),
      1000,
    );

    return () => window.clearTimeout(timeout);
  }, [navigate, redirectTo, secondsRemaining]);

  return (
    <main className={styles.page}>
      <section className={styles.message} aria-labelledby="not-found-title">
        <p className={styles.code}>404</p>
        <h1 id="not-found-title">Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <p className={styles.countdown} role="status" aria-live="polite">
          Redirecting in {secondsRemaining}{" "}
          {secondsRemaining === 1 ? "second" : "seconds"}…
        </p>
      </section>
    </main>
  );
}
