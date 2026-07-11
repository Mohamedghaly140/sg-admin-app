import type { Ref } from "react";

export type UploadFolder = "products" | "categories";

export type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: UploadFolder;
  allowedFormats: string;
};

export type UploadedImage = {
  imageId: string;
  imageUrl: string;
};

export type UploadPendingFileResult =
  | { ok: true; image: UploadedImage | null }
  | { ok: false };

export type ImageUploaderHandle = {
  uploadPendingFile: () => Promise<UploadPendingFileResult>;
};

export type ImageUploaderProps = {
  ref?: Ref<ImageUploaderHandle>;
  folder: UploadFolder;
  imageIdName: string;
  imageUrlName: string;
  defaultImageId?: string | null;
  defaultImageUrl?: string | null;
  label?: string;
  allowRemove?: boolean;
};

export type UploadSignatureResult =
  | { ok: true; data: UploadSignature }
  | { ok: false; message: string };
