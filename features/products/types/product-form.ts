import type { ProductStatus } from "./product";

export type ProductFormImage = {
  id: string;
  imageId: string;
  imageUrl: string;
  sortOrder: number;
};

export type ProductForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount: string;
  priceAfterDiscount: string;
  quantity: number;
  sizes: string[];
  colors: string[];
  imageId: string;
  imageUrl: string;
  status: ProductStatus;
  featured: boolean;
  categoryId: string;
  subCategoryIds: string[];
  images: ProductFormImage[];
};
