"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { LucideGripVertical, LucideTrash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { cldUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { ProductFormImage } from "../types";

type ProductGalleryItemProps = {
  image: ProductFormImage;
  disabled?: boolean;
  onDelete: (imageRowId: string) => Promise<void>;
};

export function ProductGalleryItem({
  image,
  disabled = false,
  onDelete,
}: ProductGalleryItemProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id, disabled });

  function handleConfirm() {
    startTransition(async () => {
      await onDelete(image.id);
      setOpen(false);
    });
  }

  return (
    <>
      <div
        ref={setNodeRef}
        className={cn(
          "group relative overflow-hidden rounded-md border bg-background",
          isDragging && "z-10 opacity-70 shadow-md",
        )}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        <div className="relative aspect-square bg-muted">
          <Image
            src={cldUrl(image.imageUrl, {
              width: 360,
              height: 360,
              crop: "fill",
              quality: "auto",
              format: "auto",
            })}
            alt="Product gallery image"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/55 to-transparent p-2">
          <Button
            ref={setActivatorNodeRef}
            type="button"
            variant="secondary"
            size="icon-sm"
            className="bg-background/90"
            disabled={disabled || isPending}
            aria-label="Drag gallery image"
            {...attributes}
            {...listeners}
          >
            <LucideGripVertical aria-hidden="true" />
          </Button>
          <Button
            ref={deleteButtonRef}
            type="button"
            variant="destructive"
            size="icon-sm"
            className="bg-background/90"
            disabled={disabled || isPending}
            onClick={() => setOpen(true)}
            aria-label="Delete gallery image"
          >
            <LucideTrash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete gallery image?"
        description="This removes the image from the product gallery and destroys the asset server-side."
        confirmLabel={isPending ? "Deleting..." : "Delete image"}
        pending={isPending}
        finalFocus={deleteButtonRef}
        onConfirm={handleConfirm}
      />
    </>
  );
}
