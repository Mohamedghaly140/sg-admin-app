import { Badge } from "@/components/ui/badge";

import type { Coupon } from "../types";

export type CouponStatus =
  | "active"
  | "expired"
  | "exhausted"
  | "deactivated";

type BadgeVariant = "outline" | "default" | "secondary" | "destructive";

type CouponStatusBadgeProps = {
  coupon: Coupon;
};

const statusVariants: Record<CouponStatus, BadgeVariant> = {
  active: "default",
  expired: "destructive",
  exhausted: "secondary",
  deactivated: "outline",
};

const statusLabels: Record<CouponStatus, string> = {
  active: "Active",
  expired: "Expired",
  exhausted: "Exhausted",
  deactivated: "Deactivated",
};

export function getCouponStatus(coupon: Coupon): CouponStatus {
  if (!coupon.isActive) {
    return "deactivated";
  }
  if (new Date(coupon.expire).getTime() <= Date.now()) {
    return "expired";
  }
  if (coupon.maxUsage > 0 && coupon.usedCount >= coupon.maxUsage) {
    return "exhausted";
  }
  return "active";
}

export function CouponStatusBadge({ coupon }: CouponStatusBadgeProps) {
  const status = getCouponStatus(coupon);

  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}
