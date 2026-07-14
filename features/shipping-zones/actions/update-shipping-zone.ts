"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { ApiError } from "@/lib/api/api-error";
import { apiFetch } from "@/lib/api/http";

import { updateShippingZoneSchema } from "../schema/shipping-zone-schema";

const shippingZoneIdSchema = z.string().trim().min(1);

export async function updateShippingZone(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const zoneId = shippingZoneIdSchema.parse(id);
    const input = updateShippingZoneSchema.parse(Object.fromEntries(formData));
    await apiFetch(`/admin/shipping-zones/${zoneId}`, {
      method: "PATCH",
      body: input,
    });
    revalidatePath("/shipping-zones");
    return toActionState("SUCCESS", "Shipping zone updated");
  } catch (error) {
    if (error instanceof ApiError && error.code === "DUPLICATE_RESOURCE") {
      return toActionState(
        "ERROR",
        "A zone for this country/governorate/city already exists.",
        formData,
      );
    }
    return fromErrorToActionState(error, formData);
  }
}
