"use server";

import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { ApiError } from "@/lib/api/api-error";
import { apiFetch } from "@/lib/api/http";

const resetCustomerPasswordSchema = z.object({
  id: z.string().trim().min(1),
});

export async function resetCustomerPassword(
  id: string,
): Promise<ActionState> {
  try {
    const input = resetCustomerPasswordSchema.parse({ id });
    await apiFetch(`/admin/customers/${input.id}/reset-password`, {
      method: "POST",
    });
    return toActionState("SUCCESS", "Customer password reset");
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.code === "SERVICE_UNAVAILABLE"
    ) {
      return toActionState(
        "ERROR",
        "Password was reset, but the notification email failed — retry or contact the customer directly.",
      );
    }

    return fromErrorToActionState(error);
  }
}
