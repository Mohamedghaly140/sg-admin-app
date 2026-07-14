"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const setCustomerActiveSchema = z.object({
  id: z.string().trim().min(1),
  active: z.boolean(),
});

export async function setCustomerActive(
  id: string,
  active: boolean,
): Promise<ActionState> {
  try {
    const input = setCustomerActiveSchema.parse({ id, active });
    await apiFetch(`/admin/customers/${input.id}/active`, {
      method: "PATCH",
      body: { active: input.active },
    });
    revalidatePath("/customers");
    revalidatePath(`/customers/${input.id}`);
    return toActionState(
      "SUCCESS",
      input.active ? "Customer activated" : "Customer deactivated",
    );
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
