export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: string;
  discount: string;
  priceAfterDiscount: string;
  ratingsAverage: string;
  ratingsQuantity: number;
  featured: boolean;
  sizes: string[];
  colors: string[];
  quantity: number;
  sold: number;
  status: ProductStatus;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
};
