"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";

import { resetCustomerPassword } from "../actions/reset-customer-password";
import { setCustomerActive } from "../actions/set-customer-active";

type CustomerActionsProps = {
  customerId: string;
  customerName: string;
  active: boolean;
};

export function CustomerActions({
  customerId,
  customerName,
  active,
}: CustomerActionsProps) {
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const resetPasswordTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isActiveDialogOpen, setIsActiveDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isActivePending, startActiveTransition] = useTransition();
  const [isResetPasswordPending, startResetPasswordTransition] =
    useTransition();
  const nextActive = !active;

  function handleSetActive() {
    startActiveTransition(async () => {
      const actionState = await setCustomerActive(customerId, nextActive);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
        setIsActiveDialogOpen(false);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  function handleResetPassword() {
    startResetPasswordTransition(async () => {
      const actionState = await resetCustomerPassword(customerId);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
        setIsResetPasswordDialogOpen(false);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  return (
    <section aria-label="Customer actions" className="flex flex-wrap gap-2">
      <Button
        ref={activeTriggerRef}
        type="button"
        variant={active ? "destructive" : "default"}
        disabled={isActivePending}
        onClick={() => setIsActiveDialogOpen(true)}
      >
        {active ? "Deactivate customer" : "Activate customer"}
      </Button>
      <Button
        ref={resetPasswordTriggerRef}
        type="button"
        variant="outline"
        disabled={isResetPasswordPending}
        onClick={() => setIsResetPasswordDialogOpen(true)}
      >
        Reset password
      </Button>

      <ConfirmDialog
        open={isActiveDialogOpen}
        onOpenChange={setIsActiveDialogOpen}
        title={`${active ? "Deactivate" : "Activate"} ${customerName}?`}
        description={
          active
            ? "Deactivating bans this customer. They will receive 403 ACCOUNT_DISABLED everywhere, including the storefront."
            : "This restores the customer's access everywhere, including the storefront."
        }
        confirmLabel={
          isActivePending
            ? active
              ? "Deactivating…"
              : "Activating…"
            : active
              ? "Deactivate customer"
              : "Activate customer"
        }
        finalFocus={activeTriggerRef}
        pending={isActivePending}
        variant={active ? "destructive" : "default"}
        onConfirm={handleSetActive}
      />

      <ConfirmDialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
        title={`Reset ${customerName}'s password?`}
        description="This signs the customer out everywhere and emails them a notice. The new password is never shown to anyone."
        confirmLabel={
          isResetPasswordPending ? "Resetting…" : "Reset password"
        }
        finalFocus={resetPasswordTriggerRef}
        pending={isResetPasswordPending}
        onConfirm={handleResetPassword}
      />
    </section>
  );
}
