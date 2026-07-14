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

import { updateCouponSchema } from "../schema/coupon-schema";

const couponIdSchema = z.string().trim().min(1);

export async function updateCoupon(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const couponId = couponIdSchema.parse(id);
    const input = updateCouponSchema.parse(Object.fromEntries(formData));
    await apiFetch(`/admin/coupons/${couponId}`, {
      method: "PATCH",
      body: input,
    });
    revalidatePath("/coupons");
    return toActionState("SUCCESS", "Coupon updated");
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
