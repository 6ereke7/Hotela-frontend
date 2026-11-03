import {
  useContext,
  useEffect,
  useRef,
  useState,
  type SubmitEvent,
} from "react";
import styles from "./StaffLoginPage.module.css";
import { Loading } from "@/components/Loading";

import * as api from "../api";
import { useNavigate } from "react-router-dom";
import { authContext } from "@/app/contexts";

export function StaffLoginPage() {
  const context = useContext(authContext);
  const { staff, loading, onLogin } = context ?? {};
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!staff) return;
    if (staff.role === "manager") navigate("/staff/manager");
    if (staff.role === "receptionist") navigate("/staff/reception");
  }, [staff, loading, navigate]);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (email.current && password.current) {
        const staff = await api.login({
          email: email.current?.value.trim(),
          password: password.current?.value,
        });
        onLogin?.(staff);
      }
    } catch {
      setError(
        "Sign-in failed. Check your email and password, then try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading label="Checking your session" />;
  }

  return (
    <main className={styles.loginPage}>
      <header className={styles.brandBar}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <a className={styles.guestLink} href="/">
          Return to stays <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className={styles.loginCard} aria-labelledby="login-title">
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Work email</span>
            <input
              autoComplete="username"
              className={styles.input}
              name="email"
              required
              type="email"
              ref={email}
            />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input
              autoComplete="current-password"
              className={styles.input}
              name="password"
              required
              type="password"
              ref={password}
            />
          </label>
          {error && (
            <p className={styles.errorAlert} role="alert">
              {error}
            </p>
          )}
          <button
            className={styles.submitButton}
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Signing in" : undefined}
            type="submit"
          >
            {isSubmitting ? (
              <Loading inline label="Signing in" />
            ) : (
              <>
                Sign in to workspace <span aria-hidden="true">↗</span>
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
