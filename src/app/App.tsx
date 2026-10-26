import { Router } from "./router";
import { useEffect, useState } from "react";
import { api, type StaffUser } from "@/modules/auth";
import { ThemeProvider } from "@/components/ThemeProvider";

export function App() {
  const [staff, setStaff] = useState<StaffUser | null>();
  // TODO: move the session checking from home page to /staff and login page. use context, not proping
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
    <ThemeProvider>
      <Router
        staffUser={staff ?? null}
        authLoading={staff === undefined}
        onLogout={handleLogout}
        onLogin={setStaff}
      />
    </ThemeProvider>
  );
}
