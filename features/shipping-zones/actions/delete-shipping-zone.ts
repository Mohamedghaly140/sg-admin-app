"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const shippingZoneIdSchema = z.string().trim().min(1);

export async function deleteShippingZone(id: string): Promise<ActionState> {
  try {
    const zoneId = shippingZoneIdSchema.parse(id);
    await apiFetch(`/admin/shipping-zones/${zoneId}`, { method: "DELETE" });
    revalidatePath("/shipping-zones");
    return toActionState("SUCCESS", "Shipping zone deleted");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
