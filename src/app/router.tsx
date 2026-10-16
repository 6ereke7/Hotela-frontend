import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FallBackRoute } from "./FallBackRoute";
import { BookingCheckoutScreen } from "@/modules/bookings";
import { HomePage } from "@/modules/rooms";
import type { StaffUser } from "@/modules/auth";
import { StaffRoute } from "./StaffRoute";

type RouterProps = {
  staffUser: StaffUser | null;
  authLoading: boolean;
  onLogin: (user: StaffUser) => void;
  onLogout: () => void;
};

export function Router({
  staffUser,
  authLoading,
  onLogin,
  onLogout,
}: RouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<HomePage />} />
        <Route path="/booking/:roomId" element={<BookingCheckoutScreen />} />
        <Route
          path="/staff/login"
          element={
            <StaffRoute
              staffUser={staffUser}
              authLoading={authLoading}
              onLogin={onLogin}
              onLogout={onLogout}
            />
          }
        />
        <Route path="*" element={<FallBackRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
