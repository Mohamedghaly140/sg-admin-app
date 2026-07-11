"use client";

import { LucideTrash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { buttonVariants } from "@/components/ui/button";

import { deleteSubCategory } from "../actions/delete-sub-category";

type DeleteSubCategoryButtonProps = {
  subCategoryId: string;
  subCategoryName: string;
};

export function DeleteSubCategoryButton({
  subCategoryId,
  subCategoryName,
}: DeleteSubCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const actionState = await deleteSubCategory(subCategoryId);
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  return (
    <ConfirmDialog
      trigger={
        <span className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
          <LucideTrash2 aria-hidden="true" />
          <span className="sr-only">Delete {subCategoryName}</span>
        </span>
      }
      title={`Delete ${subCategoryName}?`}
      description="This permanently deletes the sub-category. Sub-categories used by products cannot be deleted."
      confirmLabel={isPending ? "Deleting…" : "Delete sub-category"}
      pending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
