import type { ProductCategoryOption } from "../queries/get-product-filter-options";

export type ProductSubCategoryOption = {
  id: string;
  name: string;
  categoryId: string;
};

export type ProductFormData = {
  categories: ProductCategoryOption[];
  subCategories: ProductSubCategoryOption[];
};
