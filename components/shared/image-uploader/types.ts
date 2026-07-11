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

export type ImageUploaderProps = {
  folder: UploadFolder;
  imageIdName: string;
  imageUrlName: string;
  defaultImageId?: string | null;
  defaultImageUrl?: string | null;
  label?: string;
  disabled?: boolean;
  allowRemove?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

export type UploadSignatureResult =
  | { ok: true; data: UploadSignature }
  | { ok: false; message: string };
