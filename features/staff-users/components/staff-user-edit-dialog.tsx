"use client";

import { LucidePencil } from "lucide-react";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import FieldError from "@/components/shared/form/field-error";
import Form from "@/components/shared/form/form";
import {
  EMPTY_ACTION_STATE,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import SubmitButton from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { updateUser } from "../actions/update-user";
import type { StaffRole, StaffUser } from "../types";

const roleOptions = [
  { value: "USER", label: "User" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Admin" },
] as const;

type StaffUserEditDialogProps = {
  user: StaffUser;
};

export function StaffUserEditDialog({ user }: StaffUserEditDialogProps) {
  const roleId = useId();
  const activeId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const pendingDeactivationFormDataRef = useRef<FormData | null>(null);
  const [open, setOpen] = useState(false);
  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] =
    useState(false);
  const [role, setRole] = useState<StaffRole>(user.role);
  const [active, setActive] = useState(user.active);
  const [actionState, setActionState] =
    useState<ActionState>(EMPTY_ACTION_STATE);
  const [isDeactivationPending, startDeactivationTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setRole(user.role);
      setActive(user.active);
      setActionState(EMPTY_ACTION_STATE);
    } else {
      setRole(user.role);
      setActive(user.active);
      setActionState(EMPTY_ACTION_STATE);
      setIsDeactivationDialogOpen(false);
      pendingDeactivationFormDataRef.current = null;
    }
  }

  function handleRoleChange(value: string | null) {
    if (isStaffRole(value)) {
      setRole(value);
    }
  }

  async function handleAction(formData: FormData) {
    if (user.active === true && active === false) {
      pendingDeactivationFormDataRef.current = formData;
      setIsDeactivationDialogOpen(true);
      return;
    }

    await submitUpdate(formData);
  }

  async function submitUpdate(formData: FormData) {
    const result = await updateUser.bind(null, user.id)(
      EMPTY_ACTION_STATE,
      formData,
    );

    if (result.status === "SUCCESS") {
      toast.success(result.message);
      handleOpenChange(false);
      return;
    }

    setActionState(result);
    if (result.message) toast.error(result.message);
  }

  function handleConfirmDeactivation() {
    const formData = pendingDeactivationFormDataRef.current;
    if (!formData) return;

    startDeactivationTransition(async () => {
      await submitUpdate(formData);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            ref={triggerRef}
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${user.name}`}
          />
        }
      >
        <LucidePencil aria-hidden="true" />
      </DialogTrigger>
      <DialogContent finalFocus={triggerRef}>
        <DialogHeader>
          <DialogTitle>Edit {user.name}</DialogTitle>
          <DialogDescription>
            Update role and account state together. Role changes apply on the
            target user&apos;s next token refresh.
          </DialogDescription>
        </DialogHeader>

        <Form
          action={handleAction}
          actionState={actionState}
          suppressBuiltInToasts
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor={roleId}>Role</Label>
            <Select
              items={roleOptions}
              value={role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger
                id={roleId}
                className="w-full"
                aria-invalid={Boolean(actionState.fieldErrors.role)}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <input type="hidden" name="role" value={role} />
            <FieldError name="role" actionState={actionState} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor={activeId}>Active</Label>
              <p className="text-sm text-muted-foreground">
                Inactive accounts cannot access the dashboard or storefront.
              </p>
            </div>
            <Switch
              id={activeId}
              checked={active}
              onCheckedChange={setActive}
              aria-invalid={Boolean(actionState.fieldErrors.active)}
            />
          </div>
          <input type="hidden" name="active" value={active ? "true" : "false"} />
          <FieldError name="active" actionState={actionState} />

          <DialogFooter>
            <SubmitButton
              label="Save changes"
              icon={<LucidePencil aria-hidden="true" />}
            />
          </DialogFooter>
        </Form>

        <ConfirmDialog
          open={isDeactivationDialogOpen}
          onOpenChange={setIsDeactivationDialogOpen}
          title={`Deactivate ${user.name}?`}
          description="Deactivating this account blocks its dashboard and storefront access."
          confirmLabel={
            isDeactivationPending ? "Deactivating…" : "Deactivate account"
          }
          finalFocus={triggerRef}
          pending={isDeactivationPending}
          variant="destructive"
          onConfirm={handleConfirmDeactivation}
        />
      </DialogContent>
    </Dialog>
  );
}

function isStaffRole(value: string | null): value is StaffRole {
  return value === "USER" || value === "MANAGER" || value === "ADMIN";
}
