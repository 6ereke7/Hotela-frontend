import Wraper from "@/components/Wraper";
import { api, type StaffUser } from "@/modules/auth";
import type { Room } from "@/types/room";
import { useEffect, useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { ThemeContext, authContext, mainContext, type theme, type Guest } from "./contexts";

// TODO: use the theme provider fr :o (make the css theme compatable)


export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<theme>(
    (localStorage.getItem("theme") as theme) ?? "light",
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
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
export function MainProvider() {
  const [room, setRoom] = useState<Room | undefined>();
  const [guest, setGuest] = useState<Guest>();
  return (
    <mainContext.Provider value={{ room, setRoom, guest, setGuest }}>
      <Wraper>
        <Outlet />
      </Wraper>
    </mainContext.Provider>
  );
}
