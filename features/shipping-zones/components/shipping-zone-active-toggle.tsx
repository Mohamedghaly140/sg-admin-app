"use client";

import { useState, useTransition } from "react";
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
  const [optimistic, setOptimistic] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  function handleCheckedChange(nextChecked: boolean) {
    setOptimistic(nextChecked);
    startTransition(async () => {
      const result = await setShippingZoneActive(id, nextChecked);
      if (result.status !== "SUCCESS") {
        setOptimistic(!nextChecked);
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
