"use client";

import { LucidePencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { CategoryOption } from "../queries/get-all-categories";
import type { SubCategory } from "../types";
import { DeleteSubCategoryButton } from "./delete-sub-category-button";
import { SubCategoryFormDialog } from "./sub-category-form-dialog";

type SubCategoryRowActionsProps = {
  categoryId: string;
  categoryOptions: CategoryOption[];
  subCategory: SubCategory;
};

export function SubCategoryRowActions({
  categoryId,
  categoryOptions,
  subCategory,
}: SubCategoryRowActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <SubCategoryFormDialog
        categoryId={categoryId}
        categoryOptions={categoryOptions}
        subCategory={subCategory}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${subCategory.name}`}
          >
            <LucidePencil aria-hidden="true" />
          </Button>
        }
      />
      <DeleteSubCategoryButton
        subCategoryId={subCategory.id}
        subCategoryName={subCategory.name}
      />
    </div>
  );
}
