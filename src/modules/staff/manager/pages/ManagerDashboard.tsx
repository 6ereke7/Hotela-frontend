import { useContext, useEffect } from "react";

import {
  StaffDashboardShell,
  type NavItem,
} from "../../components/StaffDashboardShell";

import { authContext } from "@/app/contexts";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, LucideHouses, Users } from "lucide-react";

const navs: NavItem[] = [
  {
    label: "Overview",
    icon: LayoutGrid,
    href: "/staff/manager/dashboard",
  },
  {
    label: "Rooms",
    icon: LucideHouses,
    href: "/staff/manager/rooms",
  },
  {
    label: "Team",
    icon: Users,
    href: "/staff/manager/team",
  },
];

export function ManagerDashboard() {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.staff === null) navigate("/staff");
  }, [auth?.staff?.id, navigate]);

  return (
    <StaffDashboardShell navList={navs}>
      <Outlet />
    </StaffDashboardShell>
  );
}
