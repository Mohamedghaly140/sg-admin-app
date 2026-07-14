"use client";

import { LucideUserPlus } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

import FieldError from "@/components/shared/form/field-error";
import Form from "@/components/shared/form/form";
import {
  EMPTY_ACTION_STATE,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import FormControl from "@/components/shared/form-control";
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

import { createUser } from "../actions/create-user";
import type { StaffRole } from "../types";

const roleOptions = [
  { value: "USER", label: "User" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Admin" },
] as const;

export function StaffUserCreateDialog() {
  const roleId = useId();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<StaffRole>("USER");
  const [actionState, setActionState] =
    useState<ActionState>(EMPTY_ACTION_STATE);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setRole("USER");
      setActionState(EMPTY_ACTION_STATE);
    }
  }

  function handleRoleChange(value: string | null) {
    if (isStaffRole(value)) {
      setRole(value);
    }
  }

  async function handleAction(formData: FormData) {
    const result = await createUser(EMPTY_ACTION_STATE, formData);

    if (result.status === "SUCCESS") {
      toast.success(result.message);
      handleOpenChange(false);
      return;
    }

    setActionState(result);
    if (result.message) toast.error(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        <LucideUserPlus data-icon="inline-start" aria-hidden="true" />
        Create user
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Create a customer, manager, or admin account. Share the password
            securely out of band.
          </DialogDescription>
        </DialogHeader>

        <Form
          action={handleAction}
          actionState={actionState}
          suppressBuiltInToasts
        >
          <FormControl
            label="Name"
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            defaultValue={actionState.payload?.name}
            actionState={actionState}
          />
          <FormControl
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={actionState.payload?.email}
            actionState={actionState}
          />
          <FormControl
            label="Phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+201000000009"
            defaultValue={actionState.payload?.phone}
            actionState={actionState}
          />
          <FormControl
            label="Password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            actionState={actionState}
          />

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

          <DialogFooter>
            <SubmitButton
              label="Create user"
              icon={<LucideUserPlus aria-hidden="true" />}
            />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function isStaffRole(value: string | null): value is StaffRole {
  return value === "USER" || value === "MANAGER" || value === "ADMIN";
}
