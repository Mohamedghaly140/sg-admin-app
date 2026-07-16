"use client";

import { LucidePencil, LucidePlus } from "lucide-react";
import { useState, type ReactElement } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { createShippingZone } from "../actions/create-shipping-zone";
import { updateShippingZone } from "../actions/update-shipping-zone";
import type { ShippingZone } from "../types";

type ShippingZoneFormDialogProps = {
  trigger?: ReactElement;
  zone?: ShippingZone;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ShippingZoneFormDialog({
  trigger,
  zone,
  open: controlledOpen,
  onOpenChange,
}: ShippingZoneFormDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [actionState, setActionState] =
    useState<ActionState>(EMPTY_ACTION_STATE);
  const isEditing = Boolean(zone);
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
    const runAction = zone
      ? updateShippingZone.bind(null, zone.id)
      : createShippingZone;
    const result = await runAction(EMPTY_ACTION_STATE, formData);

    if (result.status === "SUCCESS") {
      // Toast synchronously: an edit that drops the zone from the current search
      // unmounts this row before an effect-driven success toast could fire.
      toast.success(result.message);
      handleOpenChange(false);
      return;
    }

    setActionState(result);
    if (result.message) toast.error(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit shipping zone" : "New shipping zone"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the zone. Leave city blank to cover the whole governorate."
              : "Add a delivery fee for a country/governorate, optionally scoped to a city."}
          </DialogDescription>
        </DialogHeader>

        <Form
          action={handleAction}
          actionState={actionState}
          suppressBuiltInToasts
        >
          <FormControl
            label="Country"
            name="country"
            required
            autoComplete="off"
            defaultValue={actionState.payload?.country ?? zone?.country}
            actionState={actionState}
          />
          <FormControl
            label="Governorate"
            name="governorate"
            required
            autoComplete="off"
            defaultValue={actionState.payload?.governorate ?? zone?.governorate}
            actionState={actionState}
          />
          <FormControl
            label="City (leave blank for the whole governorate)"
            name="city"
            autoComplete="off"
            defaultValue={actionState.payload?.city ?? zone?.city ?? ""}
            actionState={actionState}
          />
          <FormControl
            label="Fee (EGP)"
            name="fee"
            type="number"
            required
            min="0"
            step="0.01"
            defaultValue={actionState.payload?.fee ?? zone?.fee}
            actionState={actionState}
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">
                Inactive zones can&apos;t be used at checkout.
              </p>
            </div>
            <Switch
              id="isActive"
              name="isActive"
              defaultChecked={zone?.isActive ?? true}
            />
          </div>

          <DialogFooter>
            <SubmitButton
              label={isEditing ? "Save changes" : "Create zone"}
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
