import { ManagerDashboard, ReceptionistDashboard } from "@/modules/staff";
import { StaffLoginPage, type StaffUser } from "@/modules/auth";

type StaffRouteProps = {
  staffUser: StaffUser | null;
  authLoading: boolean;
  onLogin: (user: StaffUser) => void;
  onLogout: () => void;
};

export function StaffRoute({
  staffUser,
  authLoading,
  onLogin,
  onLogout,
}: StaffRouteProps) {
  if (authLoading) {
    return <main aria-busy="true">Checking your session...</main>;
  }

  if (staffUser?.role === "manager") {
    return <ManagerDashboard staffName={staffUser.name} onLogout={onLogout} />;
  }

  if (staffUser) {
    return (
      <ReceptionistDashboard staffName={staffUser.name} onLogout={onLogout} />
    );
  }

  return <StaffLoginPage onLogin={onLogin} />;
}
