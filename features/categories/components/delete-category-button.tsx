"use client";

import { LucideTrash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { buttonVariants } from "@/components/ui/button";

import { deleteCategory } from "../actions/delete-category";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
};

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const actionState = await deleteCategory(categoryId);
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
          <span className="sr-only">Delete {categoryName}</span>
        </span>
      }
      title={`Delete ${categoryName}?`}
      description="This permanently deletes the category. Categories with sub-categories or products cannot be deleted."
      confirmLabel={isPending ? "Deleting…" : "Delete category"}
      pending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
