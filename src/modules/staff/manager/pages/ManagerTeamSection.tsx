import { useEffect, useState, type FormEvent } from "react";
import { Loading } from "@/components/Loading";
import {
  createReceptionist,
  getReceptionists,
  updateReceptionist,
} from "../../api";
import type { Receptionist } from "../../types";
import styles from "./ManagerTeamSection.module.css";

type ReceptionistForm = Pick<
  Receptionist,
  "firstName" | "lastName" | "email" | "phoneNumber"
> & { password: string };

const emptyForm: ReceptionistForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
};

export function ManagerTeamSection() {
  const [team, setTeam] = useState<Receptionist[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReceptionists()
      .then(setTeam)
      .catch(() => setError("Team members could not be loaded."))
      .finally(() => setIsLoading(false));
  }, []);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const editMember = (member: Receptionist) => {
    setEditingId(member.id);
    setForm({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      password: "",
    });
    setError("");
    setIsFormOpen(true);
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    const profile = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
    };

    try {
      const saved = editingId
        ? await updateReceptionist(editingId, {
            ...profile,
            ...(form.password ? { password: form.password } : {}),
          })
        : await createReceptionist({ ...profile, password: form.password });

      setTeam((current) =>
        editingId
          ? current.map((member) => (member.id === saved.id ? saved : member))
          : [...current, saved],
      );
      closeForm();
    } catch {
      setError("Could not save. Check the details and unique email/phone.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (member: Receptionist) => {
    setError("");
    try {
      const updated = await updateReceptionist(member.id, {
        isActive: !member.isActive,
      });
      setTeam((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch {
      setError("Account status could not be changed.");
    }
  };

  return (
    <section className={styles.team} aria-labelledby="team-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>People & permissions</p>
          <h1 id="team-title">Receptionists</h1>
        </div>
        <div className={styles.headerActions}>
          <span>{team.length} team members</span>
          <button
            className={styles.primaryButton}
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setError("");
              setIsFormOpen(true);
            }}
            type="button"
          >
            Add receptionist
          </button>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {isFormOpen && (
        <form className={styles.form} onSubmit={submitForm}>
          <h2>{editingId ? "Edit receptionist" : "Create receptionist"}</h2>
          <label>
            First name
            <input
              autoComplete="given-name"
              maxLength={100}
              onChange={(event) =>
                setForm({ ...form, firstName: event.target.value })
              }
              required
              value={form.firstName}
            />
          </label>
          <label>
            Last name
            <input
              autoComplete="family-name"
              maxLength={100}
              onChange={(event) =>
                setForm({ ...form, lastName: event.target.value })
              }
              required
              value={form.lastName}
            />
          </label>
          <label>
            Work email
            <input
              autoComplete="email"
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            Phone number
            <input
              autoComplete="tel"
              maxLength={20}
              onChange={(event) =>
                setForm({ ...form, phoneNumber: event.target.value })
              }
              required
              type="tel"
              value={form.phoneNumber}
            />
          </label>
          <label>
            {editingId ? "New password (optional)" : "Temporary password"}
            <input
              autoComplete="new-password"
              minLength={8}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              required={!editingId}
              type="password"
              value={form.password}
            />
          </label>
          <div className={styles.formActions}>
            <button
              className={styles.primaryButton}
              disabled={isSaving}
              aria-label={
                isSaving
                  ? editingId
                    ? "Saving receptionist changes"
                    : "Creating receptionist account"
                  : undefined
              }
              type="submit"
            >
              {isSaving
                ? (
                    <Loading
                      inline
                      label={
                        editingId
                          ? "Saving receptionist changes"
                          : "Creating receptionist account"
                      }
                    />
                  )
                : editingId
                  ? "Save changes"
                  : "Create account"}
            </button>
            <button
              className={styles.secondaryButton}
              onClick={closeForm}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <Loading className={styles.loading} label="Loading receptionists" />
      ) : team.length === 0 ? (
        <p className={styles.message}>No receptionist accounts yet.</p>
      ) : (
        <div className={styles.list}>
          {team.map((member) => (
            <article className={styles.member} key={member.id}>
              <span className={styles.avatar} aria-hidden="true">
                {member.firstName[0]}
                {member.lastName[0]}
              </span>
              <div className={styles.identity}>
                <strong>
                  {member.firstName} {member.lastName}
                </strong>
                <span>{member.email}</span>
                <small>{member.phoneNumber}</small>
              </div>
              <span
                className={
                  member.isActive ? styles.activeStatus : styles.inactiveStatus
                }
              >
                {member.isActive ? "Active" : "Inactive"}
              </span>
              <div className={styles.memberActions}>
                <button
                  className={styles.textButton}
                  onClick={() => editMember(member)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className={styles.textButton}
                  onClick={() => void toggleActive(member)}
                  type="button"
                >
                  {member.isActive ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
