import { handleAuthError } from "@/lib/api/handle-auth-error";

import { ProductGallery } from "./components/product-gallery";
import { ProductForm } from "./components/product-form";
import { getProduct } from "./queries/get-product";
import { getProductForm } from "./queries/get-product-form";
import { getProductFormData } from "./queries/get-product-form-data";

type ProductFormFeatureProps = {
  productId?: string;
};

export default async function ProductFormFeature({
  productId,
}: ProductFormFeatureProps) {
  let result: [
    Awaited<ReturnType<typeof getProductFormData>>,
    Awaited<ReturnType<typeof getProductForm>> | null,
    Awaited<ReturnType<typeof getProduct>> | null,
  ];

  try {
    result = await Promise.all([
      getProductFormData(),
      productId ? getProductForm(productId) : Promise.resolve(null),
      productId ? getProduct(productId) : Promise.resolve(null),
    ]);
  } catch (error) {
    handleAuthError(error);
  }

  const [{ data: formData }, formResult, detailResult] = result;
  const product = formResult?.data;
  const detail = detailResult?.data;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-medium">
          {product ? "Edit product" : "New product"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {product
            ? "Update product inventory, pricing, and availability."
            : "Create a product with pricing, stock, category, and cover image."}
        </p>
      </div>

      <ProductForm
        formData={formData}
        product={product}
        readOnly={
          detail
            ? {
                sold: detail.sold,
                ratingsAverage: detail.ratingsAverage,
                ratingsQuantity: detail.ratingsQuantity,
              }
            : undefined
        }
      />

      {product ? (
        <ProductGallery productId={product.id} images={product.images} />
      ) : null}
    </section>
  );
}
