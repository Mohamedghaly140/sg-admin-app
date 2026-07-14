"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { ApiError } from "@/lib/api/api-error";
import { apiFetch } from "@/lib/api/http";

import { createCouponSchema } from "../schema/coupon-schema";

export async function createCoupon(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const input = createCouponSchema.parse(Object.fromEntries(formData));
    await apiFetch("/admin/coupons", { method: "POST", body: input });
    revalidatePath("/coupons");
    return toActionState("SUCCESS", "Coupon created");
  } catch (error) {
    if (error instanceof ApiError && error.code === "DUPLICATE_RESOURCE") {
      return toActionState(
        "ERROR",
        "A coupon with this code already exists.",
        formData,
      );
    }
    return fromErrorToActionState(error, formData);
  }
}
