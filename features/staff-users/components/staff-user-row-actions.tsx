"use client";

import {
  LucidePencil,
  LucideTrash2,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { StaffUser } from "../types";
import { StaffUserDeleteDialog } from "./staff-user-delete-dialog";
import { StaffUserEditDialog } from "./staff-user-edit-dialog";

type StaffUserRowActionsProps = {
  user: StaffUser;
  currentUserId: string | null;
  activeAdminCount: number;
};

type DisabledActionProps = {
  icon: LucideIcon;
  label: string;
  reason: string;
  variant?: "destructive" | "ghost";
};

export function StaffUserRowActions({
  user,
  currentUserId,
  activeAdminCount,
}: StaffUserRowActionsProps) {
  const isOwnRow = user.id === currentUserId;
  const isLastActiveAdmin =
    activeAdminCount === 1 && user.role === "ADMIN" && user.active;
  const disabled = isOwnRow || isLastActiveAdmin;

  if (disabled) {
    const reason = isOwnRow
      ? "You can't change your own account"
      : "At least one active admin must remain.";

    return (
      <div className="flex justify-end gap-1">
        <DisabledAction icon={LucidePencil} label="Edit" reason={reason} />
        <DisabledAction
          icon={LucideTrash2}
          label="Delete"
          reason={reason}
          variant="destructive"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      <StaffUserEditDialog user={user} />
      <StaffUserDeleteDialog user={user} />
    </div>
  );
}

function DisabledAction({
  icon: Icon,
  label,
  reason,
  variant = "ghost",
}: DisabledActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className="inline-flex"
            tabIndex={0}
            aria-label={`${label}: ${reason}`}
          />
        }
      >
        <Button
          type="button"
          variant={variant}
          size="icon-sm"
          disabled
          aria-label={`${label}: ${reason}`}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}
