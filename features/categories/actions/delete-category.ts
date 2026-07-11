"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const categoryIdSchema = z.string().trim().min(1);

export async function deleteCategory(id: string): Promise<ActionState> {
  try {
    const categoryId = categoryIdSchema.parse(id);
    await apiFetch(`/admin/categories/${categoryId}`, { method: "DELETE" });
    revalidatePath("/categories");
    return toActionState("SUCCESS", "Category deleted");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
