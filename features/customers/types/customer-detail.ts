export type CustomerOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type CustomerOrderPaymentMethod = "CASH" | "CARD";

export type CustomerAddress = {
  id: string;
  alias: string;
  country: string;
  governorate: string;
  city: string;
  area: string;
  phone: string;
  details: string | null;
  postalCode: number;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;
};

export type CustomerOrder = {
  id: string;
  humanOrderId: string;
  status: CustomerOrderStatus;
  paymentMethod: CustomerOrderPaymentMethod;
  totalOrderPrice: string;
  isPaid: boolean;
  createdAt: string;
  itemsCount: number;
};

export type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  role: "USER";
  createdAt: string;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
};
