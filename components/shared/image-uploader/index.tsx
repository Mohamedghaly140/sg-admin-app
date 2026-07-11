"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LucideImagePlus, LucideX } from "lucide-react";

import FormControl from "@/components/shared/form-control";
import Spinner from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { cldUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { ImageUploaderProps } from "./types";
import { useImageUpload } from "./use-image-upload";

export default function ImageUploader({
  folder,
  imageIdName,
  imageUrlName,
  defaultImageId,
  defaultImageUrl,
  label = "Image",
  disabled = false,
  allowRemove = true,
  onUploadingChange,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { state, selectFile, retry, remove, hasPendingFile } = useImageUpload({
    folder,
    defaultImageId,
    defaultImageUrl,
  });
  const isUploading = state.status === "uploading";

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  return (
    <div className="space-y-3">
      <FormControl
        type="hidden"
        name={imageIdName}
        label=""
        value={state.imageId ?? ""}
      />
      <FormControl
        type="hidden"
        name={imageUrlName}
        label=""
        value={state.imageUrl ?? ""}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">{label}</span>
        <div
          className={cn(
            "relative flex min-h-40 flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-muted/30 p-4 text-center transition-colors",
            !disabled && "hover:bg-muted/50",
          )}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (!disabled && file) {
              void selectFile(file);
            }
          }}
        >
          {state.previewUrl ? (
            <div className="relative h-40 w-full overflow-hidden rounded-md bg-background">
              {state.previewUrl.startsWith("blob:") ? (
                // next/image cannot load blob: URLs while a local file is uploading.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={state.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={cldUrl(state.previewUrl, {
                    width: 640,
                    height: 320,
                    crop: "fill",
                    quality: "auto",
                    format: "auto",
                  })}
                  alt=""
                  width={640}
                  height={320}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <LucideImagePlus className="size-8" aria-hidden="true" />
              <span className="text-sm">Drop an image here or choose a file</span>
            </div>
          )}

          {state.previewUrl && allowRemove ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="absolute right-2 top-2 bg-background/90"
              onClick={remove}
              disabled={disabled}
              aria-label="Remove image"
            >
              <LucideX aria-hidden="true" />
            </Button>
          ) : null}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void selectFile(file);
                event.target.value = "";
              }
            }}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
          >
            <LucideImagePlus aria-hidden="true" />
            Choose image
          </Button>
        </div>
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
              disabled={disabled}
            >
              Try again
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
