import { useEffect, useState, type FormEvent } from "react";
import {
  createReceptionist,
  getReceptionists,
  updateReceptionist,
} from "../api";
import type { Receptionist } from "../types";
import commonStyles from "./StaffDashboardCommon.module.css";
import teamStyles from "./ManagerTeamSection.module.css";

type ReceptionistForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const emptyForm: ReceptionistForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
};

export function ManagerTeamSection() {
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReceptionistForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReceptionists()
      .then(setReceptionists)
      .catch(() => setError("Receptionists could not be loaded."))
      .finally(() => setIsLoading(false));
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (receptionist: Receptionist) => {
    setEditingId(receptionist.id);
    setForm({
      firstName: receptionist.firstName,
      lastName: receptionist.lastName,
      email: receptionist.email,
      phoneNumber: receptionist.phoneNumber,
      password: "",
    });
    setError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      if (editingId) {
        const updated = await updateReceptionist(editingId, {
          ...profile,
          ...(form.password ? { password: form.password } : {}),
        });
        setReceptionists((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        const created = await createReceptionist({
          ...profile,
          password: form.password,
        });
        setReceptionists((current) => [...current, created]);
      }
      closeForm();
    } catch {
      setError(
        "Could not save. Check the details and ensure email and phone are unique.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (receptionist: Receptionist) => {
    setError("");
    try {
      const updated = await updateReceptionist(receptionist.id, {
        isActive: !receptionist.isActive,
      });
      setReceptionists((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch {
      setError("Account status could not be changed.");
    }
  };

  return (
    <section className={`${commonStyles.panelCard} card p-3`} aria-labelledby="team-list-title">
      <div className={commonStyles.panelHeading}>
        <div>
          <p className={commonStyles.eyebrow}>PEOPLE & PERMISSIONS</p>
          <h2 id="team-list-title">
            Receptionists{" "}
            <span className={commonStyles.countBadge}>{receptionists.length}</span>
          </h2>
        </div>
        <button
          className="btn btn-success btn-sm"
          onClick={openCreateForm}
          type="button"
        >
          + Add receptionist
        </button>
      </div>

      {error && (
        <p className={teamStyles.error} role="alert">
          {error}
        </p>
      )}

      {isFormOpen && (
        <form className="row g-3 my-3 p-3 border bg-light" onSubmit={handleSubmit}>
          <h3 className="col-12 h5 mb-0">{editingId ? "Edit receptionist" : "Create receptionist"}</h3>
          <label className="col-md-6">
            <span>First name</span>
            <input
              autoComplete="given-name"
              className="form-control form-control-sm"
              maxLength={100}
              onChange={(event) =>
                setForm({ ...form, firstName: event.target.value })
              }
              required
              value={form.firstName}
            />
          </label>
          <label className="col-md-6">
            <span>Last name</span>
            <input
              autoComplete="family-name"
              className="form-control form-control-sm"
              maxLength={100}
              onChange={(event) =>
                setForm({ ...form, lastName: event.target.value })
              }
              required
              value={form.lastName}
            />
          </label>
          <label className="col-md-6">
            <span>Work email</span>
            <input
              autoComplete="email"
              className="form-control form-control-sm"
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              required
              type="email"
              value={form.email}
            />
          </label>
          <label className="col-md-6">
            <span>Phone number</span>
            <input
              autoComplete="tel"
              className="form-control form-control-sm"
              maxLength={20}
              onChange={(event) =>
                setForm({ ...form, phoneNumber: event.target.value })
              }
              required
              type="tel"
              value={form.phoneNumber}
            />
          </label>
          <label className="col-md-6">
            <span>
              {editingId ? "New password (optional)" : "Temporary password"}
            </span>
            <input
              autoComplete="new-password"
              className="form-control form-control-sm"
              minLength={8}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              required={!editingId}
              type="password"
              value={form.password}
            />
          </label>
          <div className="col-12 d-flex align-items-center gap-2">
            <button
              className="btn btn-success btn-sm"
              disabled={isSaving}
              type="submit"
            >
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create account"}
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={closeForm}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p role="status">Loading receptionists...</p>
      ) : receptionists.length === 0 ? (
        <p className={teamStyles.emptyState}>No receptionist accounts yet.</p>
      ) : (
        <div className={teamStyles.receptionistList}>
          {receptionists.map((receptionist) => (
            <article className={teamStyles.receptionistRow} key={receptionist.id}>
              <div className={commonStyles.profileAvatar} aria-hidden="true">
                {receptionist.firstName[0]}
                {receptionist.lastName[0]}
              </div>
              <div className={teamStyles.receptionistIdentity}>
                <strong>
                  {receptionist.firstName} {receptionist.lastName}
                </strong>
                <span>{receptionist.email}</span>
                <small>{receptionist.phoneNumber}</small>
              </div>
              <span
                className={
                  receptionist.isActive
                    ? teamStyles.activeStatus
                    : teamStyles.inactiveStatus
                }
              >
                {receptionist.isActive ? "Active" : "Inactive"}
              </span>
              <div className={teamStyles.rowActions}>
                <button
                  className={commonStyles.panelLink}
                  onClick={() => openEditForm(receptionist)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className={commonStyles.panelLink}
                  onClick={() => void toggleActive(receptionist)}
                  type="button"
                >
                  {receptionist.isActive ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
