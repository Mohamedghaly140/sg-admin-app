"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

import { setShippingZoneActive } from "../actions/set-shipping-zone-active";

type ShippingZoneActiveToggleProps = {
  id: string;
  isActive: boolean;
  label: string;
};

export function ShippingZoneActiveToggle({
  id,
  isActive,
  label,
}: ShippingZoneActiveToggleProps) {
  const [optimistic, setOptimistic] = useOptimistic(isActive);
  const [isPending, startTransition] = useTransition();

  function handleCheckedChange(nextChecked: boolean) {
    startTransition(async () => {
      // useOptimistic auto-reverts to the server prop when the transition ends,
      // so a failed toggle (no revalidate) restores the real state — no manual
      // rollback needed.
      setOptimistic(nextChecked);
      const result = await setShippingZoneActive(id, nextChecked);
      if (result.status !== "SUCCESS") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Switch
      checked={optimistic}
      onCheckedChange={handleCheckedChange}
      disabled={isPending}
      aria-label={`${optimistic ? "Deactivate" : "Activate"} ${label}`}
    />
  );
}
