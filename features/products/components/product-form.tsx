"use client";

import { LucidePackagePlus, LucideSave } from "lucide-react";
import { useRef, useState } from "react";

import FieldError from "@/components/shared/form/field-error";
import Form from "@/components/shared/form/form";
import {
  EMPTY_ACTION_STATE,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import FormControl from "@/components/shared/form-control";
import ImageUploader from "@/components/shared/image-uploader";
import type { ImageUploaderHandle } from "@/components/shared/image-uploader/types";
import SubmitButton from "@/components/shared/submit-button";
import TagInput from "@/components/shared/tag-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatEGP } from "@/lib/format";

import { createProduct } from "../actions/create-product";
import { updateProduct } from "../actions/update-product";
import { productStatusValues } from "../hooks/use-products-params";
import type { ProductForm as ProductFormType, ProductFormData } from "../types";
import { ProductSubCategoriesSelect } from "./product-sub-categories-select";

type ProductFormProps = {
  formData: ProductFormData;
  product?: ProductFormType;
  readOnly?: {
    sold: number;
    ratingsAverage: string | null;
    ratingsQuantity: number;
  };
};

export function ProductForm({
  formData,
  product,
  readOnly,
}: ProductFormProps) {
  const uploaderRef = useRef<ImageUploaderHandle>(null);
  const formAction = product
    ? updateProduct.bind(null, product.id)
    : createProduct;
  const [actionState, setActionState] =
    useState<ActionState>(EMPTY_ACTION_STATE);
  const [categoryId, setCategoryId] = useState(
    getPayloadValue(actionState.payload?.categoryId) ?? product?.categoryId ?? "",
  );
  const isEditing = Boolean(product);
  const featured = getFeaturedDefault(actionState.payload?.featured, product);

  async function handleAction(submittedFormData: FormData) {
    const result = await uploaderRef.current?.uploadPendingFile();
    if (result?.ok === false) {
      return;
    }
    if (result?.image) {
      submittedFormData.set("imageId", result.image.imageId);
      submittedFormData.set("imageUrl", result.image.imageUrl);
    }
    const nextState = await formAction(
      EMPTY_ACTION_STATE,
      submittedFormData,
    );
    setActionState(nextState);
  }

  function handleCategoryChange(value: unknown) {
    setCategoryId(typeof value === "string" ? value : "");
  }

  return (
    <Form action={handleAction} actionState={actionState} className="gap-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic information</CardTitle>
              <CardDescription>
                Name and describe the product shown to shoppers.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormControl
                label="Name"
                name="name"
                required
                maxLength={120}
                defaultValue={actionState.payload?.name ?? product?.name}
                actionState={actionState}
              />

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  maxLength={5000}
                  rows={8}
                  defaultValue={
                    actionState.payload?.description ?? product?.description
                  }
                  aria-invalid={Boolean(
                    actionState.fieldErrors.description?.length,
                  )}
                />
                <FieldError name="description" actionState={actionState} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & inventory</CardTitle>
              <CardDescription>
                Set customer pricing and available stock.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <FormControl
                label="Price"
                name="price"
                type="number"
                required
                step="0.01"
                min="0.01"
                defaultValue={actionState.payload?.price ?? product?.price}
                actionState={actionState}
              />
              <FormControl
                label="Discount"
                name="discount"
                type="number"
                step="0.01"
                min="0"
                max="70"
                defaultValue={
                  actionState.payload?.discount ?? product?.discount
                }
                actionState={actionState}
              />
              <FormControl
                label="Quantity"
                name="quantity"
                type="number"
                required
                step="1"
                min="0"
                defaultValue={
                  actionState.payload?.quantity ?? product?.quantity
                }
                actionState={actionState}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
              <CardDescription>
                Add the sizes and colors customers can choose.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TagInput
                name="sizes"
                label="Sizes"
                defaultValue={actionState.payload?.sizes ?? product?.sizes}
                placeholder="Add size"
                actionState={actionState}
              />
              <TagInput
                name="colors"
                label="Colors"
                defaultValue={actionState.payload?.colors ?? product?.colors}
                placeholder="Add color"
                actionState={actionState}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
              <CardDescription>
                Place the product in the correct category and sub-categories.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  items={formData.categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                  name="categoryId"
                  defaultValue={
                    getPayloadValue(actionState.payload?.categoryId) ??
                    product?.categoryId ??
                    ""
                  }
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger
                    id="categoryId"
                    className="w-full"
                    aria-invalid={Boolean(
                      actionState.fieldErrors.categoryId?.length,
                    )}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {formData.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError name="categoryId" actionState={actionState} />
              </div>

              <ProductSubCategoriesSelect
                subCategories={formData.subCategories}
                categoryId={categoryId}
                defaultValue={
                  actionState.payload?.subCategoryIds ?? product?.subCategoryIds
                }
                actionState={actionState}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Cover image</CardTitle>
              <CardDescription>
                Upload the primary image shown for this product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                ref={uploaderRef}
                folder="products"
                imageIdName="imageId"
                imageUrlName="imageUrl"
                defaultImageId={product?.imageId}
                defaultImageUrl={product?.imageUrl}
                label="Cover image"
                allowRemove={!product?.imageUrl}
              />
              <FieldError name="imageId" actionState={actionState} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
              <CardDescription>
                Control publication state and featured placement.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  items={productStatusValues.map((status) => ({
                    label: status,
                    value: status,
                  }))}
                  name="status"
                  defaultValue={
                    getPayloadValue(actionState.payload?.status) ??
                    product?.status ??
                    "DRAFT"
                  }
                >
                  <SelectTrigger
                    id="status"
                    className="w-full"
                    aria-invalid={Boolean(
                      actionState.fieldErrors.status?.length,
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {productStatusValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError name="status" actionState={actionState} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight this product in featured placements.
                  </p>
                </div>
                <Switch
                  id="featured"
                  name="featured"
                  value="true"
                  defaultChecked={featured}
                />
              </div>
            </CardContent>
          </Card>

          {product ? (
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>
                  Read-only values managed by the backend.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <ReadOnlyField label="Slug" value={product.slug} />
                <ReadOnlyField
                  label="Price after discount"
                  value={formatEGP(product.priceAfterDiscount)}
                />
                {readOnly ? (
                  <>
                    <ReadOnlyField label="Sold" value={String(readOnly.sold)} />
                    <ReadOnlyField
                      label="Rating"
                      value={
                        readOnly.ratingsAverage
                          ? `${readOnly.ratingsAverage} (${readOnly.ratingsQuantity})`
                          : "No ratings yet"
                      }
                    />
                  </>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>

      <div className="flex justify-end">
        <SubmitButton
          label={isEditing ? "Save changes" : "Create product"}
          icon={
            isEditing ? (
              <LucideSave aria-hidden="true" />
            ) : (
              <LucidePackagePlus aria-hidden="true" />
            )
          }
        />
      </div>
    </Form>
  );
}

type ReadOnlyFieldProps = {
  label: string;
  value: string;
};

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

function getPayloadValue(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function getFeaturedDefault(
  value: string | string[] | undefined,
  product?: ProductFormType,
): boolean {
  if (value !== undefined) {
    return getPayloadValue(value) === "true" || getPayloadValue(value) === "on";
  }
  return product?.featured ?? false;
}
