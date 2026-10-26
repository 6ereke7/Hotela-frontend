import { useContext, useEffect, useRef, useState } from "react";
import styles from "./StaffLoginPage.module.css";

import * as api from "../api";
import { useNavigate } from "react-router-dom";
import { authContext } from "@/app/providers";

export function StaffLoginPage() {
  const context = useContext(authContext);
  const { staff, loading, onLogin } = context ?? {};
  const navigate = useNavigate();
  useEffect(() => {
    console.log(staff);
    if (loading) return;
    if (!staff) return;
    if (staff.role === "manager") navigate("/staff/manager");
    if (staff.role === "receptionist") navigate("/staff/reception");
  }, [staff, loading, navigate]);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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

  return (
    <main
      className={`${styles.loginPage} container-xl d-flex flex-column min-vh-100`}
    >
      <section
        className={`${styles.loginCard} card w-100 align-self-center my-auto p-4 p-md-5`}
        aria-labelledby="login-title"
      >
        <div className="d-grid gap-3">
          <label className={styles.field}>
            <span>Work email</span>
            <input
              autoComplete="username"
              className="form-control"
              required
              type="email"
              ref={email}
            />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input
              autoComplete="current-password"
              className="form-control"
              required
              type="password"
              ref={password}
            />
          </label>
          {error && (
            <p className="alert alert-danger py-2 mb-0" role="alert">
              {error}
            </p>
          )}
          <button onClick={handleSubmit} className="btn btn-success w-100 py-3">
            {isSubmitting ? "Signing in..." : "Sign in to workspace"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>
    </main>
  );
}
