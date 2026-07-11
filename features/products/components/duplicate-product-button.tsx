"use client";

import { LucideCopy } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { duplicateProduct } from "../actions/duplicate-product";

type DuplicateProductButtonProps = {
  productId: string;
};

export function DuplicateProductButton({
  productId,
}: DuplicateProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const actionState = await duplicateProduct(productId);
      if (actionState.status === "ERROR") {
        toast.error(actionState.message);
      }
    });
  }

  return (
    <DropdownMenuItem disabled={isPending} onClick={handleClick}>
      <LucideCopy aria-hidden="true" />
      {isPending ? "Duplicating…" : "Duplicate"}
    </DropdownMenuItem>
  );
}
