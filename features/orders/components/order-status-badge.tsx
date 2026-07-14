import { Badge } from "@/components/ui/badge";

import type { OrderStatus } from "../types";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusVariants: Record<
  OrderStatus,
  "outline" | "default" | "secondary" | "destructive"
> = {
  PENDING: "outline",
  PROCESSING: "secondary",
  SHIPPED: "secondary",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "outline",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={statusVariants[status]}>{status}</Badge>;
}
