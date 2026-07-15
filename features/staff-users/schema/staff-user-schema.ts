import { z } from "zod";

const ROLES = ["USER", "MANAGER", "ADMIN"] as const;

export const createUserSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.email(),
    phone: z.string().trim().min(1),
    password: z.string().min(8),
    role: z.enum(ROLES),
  })
  .refine((v) => `${v.firstName} ${v.lastName}`.length <= 120, {
    path: ["lastName"],
    message: "Full name must be 120 characters or fewer",
  });

export const updateUserSchema = z.object({
  role: z.enum(ROLES),
  active: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
});
