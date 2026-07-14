"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useStaffUsersParams } from "../hooks/use-staff-users-params";

const roleOptions = [
  { value: "", label: "All roles" },
  { value: "USER", label: "User" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Admin" },
] as const;

export function StaffUsersRoleFilter() {
  const [{ role }, setParams] = useStaffUsersParams();

  function handleValueChange(value: string | null) {
    void setParams({ role: toRoleFilter(value), page: 1 });
  }

  return (
    <Select items={roleOptions} value={role} onValueChange={handleValueChange}>
      <SelectTrigger
        aria-label="Filter users by role"
        className="w-full sm:w-36"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {roleOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function toRoleFilter(value: string | null) {
  if (value === "USER" || value === "MANAGER" || value === "ADMIN") {
    return value;
  }

  return "";
}
