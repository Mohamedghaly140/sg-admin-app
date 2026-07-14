"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { ApiError } from "@/lib/api/api-error";
import { apiFetch } from "@/lib/api/http";

import { createShippingZoneSchema } from "../schema/shipping-zone-schema";

export async function createShippingZone(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const input = createShippingZoneSchema.parse(Object.fromEntries(formData));
    await apiFetch("/admin/shipping-zones", { method: "POST", body: input });
    revalidatePath("/shipping-zones");
    return toActionState("SUCCESS", "Shipping zone created");
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
