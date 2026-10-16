import { api } from "@/lib/api";
import type { LoginParams, StaffUser } from "./types";

type ApiStaffUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "receptionist";
};

type ApiResponse<T> = { success: boolean; data: T };

function mapStaffUser(user: ApiStaffUser): StaffUser {
  return {
    ...user,
    role: user.role === "admin" ? "manager" : "receptionist",
  };
}

export const me = async (): Promise<StaffUser> => {
  const response = await api.get<ApiResponse<ApiStaffUser>>("/auth/me");
  return mapStaffUser(response.data.data);
};

export const login = async ({
  email,
  password,
}: LoginParams): Promise<StaffUser> => {
  const response = await api.post<ApiResponse<ApiStaffUser>>("/auth/login", {
    email,
    password,
  });
  return mapStaffUser(response.data.data);
};

export const logout = async () => api.post("/auth/logout");
