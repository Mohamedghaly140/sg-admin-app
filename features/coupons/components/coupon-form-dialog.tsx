"use client";

import { LucidePencil, LucidePlus } from "lucide-react";
import { useState, type FormEvent, type ReactElement } from "react";
import { toast } from "sonner";

import Form from "@/components/shared/form/form";
import {
  EMPTY_ACTION_STATE,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import FormControl from "@/components/shared/form-control";
import SubmitButton from "@/components/shared/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createCoupon } from "../actions/create-coupon";
import { updateCoupon } from "../actions/update-coupon";
import type { Coupon } from "../types";

type CouponFormDialogProps = {
  trigger?: ReactElement;
  coupon?: Coupon;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CouponFormDialog({
  trigger,
  coupon,
  open: controlledOpen,
  onOpenChange,
}: CouponFormDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [actionState, setActionState] =
    useState<ActionState>(EMPTY_ACTION_STATE);
  const isEditing = Boolean(coupon);
  const open = controlledOpen ?? uncontrolledOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setActionState(EMPTY_ACTION_STATE);
    }
  }

  async function handleAction(formData: FormData) {
    const runAction = coupon
      ? updateCoupon.bind(null, coupon.id)
      : createCoupon;
    const result = await runAction(EMPTY_ACTION_STATE, formData);

    if (result.status === "SUCCESS") {
      // Toast synchronously: an edit that drops the coupon from the current
      // filter (e.g. setting a past expiry while filtering by active) unmounts
      // this row before an effect-driven success toast could fire.
      toast.success(result.message);
      handleOpenChange(false);
      return;
    }

    setActionState(result);
    if (result.message) toast.error(result.message);
  }

  function handleCodeInput(event: FormEvent<HTMLInputElement>) {
    event.currentTarget.value = event.currentTarget.value.toUpperCase();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit coupon" : "New coupon"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the coupon fields. A past expiry date expires it immediately."
              : "Create a discount code with usage limits and a future expiry date."}
          </DialogDescription>
        </DialogHeader>

        <Form
          action={handleAction}
          actionState={actionState}
          suppressBuiltInToasts
        >
          <FormControl
            label="Code"
            name="name"
            required
            minLength={3}
            maxLength={30}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            onInput={handleCodeInput}
            defaultValue={actionState.payload?.name ?? coupon?.name}
            actionState={actionState}
          />
          <FormControl
            label="Discount (%)"
            name="discount"
            type="number"
            required
            min="1"
            max="70"
            step="0.01"
            defaultValue={actionState.payload?.discount ?? coupon?.discount}
            actionState={actionState}
          />
          <FormControl
            label="Maximum usage (0 = unlimited)"
            name="maxUsage"
            type="number"
            required
            min="0"
            step="1"
            defaultValue={
              actionState.payload?.maxUsage ?? coupon?.maxUsage ?? "0"
            }
            actionState={actionState}
          />
          <FormControl
            label="Per-user limit (0 = unlimited)"
            name="perUserLimit"
            type="number"
            required
            min="0"
            step="1"
            defaultValue={
              actionState.payload?.perUserLimit ?? coupon?.perUserLimit ?? "1"
            }
            actionState={actionState}
          />
          <FormControl
            label="Expiry date"
            name="expire"
            type="date"
            required
            defaultValue={
              actionState.payload?.expire ?? coupon?.expire.slice(0, 10)
            }
            actionState={actionState}
          />

          <DialogFooter>
            <SubmitButton
              label={isEditing ? "Save changes" : "Create coupon"}
              icon={
                isEditing ? (
                  <LucidePencil aria-hidden="true" />
                ) : (
                  <LucidePlus aria-hidden="true" />
                )
              }
            />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
