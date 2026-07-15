import { LucidePackageSearch } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEGP } from "@/lib/format";

import type { ProductsAnalytics } from "../types";

type TopProductsTableProps = {
  products: ProductsAnalytics["topProducts"];
};

export function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Top products</h2>
        </CardTitle>
      </CardHeader>
      {products.length > 0 ? (
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.sold.toLocaleString("en-EG")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatEGP(product.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent>
          <EmptyState
            icon={
              <LucidePackageSearch className="size-5" aria-hidden="true" />
            }
            title="No top products"
            description="Product performance for this range will appear here."
          />
        </CardContent>
      )}
    </Card>
  );
}
