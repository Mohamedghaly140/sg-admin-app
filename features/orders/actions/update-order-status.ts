"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { orderStatusValues } from "../hooks/use-orders-params";
import type { OrderStatus } from "../types";

const updateOrderStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(orderStatusValues),
  notes: z.string().trim().max(1000).optional(),
});

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  notes?: string,
): Promise<ActionState> {
  try {
    const input = updateOrderStatusSchema.parse({ id, status, notes });
    await apiFetch(`/admin/orders/${input.id}/status`, {
      method: "PATCH",
      body: {
        status: input.status,
        ...(input.notes ? { notes: input.notes } : {}),
      },
    });
    revalidatePath("/orders");
    revalidatePath(`/orders/${input.id}`);
    return toActionState("SUCCESS", `Order status changed to ${input.status}`);
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
