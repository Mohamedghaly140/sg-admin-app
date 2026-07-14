import Image from "next/image";
import Link from "next/link";
import { LucideImageOff } from "lucide-react";

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
import { cldUrl, formatEGP } from "@/lib/format";

import type { OrderDetailItem } from "../types";

type OrderItemsTableProps = {
  items: OrderDetailItem[];
};

type OrderItemThumbnailProps = {
  imageUrl: string | null;
  name: string;
};

export function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Order items</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit price</TableHead>
              <TableHead>Line total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={`${item.productId}-${item.color}-${item.size}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <OrderItemThumbnail
                      imageUrl={item.imageUrl}
                      name={item.name}
                    />
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatEGP(item.price)}</TableCell>
                <TableCell>{formatEGP(item.lineTotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OrderItemThumbnail({
  imageUrl,
  name,
}: OrderItemThumbnailProps) {
  if (!imageUrl) {
    return (
      <div className="flex size-16 items-center justify-center rounded-md border bg-muted text-muted-foreground">
        <LucideImageOff className="size-5" aria-hidden="true" />
        <span className="sr-only">No image for {name}</span>
      </div>
    );
  }

  return (
    <Image
      src={cldUrl(imageUrl, {
        width: 64,
        height: 64,
        crop: "fill",
        quality: "auto",
        format: "auto",
      })}
      alt={name}
      width={64}
      height={64}
      className="size-16 rounded-md object-cover"
    />
  );
}
