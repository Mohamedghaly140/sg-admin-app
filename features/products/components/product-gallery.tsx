"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { addProductImage } from "../actions/add-product-image";
import { deleteProductImage } from "../actions/delete-product-image";
import { reorderProductImages } from "../actions/reorder-product-images";
import type { ProductFormImage } from "../types";
import { ProductGalleryAdd } from "./product-gallery-add";
import { ProductGalleryItem } from "./product-gallery-item";

type ProductGalleryProps = {
  productId: string;
  images: ProductFormImage[];
};

type ProductGalleryImageInput = {
  imageId: string;
  imageUrl: string;
};

export function ProductGallery({ productId, images }: ProductGalleryProps) {
  const [optimisticImages, setOptimisticImages] = useOptimistic(images);
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = optimisticImages.findIndex(
      (image) => image.id === active.id,
    );
    const newIndex = optimisticImages.findIndex((image) => image.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nextImages: ProductFormImage[] = arrayMove(
      optimisticImages,
      oldIndex,
      newIndex,
    );

    startTransition(async () => {
      setOptimisticImages(nextImages);
      const actionState = await reorderProductImages(
        productId,
        nextImages.map((image) => image.id),
      );
      if (actionState.status === "SUCCESS") {
        toast.success(actionState.message);
      } else {
        toast.error(actionState.message);
      }
    });
  }

  function handleAdd(image: ProductGalleryImageInput): Promise<void> {
    const sortOrder = images.length
      ? Math.max(...images.map((galleryImage) => galleryImage.sortOrder)) + 1
      : 0;
    const optimisticImage: ProductFormImage = {
      id: `pending:${image.imageId}`,
      imageId: image.imageId,
      imageUrl: image.imageUrl,
      sortOrder,
    };
    const nextImages = [...optimisticImages, optimisticImage];
    let operation = Promise.resolve();

    startTransition(() => {
      operation = (async () => {
        setOptimisticImages(nextImages);
        const actionState = await addProductImage(productId, {
          ...image,
          sortOrder,
        });
        if (actionState.status === "SUCCESS") {
          toast.success(actionState.message);
        } else {
          toast.error(actionState.message);
        }
      })();
    });

    return operation;
  }

  function handleDelete(imageRowId: string): Promise<void> {
    const nextImages = optimisticImages.filter((image) => image.id !== imageRowId);
    let operation = Promise.resolve();

    startTransition(() => {
      operation = (async () => {
        setOptimisticImages(nextImages);
        const actionState = await deleteProductImage(productId, imageRowId);
        if (actionState.status === "SUCCESS") {
          toast.success(actionState.message);
        } else {
          toast.error(actionState.message);
        }
      })();
    });

    return operation;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
        <CardDescription>
          Add product detail images, drag to reorder them, or remove outdated
          shots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={optimisticImages.map((image) => image.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {optimisticImages.map((image) => (
                <ProductGalleryItem
                  key={image.id}
                  image={image}
                  disabled={isPending}
                  onDelete={handleDelete}
                />
              ))}
              <ProductGalleryAdd disabled={isPending} onAdd={handleAdd} />
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
