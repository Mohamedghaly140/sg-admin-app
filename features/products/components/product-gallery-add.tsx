"use client";

import { LucideImagePlus, LucidePlus, LucideX } from "lucide-react";
import Image from "next/image";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import Spinner from "@/components/shared/spinner";
import { useImageUpload } from "@/components/shared/image-uploader/use-image-upload";
import { Button } from "@/components/ui/button";
import { cldUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductGalleryAddProps = {
  disabled?: boolean;
  onAdd: (image: { imageId: string; imageUrl: string }) => Promise<void>;
};

export function ProductGalleryAdd({
  disabled = false,
  onAdd,
}: ProductGalleryAddProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    state,
    selectFile,
    uploadPendingFile,
    retry,
    remove,
    hasPendingFile,
  } = useImageUpload({ folder: "products" });
  const isUploading = state.status === "uploading";
  const isDisabled = disabled || isPending || isUploading;

  function handleAdd() {
    startTransition(async () => {
      const result = await uploadPendingFile();
      if (!result.ok) {
        return;
      }
      if (!result.image) {
        toast.error("Choose an image before adding it to the gallery.");
        return;
      }
      await onAdd(result.image);
      remove();
    });
  }

  return (
    <div
      className={cn(
        "relative flex min-h-56 flex-col justify-between gap-3 rounded-md border border-dashed bg-muted/30 p-3 transition-colors",
        !isDisabled && "hover:bg-muted/50",
      )}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!isDisabled && file) {
          selectFile(file);
        }
      }}
    >
      <div className="flex min-h-36 flex-1 items-center justify-center overflow-hidden rounded-md bg-background text-center">
        {state.previewUrl ? (
          state.previewUrl.startsWith("blob:") ? (
            // next/image cannot load blob: URLs while a local file is pending.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={state.previewUrl}
              alt=""
              className="h-full min-h-36 w-full object-cover"
            />
          ) : (
            <Image
              src={cldUrl(state.previewUrl, {
                width: 360,
                height: 360,
                crop: "fill",
                quality: "auto",
                format: "auto",
              })}
              alt=""
              width={360}
              height={360}
              className="h-full min-h-36 w-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-2 px-3 text-muted-foreground">
            <LucideImagePlus className="size-8" aria-hidden="true" />
            <span className="text-sm">Drop an image here or choose a file</span>
          </div>
        )}
      </div>

      {state.previewUrl ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="absolute right-5 top-5 bg-background/90"
          disabled={isDisabled}
          onClick={remove}
          aria-label="Remove selected image"
        >
          <LucideX aria-hidden="true" />
        </Button>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={isDisabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            selectFile(file);
            event.target.value = "";
          }
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled}
        >
          <LucideImagePlus aria-hidden="true" />
          Choose
        </Button>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={isDisabled || !hasPendingFile}
        >
          <LucidePlus aria-hidden="true" />
          Add to gallery
        </Button>
      </div>

      {isUploading ? (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            <span>{state.progress}% uploaded</span>
          </div>
        </div>
      ) : null}

      {state.status === "error" && state.errorMessage ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-red-500">
          <span>{state.errorMessage}</span>
          {hasPendingFile ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto px-0 text-red-500"
              onClick={() => {
                void retry();
              }}
              disabled={isDisabled}
            >
              Try again
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
