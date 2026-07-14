"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const couponIdSchema = z.string().trim().min(1);

export async function deactivateCoupon(id: string): Promise<ActionState> {
  try {
    const couponId = couponIdSchema.parse(id);
    await apiFetch(`/admin/coupons/${couponId}/deactivate`, {
      method: "PATCH",
    });
    revalidatePath("/coupons");
    return toActionState("SUCCESS", "Coupon deactivated");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
