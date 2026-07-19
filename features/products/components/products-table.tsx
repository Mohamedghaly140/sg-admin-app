import type { VariantProps } from "class-variance-authority";

import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatEGP } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { Product, ProductStatus } from "../types";
import { ProductRowActions } from "./product-row-actions";
import { ProductThumbnail } from "./product-thumbnail";
import { ToggleProductFeaturedButton } from "./toggle-product-featured-button";

type ProductsTableProps = {
  products: Product[];
};

const statusVariants: Record<
  ProductStatus,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  DRAFT: "outline",
  ACTIVE: "success",
  ARCHIVED: "secondary",
};

const statusLabels: Record<ProductStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="w-36">Created</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <ProductThumbnail
                  imageUrl={product.imageUrl}
                  name={product.name}
                />
              </TableCell>
              <TableCell>
                <div className="flex min-w-44 flex-col gap-1">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {product.slug}
                  </span>
                </div>
              </TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>
                {Number(product.discount) > 0 ? (
                  <div className="flex items-center gap-2">
                    <span>{formatEGP(product.priceAfterDiscount)}</span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatEGP(product.price)}
                    </span>
                  </div>
                ) : (
                  formatEGP(product.priceAfterDiscount)
                )}
              </TableCell>
              <TableCell
                className={cn(product.quantity < 10 && "text-destructive")}
              >
                {product.quantity}
              </TableCell>
              <TableCell>{product.sold}</TableCell>
              <TableCell>
                <Badge variant={statusVariants[product.status]}>
                  {statusLabels[product.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <ToggleProductFeaturedButton
                  productId={product.id}
                  productName={product.name}
                  featured={product.featured}
                />
              </TableCell>
              <TableCell>{formatDate(product.createdAt)}</TableCell>
              <TableCell>
                <ProductRowActions product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
