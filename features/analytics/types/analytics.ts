export const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMethod = {
  CASH: "CASH",
  CARD: "CARD",
} as const;

export type PaymentMethod =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];

export type AnalyticsGrouping = "day" | "week" | "month";

export type SalesAnalytics = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalDiscountApplied: number;
  grouping: AnalyticsGrouping;
  revenueOverTime: {
    date: string;
    revenue: number;
  }[];
  ordersByStatus: {
    status: OrderStatus;
    count: number;
  }[];
  paymentMethodSplit: {
    method: PaymentMethod;
    count: number;
  }[];
};

export type ProductsAnalytics = {
  totalUnitsSold: number;
  activeProductsCount: number;
  outOfStockCount: number;
  topProducts: {
    id: string;
    name: string;
    categoryName: string;
    sold: number;
    revenue: number;
  }[];
  revenueByCategory: {
    name: string;
    revenue: number;
  }[];
};

export type CustomersAnalytics = {
  totalCustomers: number;
  newThisPeriod: number;
  activeThisPeriod: number;
  grouping: AnalyticsGrouping;
  newCustomersOverTime: {
    date: string;
    count: number;
  }[];
  topSpenders: {
    id: string;
    name: string;
    email: string;
    ordersCount: number;
    totalSpent: number;
  }[];
};

export type CouponsAnalytics = {
  totalCoupons: number;
  totalRedemptions: number;
  totalDiscountGiven: number;
  coupons: {
    id: string;
    name: string;
    discountPct: number;
    usedCount: number;
    maxUsage: number;
    expire: string;
    periodRedemptions: number;
    totalDiscountGiven: number;
  }[];
};

export type GeographyAnalytics = {
  rows: {
    governorate: string;
    orderCount: number;
    revenue: number;
  }[];
};
