"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { updateUserSchema } from "../schema/staff-user-schema";

const userIdSchema = z.string().trim().min(1);

export async function updateUser(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const userId = userIdSchema.parse(id);
    const input = updateUserSchema.parse(Object.fromEntries(formData));
    await apiFetch(`/admin/users/${userId}`, {
      method: "PATCH",
      body: { role: input.role, active: input.active },
    });
    revalidatePath("/staff-users");
    return toActionState("SUCCESS", "User updated");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}
