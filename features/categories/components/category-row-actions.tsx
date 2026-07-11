"use client";

import { LucidePencil, LucidePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { CategoryOption } from "../queries/get-all-categories";
import type { Category } from "../types";
import { CategoryFormDialog } from "./category-form-dialog";
import { DeleteCategoryButton } from "./delete-category-button";
import { SubCategoryFormDialog } from "./sub-category-form-dialog";

type CategoryRowActionsProps = {
  category: Category;
  categoryOptions: CategoryOption[];
};

export function CategoryRowActions({
  category,
  categoryOptions,
}: CategoryRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <CategoryFormDialog
        category={category}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${category.name}`}
          >
            <LucidePencil aria-hidden="true" />
          </Button>
        }
      />
      <SubCategoryFormDialog
        categoryId={category.id}
        categoryOptions={categoryOptions}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Add sub-category to ${category.name}`}
          >
            <LucidePlus aria-hidden="true" />
          </Button>
        }
      />
      <DeleteCategoryButton
        categoryId={category.id}
        categoryName={category.name}
      />
    </div>
  );
}
