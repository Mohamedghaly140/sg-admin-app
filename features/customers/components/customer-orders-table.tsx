import { LucideShoppingCart } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
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
import { formatDate, formatEGP } from "@/lib/format";

import type { CustomerOrder } from "../types";

type CustomerOrdersTableProps = {
  orders: CustomerOrder[];
};

export function CustomerOrdersTable({ orders }: CustomerOrdersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Order history</h2>
        </CardTitle>
      </CardHeader>
      {orders.length > 0 ? (
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-36">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      {order.humanOrderId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.isPaid ? "default" : "outline"}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatEGP(order.totalOrderPrice)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent>
          <EmptyState
            icon={<LucideShoppingCart className="size-5" aria-hidden="true" />}
            title="No orders found"
            description="This customer has not placed an order yet."
          />
        </CardContent>
      )}
    </Card>
  );
}
