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

const activeOptions = [
  { value: "", label: "All account states" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
] as const;

export function StaffUsersActiveFilter() {
  const [{ active }, setParams] = useStaffUsersParams();

  function handleValueChange(value: string | null) {
    void setParams({
      active: value === "true" || value === "false" ? value : "",
      page: 1,
    });
  }

  return (
    <Select
      items={activeOptions}
      value={active}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        aria-label="Filter users by account state"
        className="w-full sm:w-44"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {activeOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
