export type StaffRole = "manager" | "receptionist";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
};
export type LoginParams = {
  email: string;
  password: string;
};
