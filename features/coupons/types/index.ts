export type Coupon = {
  id: string;
  name: string;
  discount: string;
  usedCount: number;
  maxUsage: number;
  perUserLimit: number;
  expire: string;
  isActive: boolean;
  createdAt: string;
};
