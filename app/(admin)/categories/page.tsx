import CategoriesFeature from "@/features/categories";
import { loadCategoriesParams } from "@/features/categories/hooks/use-categories-params";

type CategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await loadCategoriesParams.parse(searchParams);

  return <CategoriesFeature searchParams={params} />;
}
