"use client";

import { LucideImagePlus, LucidePencil } from "lucide-react";
import { useActionState, useRef, useState, type ReactElement } from "react";

import Form from "@/components/shared/form/form";
import { EMPTY_ACTION_STATE } from "@/components/shared/form/utils/to-action-state";
import FormControl from "@/components/shared/form-control";
import ImageUploader from "@/components/shared/image-uploader";
import type { ImageUploaderHandle } from "@/components/shared/image-uploader/types";
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

import { createCategory } from "../actions/create-category";
import { updateCategory } from "../actions/update-category";
import type { Category } from "../types";

type CategoryFormDialogProps = {
  trigger: ReactElement;
  category?: Category;
};

export function CategoryFormDialog({
  trigger,
  category,
}: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const uploaderRef = useRef<ImageUploaderHandle>(null);
  const formAction = category
    ? updateCategory.bind(null, category.id)
    : createCategory;
  const [actionState, action] = useActionState(
    formAction,
    EMPTY_ACTION_STATE,
  );
  const isEditing = Boolean(category);

  function handleSuccess() {
    setOpen(false);
  }

  async function handleSubmit(formData: FormData) {
    const result = await uploaderRef.current?.uploadPendingFile();
    if (result?.ok === false) {
      return;
    }
    if (result?.image) {
      formData.set("imageId", result.image.imageId);
      formData.set("imageUrl", result.image.imageUrl);
    }
    action(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit category" : "New category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category name or cover image."
              : "Create a category with an optional cover image."}
          </DialogDescription>
        </DialogHeader>

        <Form
          action={handleSubmit}
          actionState={actionState}
          onSuccess={handleSuccess}
        >
          <FormControl
            label="Name"
            name="name"
            required
            maxLength={120}
            defaultValue={actionState.payload?.name ?? category?.name}
            actionState={actionState}
          />

          {category ? (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Slug</span>
              <p className="text-sm text-muted-foreground">{category.slug}</p>
            </div>
          ) : null}

          <ImageUploader
            ref={uploaderRef}
            folder="categories"
            imageIdName="imageId"
            imageUrlName="imageUrl"
            defaultImageId={category?.imageId}
            defaultImageUrl={category?.imageUrl}
            allowRemove={!category?.imageUrl}
          />

          <DialogFooter>
            <SubmitButton
              label={isEditing ? "Save changes" : "Create category"}
              icon={
                isEditing ? (
                  <LucidePencil aria-hidden="true" />
                ) : (
                  <LucideImagePlus aria-hidden="true" />
                )
              }
            />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
