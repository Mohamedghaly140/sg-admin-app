import { z } from "zod";

const ROLES = ["USER", "MANAGER", "ADMIN"] as const;

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  phone: z.string().trim().min(1),
  password: z.string().min(8),
  role: z.enum(ROLES),
});

export const updateUserSchema = z.object({
  role: z.enum(ROLES),
  active: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
});
