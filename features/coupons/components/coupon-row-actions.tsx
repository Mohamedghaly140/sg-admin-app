"use client";

import {
  LucideBan,
  LucideEllipsis,
  LucidePencil,
  LucideTrash2,
} from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deactivateCoupon } from "../actions/deactivate-coupon";
import { deleteCoupon } from "../actions/delete-coupon";
import type { Coupon } from "../types";
import { CouponFormDialog } from "./coupon-form-dialog";

type CouponRowActionsProps = {
  coupon: Coupon;
};

export function CouponRowActions({ coupon }: CouponRowActionsProps) {
  const actionsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDeactivate() {
    startTransition(async () => {
      const actionState = await deactivateCoupon(coupon.id);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
        setIsDeactivateDialogOpen(false);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const actionState = await deleteCoupon(coupon.id);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
        setIsDeleteDialogOpen(false);
        return;
      }
      // A used coupon can't be deleted — steer to deactivation, which keeps the
      // coupon (and its order history) while disabling it. Hand off from the
      // delete confirm dialog to the deactivate one.
      if (actionState.response?.code === "COUPON_IN_USE" && coupon.isActive) {
        setIsDeleteDialogOpen(false);
        toast.error(actionState.message, {
          action: {
            label: "Deactivate",
            onClick: () => setIsDeactivateDialogOpen(true),
          },
        });
        return;
      }
      toast.error(actionState.message);
    });
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              ref={actionsTriggerRef}
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${coupon.name}`}
            />
          }
        >
          <LucideEllipsis aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <LucidePencil aria-hidden="true" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {coupon.isActive ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setIsDeactivateDialogOpen(true)}
                >
                  <LucideBan aria-hidden="true" />
                  Deactivate
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <LucideTrash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <CouponFormDialog
        coupon={coupon}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {coupon.isActive ? (
        <ConfirmDialog
          open={isDeactivateDialogOpen}
          onOpenChange={setIsDeactivateDialogOpen}
          title={`Deactivate ${coupon.name}?`}
          description="This cannot be re-enabled — create a new coupon instead."
          confirmLabel={isPending ? "Deactivating…" : "Deactivate coupon"}
          finalFocus={actionsTriggerRef}
          pending={isPending}
          onConfirm={handleDeactivate}
        />
      ) : null}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Delete ${coupon.name}?`}
        description="This permanently deletes the coupon. Used coupons cannot be deleted; deactivate them instead."
        confirmLabel={isPending ? "Deleting…" : "Delete coupon"}
        finalFocus={actionsTriggerRef}
        pending={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
