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

const couponIdSchema = z.string().trim().min(1);

export async function deleteCoupon(id: string): Promise<ActionState> {
  try {
    const couponId = couponIdSchema.parse(id);
    await apiFetch(`/admin/coupons/${couponId}`, { method: "DELETE" });
    revalidatePath("/coupons");
    return toActionState("SUCCESS", "Coupon deleted");
  } catch (error) {
    if (error instanceof ApiError && error.code === "COUPON_IN_USE") {
      // Preserve the code so the UI can offer the required "Deactivate instead"
      // affordance (order history must be kept — see docs/screens/06-coupons.md).
      return toActionState(
        "ERROR",
        "This coupon has been used and can't be deleted. Deactivate it instead.",
        undefined,
        { code: error.code },
      );
    }
    return fromErrorToActionState(error);
  }
}
