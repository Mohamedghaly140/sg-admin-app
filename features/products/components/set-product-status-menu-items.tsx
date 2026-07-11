"use client";

import { LucideCheck } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { setProductStatus } from "../actions/set-product-status";
import { productStatusValues } from "../hooks/use-products-params";
import type { ProductStatus } from "../types";

type SetProductStatusMenuItemsProps = {
  productId: string;
  currentStatus: ProductStatus;
};

const statusLabels: Record<ProductStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

export function SetProductStatusMenuItems({
  productId,
  currentStatus,
}: SetProductStatusMenuItemsProps) {
  const [isPending, startTransition] = useTransition();

  function handleSetStatus(status: ProductStatus) {
    startTransition(async () => {
      const actionState = await setProductStatus(productId, status);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  return productStatusValues.map((status) => (
    <DropdownMenuItem
      key={status}
      disabled={isPending || status === currentStatus}
      onClick={() => handleSetStatus(status)}
    >
      {status === currentStatus ? <LucideCheck aria-hidden="true" /> : null}
      {statusLabels[status]}
    </DropdownMenuItem>
  ));
}
