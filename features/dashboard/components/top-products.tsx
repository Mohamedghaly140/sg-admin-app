import { LucidePackageOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cldUrl, formatEGP } from "@/lib/format";

import type { DashboardTopProduct } from "../types";

type TopProductsProps = {
  products: DashboardTopProduct[];
};

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Top products</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <ul className="flex flex-col divide-y">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Image
                  src={cldUrl(product.imageUrl, {
                    width: 48,
                    height: 48,
                    crop: "fill",
                    quality: "auto",
                    format: "auto",
                  })}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.id}`}
                    className="block truncate font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {product.categoryName}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm font-medium tabular-nums">
                    {formatEGP(product.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.units.toLocaleString("en-EG")} units
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<LucidePackageOpen className="size-5" aria-hidden="true" />}
            title="No top products"
            description="Product performance will appear here."
          />
        )}
      </CardContent>
    </Card>
  );
}
