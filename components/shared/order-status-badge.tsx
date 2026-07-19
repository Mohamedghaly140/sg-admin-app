import { Badge } from "@/components/ui/badge";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const orderStatusVariant: Record<
  OrderStatus,
  "success" | "warning" | "info" | "secondary" | "outline" | "destructive"
> = {
  PENDING: "warning",
  PROCESSING: "secondary",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "outline",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant={orderStatusVariant[status]}>
      {orderStatusLabels[status]}
    </Badge>
  );
}
