import ProductFormFeature from "@/features/products/product-form-feature";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return <ProductFormFeature productId={id} />;
}
