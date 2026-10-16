import axios from "axios";
import { api } from "@/lib/api";
import type {
  BookingConfirmationResult,
  ConfirmedBooking,
  GuestBookingInput,
} from "./types";

type ApiResponse<T> = { success: boolean; data: T };
type PriceChangedResponse = {
  success: false;
  error: "PRICE_CHANGED";
  data: { nightlyRate: string; totalAmount: string };
};

export async function requestOtp(email: string) {
  const response = await api.post<{
    success: boolean;
    data: { expiresAt: string };
    devCode?: string;
  }>("/bookings/otp", { email });
  if (!response.data.success)
    throw new Error("Could not request a verification code");
  return response.data;
}

export async function confirmBooking(
  otp: string,
  booking: GuestBookingInput,
  quotedTotal: string,
): Promise<BookingConfirmationResult> {
  let response;
  try {
    response = await api.post<ApiResponse<ConfirmedBooking>>(
      "/bookings/confirm",
      {
        otp,
        booking,
        quotedTotal,
      },
    );
  } catch (error) {
    if (
      axios.isAxiosError<PriceChangedResponse>(error) &&
      error.response?.status === 409 &&
      error.response.data.error === "PRICE_CHANGED"
    ) {
      const nightlyRate = Number(error.response.data.data.nightlyRate);
      const totalAmount = Number(error.response.data.data.totalAmount);
      if (!Number.isFinite(nightlyRate) || !Number.isFinite(totalAmount)) {
        throw new Error("Updated booking price response was invalid", {
          cause: error,
        });
      }
      return {
        kind: "price_changed",
        nightlyRate,
        totalAmount,
      };
    }
    throw error;
  }
  if (!response.data.success) throw new Error("Booking could not be confirmed");
  return { kind: "confirmed", booking: response.data.data };
}
