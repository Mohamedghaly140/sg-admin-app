export type SubCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageId: string | null;
  imageUrl: string | null;
  createdAt: string;
  subCategories: SubCategory[];
};
