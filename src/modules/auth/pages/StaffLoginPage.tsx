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
    <main
      className={`${styles.loginPage} container-xl d-flex flex-column min-vh-100`}
    >
      <section
        className={`${styles.loginCard} card w-100 align-self-center my-auto p-4 p-md-5`}
        aria-labelledby="login-title"
      >
        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Work email</span>
            <input
              autoComplete="username"
              className="form-control"
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
              className="form-control"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && (
            <p className="alert alert-danger py-2 mb-0" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-success w-100 py-3" type="submit">
            {isSubmitting ? "Signing in..." : "Sign in to workspace"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </main>
  );
}
