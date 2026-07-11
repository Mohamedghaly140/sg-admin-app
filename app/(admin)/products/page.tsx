import ProductsFeature from "@/features/products";
import { loadProductsParams } from "@/features/products/hooks/use-products-params";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await loadProductsParams.parse(searchParams);

  return <ProductsFeature searchParams={params} />;
}
