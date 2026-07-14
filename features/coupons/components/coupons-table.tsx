import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

import type { Coupon } from "../types";
import { CouponRowActions } from "./coupon-row-actions";
import { CouponStatusBadge } from "./coupon-status-badge";
import { CouponUsageBar } from "./coupon-usage-bar";

type CouponsTableProps = {
  coupons: Coupon[];
};

export function CouponsTable({ coupons }: CouponsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-mono font-medium">
                {coupon.name}
              </TableCell>
              <TableCell>{coupon.discount}%</TableCell>
              <TableCell>
                <div className="flex min-w-40 flex-col gap-1">
                  <CouponUsageBar
                    usedCount={coupon.usedCount}
                    maxUsage={coupon.maxUsage}
                  />
                  <span className="text-xs text-muted-foreground">
                    Per user: {coupon.perUserLimit || "∞"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatDate(coupon.expire)}</TableCell>
              <TableCell>
                <CouponStatusBadge coupon={coupon} />
              </TableCell>
              <TableCell>
                <CouponRowActions coupon={coupon} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
