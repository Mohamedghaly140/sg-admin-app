"use client";

import { useMemo, useState } from "react";

import FieldError from "@/components/shared/form/field-error";
import type { ActionState } from "@/components/shared/form/utils/to-action-state";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type { ProductSubCategoryOption } from "../types";

type ProductSubCategoriesSelectProps = {
  subCategories: ProductSubCategoryOption[];
  categoryId: string;
  defaultValue?: string | string[];
  actionState: ActionState;
};

export function ProductSubCategoriesSelect({
  subCategories,
  categoryId,
  defaultValue,
  actionState,
}: ProductSubCategoriesSelectProps) {
  const [selectedIdsByCategory, setSelectedIdsByCategory] = useState<
    Record<string, string[]>
  >({});
  const visibleSubCategories = useMemo(
    () =>
      subCategories.filter(
        (subCategory) => subCategory.categoryId === categoryId,
      ),
    [categoryId, subCategories],
  );
  const visibleIds = useMemo(
    () => new Set(visibleSubCategories.map((subCategory) => subCategory.id)),
    [visibleSubCategories],
  );
  const selectedIds =
    selectedIdsByCategory[categoryId] ??
    normalizeSelectedIds(defaultValue).filter((id) => visibleIds.has(id));

  function handleToggle(id: string, checked: boolean) {
    setSelectedIdsByCategory((currentByCategory) => {
      const currentIds = currentByCategory[categoryId] ?? selectedIds;
      const nextIds = checked
        ? currentIds.includes(id)
          ? currentIds
          : [...currentIds, id]
        : currentIds.filter((currentId) => currentId !== id);

      return {
        ...currentByCategory,
        [categoryId]: nextIds,
      };
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span id="product-sub-categories-label" className="text-sm font-medium">
        Sub-categories
      </span>
      {categoryId ? (
        visibleSubCategories.length > 0 ? (
          <div
            role="group"
            aria-labelledby="product-sub-categories-label"
            className="grid gap-2 rounded-md border p-3 sm:grid-cols-2"
          >
            {visibleSubCategories.map((subCategory) => {
              const checkboxId = `sub-category-${subCategory.id}`;
              const checked = selectedIds.includes(subCategory.id);

              return (
                <div key={subCategory.id} className="flex items-center gap-2">
                  <Checkbox
                    id={checkboxId}
                    checked={checked}
                    onCheckedChange={(nextChecked) =>
                      handleToggle(subCategory.id, nextChecked === true)
                    }
                    aria-invalid={Boolean(
                      actionState.fieldErrors.subCategoryIds?.length,
                    )}
                  />
                  <Label htmlFor={checkboxId}>{subCategory.name}</Label>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No sub-categories are available for this category.
          </p>
        )
      ) : (
        <p className="text-sm text-muted-foreground">
          Choose a category to select sub-categories.
        </p>
      )}

      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="subCategoryIds" value={id} />
      ))}

      <FieldError name="subCategoryIds" actionState={actionState} />
    </div>
  );
}

function normalizeSelectedIds(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
