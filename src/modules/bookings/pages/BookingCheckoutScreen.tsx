import { useEffect, useState } from "react";
import { GuestCheckoutStep } from "../components/GuestCheckoutStep";
import { OtpVerificationStep } from "../components/OtpVerificationStep";
import type { Room } from "../../../types/room";
import type { GuestBookingDetails, GuestBookingInput } from "../types";
import { useLocation, useParams } from "react-router-dom";
import { confirmBooking, requestOtp } from "../api";
import { getRoomById } from "@/lib/roomsApi";

export function BookingCheckoutScreen() {
  const location = useLocation();
  const { roomId } = useParams();
  const [loadedRoom, setLoadedRoom] = useState<{
    id: string;
    room: Room;
  } | null>(null);
  const [failedRoomId, setFailedRoomId] = useState<string | null>(null);
  const room = loadedRoom && loadedRoom.id === roomId ? loadedRoom.room : null;
  const isLoading = Boolean(roomId) && !room && failedRoomId !== roomId;
  const loadError = Boolean(roomId) && failedRoomId === roomId;
  const initialCheckInDate: string | undefined = location.state?.checkInDate;
  const initialCheckOutDate: string | undefined = location.state?.checkOutDate;
  const [booking, setBooking] = useState<GuestBookingInput | null>(null);
  const [verificationCode, setVerificationCode] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!roomId) return;
    let isCurrent = true;
    getRoomById(roomId)
      .then((loaded) => {
        if (isCurrent) setLoadedRoom({ id: roomId, room: loaded });
      })
      .catch(() => {
        if (isCurrent) setFailedRoomId(roomId);
      });
    return () => {
      isCurrent = false;
    };
  }, [roomId]);

  if (isLoading) return <main role="status">Loading room details...</main>;
  if (loadError || !room) {
    return (
      <main>
        <h1>Room not found</h1>
        <p>The room you are trying to book is no longer available.</p>
      </main>
    );
  }

  const requestVerification = async (details: GuestBookingDetails) => {
    const response = await requestOtp(details.email);
    setBooking({ ...details, roomId: room.id });
    setVerificationCode(response.devCode);
  };
  if (booking) {
    return (
      <OtpVerificationStep
        booking={booking}
        verificationCode={verificationCode}
        onBackToDetails={() => setBooking(null)}
        onConfirm={(code, quotedTotal) =>
          confirmBooking(code, booking, quotedTotal)
        }
        room={room}
      />
    );
  }

  return (
    <GuestCheckoutStep
      onSendVerificationCode={requestVerification}
      room={room}
      initialCheckInDate={initialCheckInDate}
      initialCheckOutDate={initialCheckOutDate}
    />
  );
}
