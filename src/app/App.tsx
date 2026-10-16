import { Router } from "./router";
import { useEffect, useState } from "react";
import { api, type StaffUser } from "@/modules/auth";

export function App() {
  const [staff, setStaff] = useState<StaffUser | null>();

  useEffect(() => {
    api
      .me()
      .then(setStaff)
      .catch(() => setStaff(null));
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setStaff(null);
    }
  };

  return (
    <Router
      staffUser={staff ?? null}
      authLoading={staff === undefined}
      onLogout={handleLogout}
      onLogin={setStaff}
    />
  );
}
