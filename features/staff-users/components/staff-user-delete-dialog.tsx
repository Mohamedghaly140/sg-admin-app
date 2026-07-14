"use client";

import { LucideTrash2 } from "lucide-react";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { deleteUser } from "../actions/delete-user";
import type { StaffUser } from "../types";

type StaffUserDeleteDialogProps = {
  user: StaffUser;
};

export function StaffUserDeleteDialog({ user }: StaffUserDeleteDialogProps) {
  const confirmEmailId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [typedEmail, setTypedEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setTypedEmail("");
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTypedEmail(event.target.value);
  }

  function handleTriggerClick() {
    setOpen(true);
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result.status === "SUCCESS") {
        toast.success(result.message);
        setTypedEmail("");
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="destructive"
        size="icon-sm"
        aria-label={`Delete ${user.name}`}
        onClick={handleTriggerClick}
      >
        <LucideTrash2 aria-hidden="true" />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={`Delete ${user.name}?`}
        description="This permanently removes the account from Clerk and the database. Their orders survive with the customer link cleared."
        confirmLabel={isPending ? "Deleting…" : "Delete user"}
        finalFocus={triggerRef}
        pending={isPending || typedEmail.trim() !== user.email}
        variant="destructive"
        onConfirm={handleDelete}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor={confirmEmailId}>
            Type {user.email} to confirm
          </Label>
          <Input
            id={confirmEmailId}
            type="email"
            value={typedEmail}
            onChange={handleEmailChange}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </ConfirmDialog>
    </>
  );
}
