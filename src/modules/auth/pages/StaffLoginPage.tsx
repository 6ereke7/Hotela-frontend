import { useState, type FormEvent } from "react";
import type { StaffUser } from "../types";
import styles from "./StaffLoginPage.module.css";

import * as api from "../api";

type StaffLoginPageProps = {
  onLogin: (user: StaffUser) => void;
};

export function StaffLoginPage({ onLogin }: StaffLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      onLogin(await api.login({ email: email.trim(), password }));
    } catch {
      setError(
        "Sign-in failed. Check your email and password, then try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.loginPage}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <a className={styles.guestLink} href="/">
          Back to guest site <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className={styles.loginCard} aria-labelledby="login-title">
        <div className={styles.loginMark} aria-hidden="true">
          h.
        </div>
        <p className={styles.eyebrow}>The team at Hotela</p>
        <h1 id="login-title">Welcome back.</h1>
        <p className={styles.description}>
          Sign in to your workspace and make someone’s stay.
        </p>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Work email</span>
            <input
              autoComplete="username"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button className={styles.submitButton} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in to workspace"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
      <footer className={styles.footer}>
        Thoughtful stays start with a thoughtful team.
      </footer>
    </main>
  );
}
