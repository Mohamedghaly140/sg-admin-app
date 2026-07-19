"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { orderStatusLabels } from "@/components/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { updateOrderStatus } from "../actions/update-order-status";
import type { OrderStatus, PaymentMethod } from "../types";

type OrderStatusControlProps = {
  orderId: string;
  currentStatus: OrderStatus;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
};

type StatusOption = {
  status: OrderStatus;
  disabled?: boolean;
};

function getNextStatusOptions(
  currentStatus: OrderStatus,
  isPaid: boolean,
  paymentMethod: PaymentMethod,
): StatusOption[] {
  switch (currentStatus) {
    case "PENDING":
      return [
        { status: "PROCESSING" },
        ...(!isPaid ? [{ status: "CANCELLED" as const }] : []),
      ];
    case "PROCESSING":
      return [
        { status: "SHIPPED" },
        ...(!isPaid ? [{ status: "CANCELLED" as const }] : []),
      ];
    case "SHIPPED":
      return [
        {
          status: "DELIVERED",
          disabled: paymentMethod === "CASH" && !isPaid,
        },
      ];
    case "DELIVERED":
      return [{ status: "REFUNDED" }];
    case "CANCELLED":
    case "REFUNDED":
      return [];
  }
}

export function OrderStatusControl({
  orderId,
  currentStatus,
  isPaid,
  paymentMethod,
}: OrderStatusControlProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const statusOptions = getNextStatusOptions(
    currentStatus,
    isPaid,
    paymentMethod,
  );

  function handleSelectStatus(status: OrderStatus) {
    setNotes("");
    setTargetStatus(status);
    setDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) setNotes("");
  }

  function handleConfirm() {
    if (!targetStatus) return;

    startTransition(async () => {
      const actionState = await updateOrderStatus(
        orderId,
        targetStatus,
        notes || undefined,
      );
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
        handleDialogOpenChange(false);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  if (statusOptions.length === 0) {
    return <p className="text-sm text-muted-foreground">No further actions</p>;
  }

  const isCancellation = targetStatus === "CANCELLED";
  const description = isCancellation
    ? "The customer will automatically receive an email. Cancelling also restores stock and releases any applied coupon usage."
    : "The customer will automatically receive an email about this status change.";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Change status
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.status}
                disabled={isPending || option.disabled}
                variant={option.status === "CANCELLED" ? "destructive" : "default"}
                onClick={() => handleSelectStatus(option.status)}
              >
                {orderStatusLabels[option.status]}
                {option.disabled ? (
                  <span className="text-xs text-muted-foreground">
                    — mark paid first
                  </span>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        title={
          targetStatus
            ? `Change status to ${orderStatusLabels[targetStatus]}?`
            : "Change order status?"
        }
        description={description}
        confirmLabel={isPending ? "Changing…" : "Change status"}
        pending={isPending}
        variant={isCancellation ? "destructive" : "default"}
        onConfirm={handleConfirm}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="order-status-notes">
            Note (optional, visible internally — overwrites any existing note)
          </Label>
          <Textarea
            id="order-status-notes"
            maxLength={1000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      </ConfirmDialog>
    </>
  );
}
