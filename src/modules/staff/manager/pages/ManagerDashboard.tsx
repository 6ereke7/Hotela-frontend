import { useContext, useEffect } from "react";

import { StaffDashboardShell } from "../../components/StaffDashboardShell";
import shellStyles from "../../components/StaffDashboardShell.module.css";

import { authContext } from "@/app/contexts";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, LucideHouses, Users } from "lucide-react";

const navs = [
  {
    label: "Overview",
    icon: LayoutGrid,
    goto: "/staff/manager",
  },
  {
    label: "Rooms",
    icon: LucideHouses,
    goto: "/staff/manager/rooms",
  },
  {
    label: "Team",
    icon: Users,
    goto: "/staff/manager/team",
  },
];

export function ManagerDashboard() {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.staff === null) navigate("/staff");
  }, [auth?.staff?.id, navigate]);

  return (
    <StaffDashboardShell
      navigationLabel="Manager sections"
      sidebarLabel="HOTEL OPERATIONS"
      staffTitle="Hotel manager"
      navigation={
        <>
          {navs.map((nav) => (
            <button
              className={`btn text-start`}
              key={nav.label}
              onClick={() => navigate(nav.goto)}
              type="button"
            >
              <span className={shellStyles.navIcon} aria-hidden="true">
                <nav.icon size={20} />
              </span>
              {nav.label}
            </button>
          ))}
        </>
      }
    >
      <Outlet />
    </StaffDashboardShell>
  );
}
