import type { StaffUser } from "@/modules/auth";
import type { Room } from "@/types/room";
import { createContext } from "react";

export type theme = "dark" | "light";
export interface ThemeContext {
  theme: theme;
  setTheme: (theme: theme) => void;
}
export interface AuthContext {
  staff: StaffUser | null;
  loading: boolean;
  onLogin: (staff: StaffUser) => void;
  onLogout: () => void;
}
export type Guest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fayda?: string;
  guest: number;
  checkIn: Date;
  checkOut: Date;
};
export interface MainContext {
  room: Room | undefined;
  setRoom: (room: Room) => void;
  guest: Guest | undefined;
  setGuest: (guest: Guest) => void;
}

export const ThemeContext = createContext<ThemeContext | null>(null);
export const authContext = createContext<AuthContext | null>(null);
export const mainContext = createContext<MainContext | null>(null);
