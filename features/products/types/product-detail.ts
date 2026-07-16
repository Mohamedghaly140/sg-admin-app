import type { ProductStatus } from "./product";

export type ProductDetailCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductDetailSubCategory = {
  id: string;
  name: string;
};

export type ProductDetailImage = {
  id: string;
  imageId: string;
  imageUrl: string;
  sortOrder: number;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageId: string;
  imageUrl: string;
  price: string;
  discount: string;
  priceAfterDiscount: string;
  ratingsAverage: string | null;
  ratingsQuantity: number;
  featured: boolean;
  sizes: string[];
  colors: string[];
  quantity: number;
  sold: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  category: ProductDetailCategory;
  subCategories: ProductDetailSubCategory[];
  images: ProductDetailImage[];
};
