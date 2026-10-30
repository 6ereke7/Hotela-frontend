import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FallBackRoute } from "./FallBackRoute";
import { HomePage } from "@/modules/rooms";
import { AuthProvider, MainProvider } from "@/app/providers";
import { StaffLoginPage } from "@/modules/auth";
import { ManagerDashboard, ReceptionistDashboard } from "@/modules/staff";
import { GuestCheckout } from "@/modules/bookings/pages/GuestCheckout";
import { OtpVerificationStep } from "@/modules/bookings";
import PaymentStep from "@/modules/bookings/pages/PaymentStep";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<MainProvider />}>
          <Route index element={<HomePage />} />
          <Route path="book" element={<GuestCheckout />}></Route>
          {/* <Route path="booking/:roomId" element={<BookingCheckoutScreen />} /> */}
          <Route path="otp" element={<OtpVerificationStep />} />
          <Route path="payment" element={<PaymentStep />} />
          <Route path="success" element={<div>Booking successful!</div>} />
        </Route>
        <Route path="/catalog" element={<HomePage />} />
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
