export type StaffRole = "USER" | "MANAGER" | "ADMIN";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
};
