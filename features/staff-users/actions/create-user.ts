"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { createUserSchema } from "../schema/staff-user-schema";

export async function createUser(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const input = createUserSchema.parse(Object.fromEntries(formData));
    await apiFetch("/admin/users", { method: "POST", body: input });
    revalidatePath("/staff-users");
    return toActionState("SUCCESS", "User created");
  } catch (error) {
    const sanitizedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (key !== "password") {
        sanitizedFormData.append(key, value);
      }
    }
    return fromErrorToActionState(error, sanitizedFormData);
  }
}
