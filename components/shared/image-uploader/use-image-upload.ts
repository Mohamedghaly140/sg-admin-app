"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { getUploadSignature } from "./actions/get-upload-signature";
import type { UploadedImage, UploadFolder, UploadSignature } from "./types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type UploadStatus = "idle" | "uploading" | "success" | "error";

export type ImageUploadState = {
  status: UploadStatus;
  progress: number;
  previewUrl: string | null;
  imageId: string | null;
  imageUrl: string | null;
  errorMessage: string | null;
};

type ImageUploadAction =
  | { type: "UPLOAD_START"; previewUrl: string }
  | { type: "PROGRESS"; progress: number }
  | { type: "SUCCESS"; image: UploadedImage }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };

type UseImageUploadOptions = {
  folder: UploadFolder;
  defaultImageId?: string | null;
  defaultImageUrl?: string | null;
};

type UseImageUploadResult = {
  state: ImageUploadState;
  selectFile: (file: File) => Promise<void>;
  retry: () => Promise<void>;
  remove: () => void;
  hasPendingFile: boolean;
};

export function useImageUpload({
  folder,
  defaultImageId,
  defaultImageUrl,
}: UseImageUploadOptions): UseImageUploadResult {
  const [state, dispatch] = useReducer(
    imageUploadReducer,
    createInitialState(defaultImageId, defaultImageUrl),
  );
  const pendingFileRef = useRef<File | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const activeBlobUrlRef = useRef<string | null>(null);
  const uploadIdRef = useRef(0);
  const silentAbortUploadIdsRef = useRef(new Set<number>());
  const [hasPendingFile, setHasPendingFile] = useState(false);

  const selectFile = useCallback(
    async (file: File) => {
      const validationMessage = validateImageFile(file);
      if (validationMessage) {
        pendingFileRef.current = null;
        setHasPendingFile(false);
        dispatch({ type: "ERROR", message: validationMessage });
        return;
      }

      if (xhrRef.current) {
        silentAbortUploadIdsRef.current.add(uploadIdRef.current);
        xhrRef.current.abort();
      }
      revokeBlobUrl(activeBlobUrlRef.current);

      const uploadId = uploadIdRef.current + 1;
      uploadIdRef.current = uploadId;
      const previewUrl = URL.createObjectURL(file);
      activeBlobUrlRef.current = previewUrl;
      pendingFileRef.current = file;
      setHasPendingFile(true);
      dispatch({ type: "UPLOAD_START", previewUrl });

      const signatureResult = await getUploadSignature({ folder });
      if (uploadIdRef.current !== uploadId) {
        return;
      }
      if (!signatureResult.ok) {
        dispatch({ type: "ERROR", message: signatureResult.message });
        return;
      }

      try {
        const uploadedImage = await uploadToCloudinary(
          file,
          signatureResult.data,
          (progress) => dispatch({ type: "PROGRESS", progress }),
          (xhr) => {
            xhrRef.current = xhr;
          },
        );

        if (uploadIdRef.current !== uploadId) {
          return;
        }
        revokeBlobUrl(previewUrl);
        if (activeBlobUrlRef.current === previewUrl) {
          activeBlobUrlRef.current = null;
        }
        xhrRef.current = null;
        pendingFileRef.current = null;
        setHasPendingFile(false);
        dispatch({ type: "SUCCESS", image: uploadedImage });
      } catch (error) {
        if (silentAbortUploadIdsRef.current.has(uploadId)) {
          silentAbortUploadIdsRef.current.delete(uploadId);
          return;
        }
        if (uploadIdRef.current !== uploadId) {
          return;
        }
        xhrRef.current = null;
        dispatch({
          type: "ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Upload failed. Please try again.",
        });
      }
    },
    [folder],
  );

  const retry = useCallback(async () => {
    const pendingFile = pendingFileRef.current;
    if (pendingFile) {
      await selectFile(pendingFile);
    }
  }, [selectFile]);

  const remove = useCallback(() => {
    if (xhrRef.current) {
      silentAbortUploadIdsRef.current.add(uploadIdRef.current);
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    uploadIdRef.current += 1;
    revokeBlobUrl(activeBlobUrlRef.current);
    activeBlobUrlRef.current = null;
    pendingFileRef.current = null;
    setHasPendingFile(false);
    dispatch({ type: "RESET" });
  }, []);

  useEffect(() => {
    const silentAbortUploadIds = silentAbortUploadIdsRef.current;

    return () => {
      if (xhrRef.current) {
        silentAbortUploadIds.add(uploadIdRef.current);
        xhrRef.current.abort();
      }
      uploadIdRef.current += 1;
      revokeBlobUrl(activeBlobUrlRef.current);
    };
  }, []);

  return {
    state,
    selectFile,
    retry,
    remove,
    hasPendingFile,
  };
}

function createInitialState(
  defaultImageId?: string | null,
  defaultImageUrl?: string | null,
): ImageUploadState {
  if (defaultImageId && defaultImageUrl) {
    return {
      status: "success",
      progress: 100,
      previewUrl: defaultImageUrl,
      imageId: defaultImageId,
      imageUrl: defaultImageUrl,
      errorMessage: null,
    };
  }

  return {
    status: "idle",
    progress: 0,
    previewUrl: null,
    imageId: null,
    imageUrl: null,
    errorMessage: null,
  };
}

function imageUploadReducer(
  state: ImageUploadState,
  action: ImageUploadAction,
): ImageUploadState {
  switch (action.type) {
    case "UPLOAD_START":
      return {
        ...state,
        status: "uploading",
        progress: 0,
        previewUrl: action.previewUrl,
        errorMessage: null,
      };
    case "PROGRESS":
      return {
        ...state,
        progress: action.progress,
      };
    case "SUCCESS":
      return {
        status: "success",
        progress: 100,
        previewUrl: action.image.imageUrl,
        imageId: action.image.imageId,
        imageUrl: action.image.imageUrl,
        errorMessage: null,
      };
    case "ERROR":
      return {
        ...state,
        status: "error",
        errorMessage: action.message,
      };
    case "RESET":
      return createInitialState();
  }
}

function validateImageFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return "Upload a JPG, PNG, or WebP image.";
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return "Upload a JPG, PNG, or WebP image.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}

function uploadToCloudinary(
  file: File,
  signature: UploadSignature,
  onProgress: (progress: number) => void,
  onXhr: (xhr: XMLHttpRequest) => void,
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    onXhr(xhr);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      const json = parseJson(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        const uploadedImage = toUploadedImage(json);
        if (uploadedImage) {
          resolve(uploadedImage);
          return;
        }

        reject(new Error("Upload succeeded, but Cloudinary returned an unexpected response."));
        return;
      }

      reject(new Error(getCloudinaryErrorMessage(json)));
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload."));
    };

    xhr.onabort = () => {
      reject(new Error("Upload cancelled."));
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", String(signature.timestamp));
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);
    formData.append("allowed_formats", signature.allowedFormats);

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
    );
    xhr.send(formData);
  });
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toUploadedImage(value: unknown): UploadedImage | null {
  if (!isRecord(value)) {
    return null;
  }

  const publicId = value.public_id;
  const secureUrl = value.secure_url;

  if (typeof publicId !== "string" || typeof secureUrl !== "string") {
    return null;
  }

  return {
    imageId: publicId,
    imageUrl: secureUrl,
  };
}

function getCloudinaryErrorMessage(value: unknown): string {
  if (isRecord(value) && isRecord(value.error)) {
    const message = value.error.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return "Upload failed. Please try again.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function revokeBlobUrl(value: string | null): void {
  if (value?.startsWith("blob:")) {
    URL.revokeObjectURL(value);
  }
}
