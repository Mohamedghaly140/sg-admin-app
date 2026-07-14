"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const deleteUserSchema = z.object({
  id: z.string().trim().min(1),
});

export async function deleteUser(id: string): Promise<ActionState> {
  try {
    const input = deleteUserSchema.parse({ id });
    await apiFetch(`/admin/users/${input.id}`, { method: "DELETE" });
    revalidatePath("/staff-users");
    return toActionState("SUCCESS", "User deleted");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
