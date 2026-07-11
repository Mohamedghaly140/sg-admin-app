"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import { deleteProduct } from "../actions/delete-product";

type DeleteProductConfirmDialogProps = {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocus?: React.ComponentProps<typeof ConfirmDialog>["finalFocus"];
};

export function DeleteProductConfirmDialog({
  productId,
  productName,
  open,
  onOpenChange,
  finalFocus,
}: DeleteProductConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const actionState = await deleteProduct(productId);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
        onOpenChange(false);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${productName}?`}
      description="This permanently deletes the product unless orders or carts reference it. Referenced products are archived instead."
      confirmLabel={isPending ? "Deleting…" : "Delete product"}
      finalFocus={finalFocus}
      pending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
