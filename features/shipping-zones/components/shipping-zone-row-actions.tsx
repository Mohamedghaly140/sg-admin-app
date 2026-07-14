"use client";

import { LucideEllipsis, LucidePencil, LucideTrash2 } from "lucide-react";
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

import { deleteShippingZone } from "../actions/delete-shipping-zone";
import type { ShippingZone } from "../types";
import { ShippingZoneFormDialog } from "./shipping-zone-form-dialog";

type ShippingZoneRowActionsProps = {
  zone: ShippingZone;
  label: string;
};

export function ShippingZoneRowActions({
  zone,
  label,
}: ShippingZoneRowActionsProps) {
  const actionsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const actionState = await deleteShippingZone(zone.id);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
        setIsDeleteDialogOpen(false);
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
              aria-label={`Actions for ${label}`}
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

      <ShippingZoneFormDialog
        zone={zone}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Delete ${label}?`}
        description="Hard delete. Past orders keep their fee snapshot, but removing the only zone covering an area blocks checkout there — deactivate instead to suspend temporarily."
        confirmLabel={isPending ? "Deleting…" : "Delete zone"}
        finalFocus={actionsTriggerRef}
        pending={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
