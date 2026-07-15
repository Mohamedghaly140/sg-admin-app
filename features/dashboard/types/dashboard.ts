export const DashboardOrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type DashboardOrderStatus =
  (typeof DashboardOrderStatus)[keyof typeof DashboardOrderStatus];

export const DASHBOARD_ORDER_STATUSES = Object.values(DashboardOrderStatus);

export type DashboardMetricPair = {
  current: number;
  previous: number;
};

export type DashboardOrderStatusCount = {
  status: DashboardOrderStatus;
  count: number;
};

export type DashboardRevenueByDay = {
  date: string;
  revenue: number;
};

export type DashboardRecentOrder = {
  id: string;
  humanOrderId: string;
  customerName: string;
  status: DashboardOrderStatus;
  paymentMethod: string;
  totalOrderPrice: number;
  createdAt: string;
};

export type DashboardTopProduct = {
  id: string;
  name: string;
  imageUrl: string;
  categoryName: string;
  revenue: number;
  units: number;
};

export type DashboardLowStockProduct = {
  id: string;
  name: string;
  quantity: number;
  categoryName: string;
  status: string;
};

export type DashboardMetrics = {
  revenue: DashboardMetricPair;
  orders: DashboardMetricPair;
  newCustomers: DashboardMetricPair;
  avgOrderValue: DashboardMetricPair;
  pendingOrders: number;
  lowStockCount: number;
  activeCoupons: number;
  ordersByStatus: DashboardOrderStatusCount[];
  revenueByDay: DashboardRevenueByDay[];
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
  lowStockProducts: DashboardLowStockProduct[];
};
