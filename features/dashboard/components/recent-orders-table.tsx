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
import { formatDateTime, formatEGP } from "@/lib/format";

import type {
  DashboardOrderStatus,
  DashboardRecentOrder,
} from "../types";

type RecentOrdersTableProps = {
  orders: DashboardRecentOrder[];
};

const statusVariants: Record<
  DashboardOrderStatus,
  "default" | "destructive" | "outline" | "secondary"
> = {
  PENDING: "outline",
  PROCESSING: "secondary",
  SHIPPED: "secondary",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "outline",
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>
          <h2>Recent orders</h2>
        </CardTitle>
      </CardHeader>
      {orders.length > 0 ? (
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-44">Created</TableHead>
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
                  <TableCell>{order.customerName || "Guest"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{formatEGP(order.totalOrderPrice)}</TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent>
          <EmptyState
            icon={<LucideShoppingCart className="size-5" aria-hidden="true" />}
            title="No recent orders"
            description="New orders will appear here."
          />
        </CardContent>
      )}
    </Card>
  );
}
