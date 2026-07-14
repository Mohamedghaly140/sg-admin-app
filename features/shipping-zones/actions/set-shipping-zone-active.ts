"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const setActiveSchema = z.object({
  id: z.string().trim().min(1),
  isActive: z.boolean(),
});

export async function setShippingZoneActive(
  id: string,
  isActive: boolean,
): Promise<ActionState> {
  try {
    const input = setActiveSchema.parse({ id, isActive });
    await apiFetch(`/admin/shipping-zones/${input.id}`, {
      method: "PATCH",
      body: { isActive: input.isActive },
    });
    revalidatePath("/shipping-zones");
    return toActionState(
      "SUCCESS",
      input.isActive ? "Shipping zone activated" : "Shipping zone deactivated",
    );
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
