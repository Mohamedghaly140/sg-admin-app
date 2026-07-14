"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const markOrderPaidSchema = z.object({
  id: z.string().trim().min(1),
});

export async function markOrderPaid(id: string): Promise<ActionState> {
  try {
    const input = markOrderPaidSchema.parse({ id });
    await apiFetch(`/admin/orders/${input.id}/mark-paid`, {
      method: "PATCH",
    });
    revalidatePath("/orders");
    revalidatePath(`/orders/${input.id}`);
    return toActionState("SUCCESS", "Order marked as paid");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
