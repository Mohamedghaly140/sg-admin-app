import { LucidePackageX } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DashboardLowStockProduct } from "../types";

type LowStockListProps = {
  products: DashboardLowStockProduct[];
};

export function LowStockList({ products }: LowStockListProps) {
  const sortedProducts = [...products].sort(
    (left, right) => left.quantity - right.quantity,
  );

  return (
    <Card id="low-stock" className="scroll-mt-4">
      <CardHeader>
        <CardTitle>
          <h2>Low-stock products</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedProducts.length > 0 ? (
          <ul className="grid gap-x-6 md:grid-cols-2">
            {sortedProducts.map((product) => {
              const isCritical = product.quantity <= 2;

              return (
                <li
                  key={product.id}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-md border-b px-2 py-3",
                    isCritical && "bg-destructive/5",
                  )}
                >
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.categoryName} · {product.status}
                    </p>
                  </div>
                  <Badge variant={isCritical ? "destructive" : "warning"}>
                    {product.quantity.toLocaleString("en-EG")} left
                  </Badge>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={<LucidePackageX className="size-5" aria-hidden="true" />}
            title="Stock levels look good"
            description="There are no low-stock products."
          />
        )}
      </CardContent>
    </Card>
  );
}
