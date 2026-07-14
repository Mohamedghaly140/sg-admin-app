"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { buttonVariants } from "@/components/ui/button";

import { markOrderPaid } from "../actions/mark-order-paid";
import type { OrderStatus, PaymentMethod } from "../types";

type MarkOrderPaidButtonProps = {
  orderId: string;
  status: OrderStatus;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
};

export function MarkOrderPaidButton({
  orderId,
  status,
  isPaid,
  paymentMethod,
}: MarkOrderPaidButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const actionState = await markOrderPaid(orderId);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  if (
    isPaid ||
    paymentMethod !== "CASH" ||
    status === "CANCELLED" ||
    status === "REFUNDED"
  ) {
    return null;
  }

  return (
    <ConfirmDialog
      trigger={
        <span className={buttonVariants({ variant: "outline" })}>
          Mark order paid
        </span>
      }
      title="Mark this order as paid?"
      description="Confirm that cash payment was collected on delivery. This is a one-way action and cannot be undone."
      confirmLabel={isPending ? "Marking paid…" : "Mark paid"}
      pending={isPending}
      variant="destructive"
      onConfirm={handleConfirm}
    />
  );
}
