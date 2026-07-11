"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { addProductImageSchema } from "../schema/product-image-schema";
import type { ProductFormImage } from "../types";

type AddProductImageInput = {
  imageId: string;
  imageUrl: string;
  sortOrder?: number;
};

export async function addProductImage(
  productId: string,
  image: AddProductImageInput,
): Promise<ActionState> {
  try {
    const input = addProductImageSchema.parse({ productId, ...image });
    await apiFetch<ProductFormImage>(`/admin/products/${input.productId}/images`, {
      method: "POST",
      body: {
        imageId: input.imageId,
        imageUrl: input.imageUrl,
        sortOrder: input.sortOrder,
      },
    });
    revalidatePath(`/products/${input.productId}`);
    return toActionState("SUCCESS", "Gallery image added");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
