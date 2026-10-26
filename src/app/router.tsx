import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FallBackRoute } from "./FallBackRoute";
import { BookingCheckoutScreen } from "@/modules/bookings";
import { HomePage } from "@/modules/rooms";
import { AuthProvider } from "@/app/providers";
import { StaffLoginPage } from "@/modules/auth";
import { ManagerDashboard, ReceptionistDashboard } from "@/modules/staff";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<HomePage />} />
        <Route path="/booking/:roomId" element={<BookingCheckoutScreen />} />
        <Route path="staff" element={<AuthProvider />}>
          <Route index element={<StaffLoginPage />} />
          <Route path="manager" element={<ManagerDashboard />} />
          <Route path="reception" element={<ReceptionistDashboard />} />
        </Route>
        <Route path="*" element={<FallBackRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
