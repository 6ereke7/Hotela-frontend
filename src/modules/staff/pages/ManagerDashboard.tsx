import { useContext, useEffect, useState } from "react";
import type { GuestBooking, ManagedRoom } from "../types";
import { ManagerOverview } from "../components/ManagerOverview";
import { ManagerRoomsSection } from "../components/ManagerRoomsSection";
import { ManagerTeamSection } from "../components/ManagerTeamSection";
import { StaffDashboardShell } from "../components/StaffDashboardShell";
import shellStyles from "../components/StaffDashboardShell.module.css";
import commonStyles from "../components/StaffDashboardCommon.module.css";
import {
  createManagedRoom,
  getStaffOperations,
  removeManagedRoom,
  updateManagedRoomRate,
} from "../api";
import { authContext } from "@/app/providers";
import { useNavigate } from "react-router-dom";

type ManagerSection = "Overview" | "Rooms" | "Team";
type NewRoomInput = {
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  bedType: string;
  floor: number;
};

const sections: ManagerSection[] = ["Overview", "Rooms", "Team"];

export function ManagerDashboard() {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.staff === null) navigate("/staff");
  }, [auth?.staff?.id, navigate]);
  const [section, setSection] = useState<ManagerSection>("Overview");
  const [rooms, setRooms] = useState<ManagedRoom[]>([]);
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStaffOperations()
      .then((data) => {
        setRooms(data.rooms);
        setBookings(data.bookings);
      })
      .catch(() => setError("Hotel data could not be loaded. Please refresh."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddRoom = async (room: NewRoomInput) => {
    try {
      const createdRoom = await createManagedRoom(room);
      setRooms((current) => [...current, createdRoom]);
      setError("");
    } catch {
      setError("Room could not be added. Check the room number and details.");
    }
  };

  const handleRateChange = async (roomId: string, rate: number) => {
    try {
      await updateManagedRoomRate(roomId, rate);
      setRooms((current) =>
        current.map((room) => (room.id === roomId ? { ...room, rate } : room)),
      );
      setEditingRoom(null);
      setError("");
    } catch {
      setError("Room rate could not be saved.");
    }
  };

  const handleRemoveRoom = async (roomId: string) => {
    try {
      await removeManagedRoom(roomId);
      setRooms((current) => current.filter((room) => room.id !== roomId));
      setError("");
    } catch {
      setError("Room could not be removed.");
    }
  };

  const toggleRoomEdit = (roomId: string) => {
    setEditingRoom((current) => (current === roomId ? null : roomId));
  };

  const staffName = auth?.staff?.name || "";
  const sectionTitle = {
    Overview: `Good morning, ${staffName.split(" ")[0]}.`,
    Rooms: "Room management",
    Team: "Your people.",
  }[section];

  const sectionDescription = {
    Overview: "A lovely day to make someone feel at home.",
    Rooms: "Keep room details and availability up to date.",
    Team: "A thoughtful team makes a thoughtful stay.",
  }[section];

  return (
    <StaffDashboardShell
      breadcrumb={
        <>
          Workspace <span>/</span> {section}
        </>
      }
      liveStatus="Hotel is open"
      navigationLabel="Manager sections"
      sidebarLabel="HOTEL OPERATIONS"
      staffTitle="Hotel manager"
      navigation={
        <>
          {sections.map((item) => (
            <button
              aria-current={section === item ? "page" : undefined}
              className={`btn text-start ${section === item ? `btn-success ${shellStyles.navActive}` : "btn-light"}`}
              key={item}
              onClick={() => setSection(item)}
              type="button"
            >
              <span className={shellStyles.navIcon} aria-hidden="true">
                {item === "Overview" ? "◫" : item === "Rooms" ? "⌂" : "♧"}
              </span>
              {item}
            </button>
          ))}
        </>
      }
    >
      <div className={`${commonStyles.dashboardContent} container-fluid py-4`}>
        <div
          className={`${commonStyles.pageTitleRow} d-flex align-items-center justify-content-between gap-3 mb-4`}
        >
          <div>
            <p className={commonStyles.eyebrow}>
              {section === "Overview"
                ? "YOUR HOTEL AT A GLANCE"
                : "HOTEL OPERATIONS"}
            </p>
            <h1>{sectionTitle}</h1>
            <p className={commonStyles.subtitle}>{sectionDescription}</p>
          </div>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => setSection("Rooms")}
            type="button"
          >
            <span aria-hidden="true">＋</span> Add a room
          </button>
        </div>

        {error && <p role="alert">{error}</p>}
        {isLoading ? <p role="status">Loading hotel data...</p> : null}
        {!isLoading && section === "Overview" && (
          <ManagerOverview
            bookings={bookings}
            onNavigate={setSection}
            rooms={rooms}
          />
        )}
        {section === "Rooms" && (
          <ManagerRoomsSection
            editingRoom={editingRoom}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleRemoveRoom}
            onSaveRate={handleRateChange}
            onToggleEdit={toggleRoomEdit}
            rooms={rooms}
          />
        )}
        {section === "Team" && <ManagerTeamSection />}
      </div>
    </StaffDashboardShell>
  );
}
