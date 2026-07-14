export const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type PaymentMethod = "CASH" | "CARD";

export type Order = {
  id: string;
  humanOrderId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  totalOrderPrice: string;
  createdAt: string;
  customerName: string;
  itemsCount: number;
};
