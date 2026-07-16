"use client";

import { LucidePencil, LucidePlus } from "lucide-react";
import { useState, type ReactElement } from "react";
import { toast } from "sonner";

import FieldError from "@/components/shared/form/field-error";
import Form from "@/components/shared/form/form";
import {
  EMPTY_ACTION_STATE,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import FormControl from "@/components/shared/form-control";
import SubmitButton from "@/components/shared/submit-button";
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

import { createSubCategory } from "../actions/create-sub-category";
import { updateSubCategory } from "../actions/update-sub-category";
import type { CategoryOption } from "../queries/get-all-categories";
import type { SubCategory } from "../types";

type SubCategoryFormDialogProps = {
  trigger: ReactElement;
  categoryId: string;
  categoryOptions: CategoryOption[];
  subCategory?: SubCategory;
};

export function SubCategoryFormDialog({
  trigger,
  categoryId,
  categoryOptions,
  subCategory,
}: SubCategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const formAction = subCategory
    ? updateSubCategory.bind(null, subCategory.id)
    : createSubCategory;
  const [actionState, setActionState] =
    useState<ActionState>(EMPTY_ACTION_STATE);
  const isEditing = Boolean(subCategory);
  const selectItems = categoryOptions.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setActionState(EMPTY_ACTION_STATE);
    }
  }

  async function handleAction(formData: FormData) {
    const result = await formAction(EMPTY_ACTION_STATE, formData);

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
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit sub-category" : "New sub-category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Rename this sub-category or move it to another category."
              : "Add a sub-category to this category."}
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
            maxLength={120}
            defaultValue={actionState.payload?.name ?? subCategory?.name}
            actionState={actionState}
          />

          {subCategory ? (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Slug</span>
              <p className="text-sm text-muted-foreground">
                {subCategory.slug}
              </p>
            </div>
          ) : null}

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor={`category-${subCategory?.id}`}>Category</Label>
              <Select
                items={selectItems}
                name="categoryId"
                defaultValue={categoryId}
              >
                <SelectTrigger
                  id={`category-${subCategory?.id}`}
                  className="w-full"
                  aria-invalid={Boolean(
                    actionState.fieldErrors.categoryId?.length,
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError name="categoryId" actionState={actionState} />
            </div>
          ) : (
            <FormControl
              type="hidden"
              label=""
              name="categoryId"
              value={categoryId}
            />
          )}

          <DialogFooter>
            <SubmitButton
              label={isEditing ? "Save changes" : "Create sub-category"}
              icon={
                isEditing ? (
                  <LucidePencil aria-hidden="true" />
                ) : (
                  <LucidePlus aria-hidden="true" />
                )
              }
            />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
