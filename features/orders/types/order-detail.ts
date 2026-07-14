import type { OrderStatus, PaymentMethod } from "./order";

export type OrderDetailProduct = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export type OrderDetailItem = {
  productId: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  color: string;
  size: string;
  price: string;
  lineTotal: string;
  product: OrderDetailProduct;
};

export type OrderCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type OrderShippingAddress = {
  id: string;
  alias: string;
  country: string;
  governorate: string;
  city: string;
  area: string;
  phone: string;
  addressLine1: string;
  details: string | null;
  postalCode: number;
  latitude: number;
  longitude: number;
  isDefault: boolean;
};

export type OrderCoupon = {
  name: string;
  discount: string;
};

export type OrderDetail = {
  id: string;
  humanOrderId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  createdAt: string;
  items: OrderDetailItem[];
  itemsSubtotal: string;
  discountApplied: string;
  shippingFees: string;
  totalOrderPrice: string;
  user: OrderCustomer | null;
  shippingAddress: OrderShippingAddress | null;
  anonName: string | null;
  anonPhone: string | null;
  anonEmail: string | null;
  anonCountry: string | null;
  anonGovernorate: string | null;
  anonCity: string | null;
  anonArea: string | null;
  anonShippingPhone: string | null;
  anonAddressLine1: string | null;
  anonDetails: string | null;
  anonPostalCode: number | null;
  anonLatitude: number | null;
  anonLongitude: number | null;
  coupon: OrderCoupon | null;
  geideaSessionId: string | null;
  geideaOrderId: string | null;
};
