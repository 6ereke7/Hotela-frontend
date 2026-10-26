import { api, type StaffUser } from "@/modules/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface themeContextInterface {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}
interface authContextInterface {
  staff: StaffUser | null;
  loading: boolean;
  onLogin: (staff: StaffUser) => void;
  onLogout: () => void;
}

export const ThemeContext = createContext<themeContextInterface | null>(null);
export const authContext = createContext<authContextInterface | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function AuthProvider() {
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .me()
      .then(setStaff)
      .catch(() => setStaff(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setStaff(null);
    }
  };
  return (
    <authContext.Provider
      value={
        staff
          ? {
              staff: staff,
              loading: false,
              onLogin: setStaff,
              onLogout: handleLogout,
            }
          : {
              staff: null,
              loading,
              onLogin: setStaff,
              onLogout: handleLogout,
            }
      }
    >
      <Outlet />
    </authContext.Provider>
  );
}
