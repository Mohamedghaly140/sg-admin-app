import { LucideTicketPercent } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatEGP } from "@/lib/format";

import type { CouponsAnalytics } from "../types";

type CouponsTableProps = {
  coupons: CouponsAnalytics["coupons"];
};

export function CouponsTable({ coupons }: CouponsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Coupon performance</h2>
        </CardTitle>
      </CardHeader>
      {coupons.length > 0 ? (
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Lifetime usage</TableHead>
                <TableHead className="text-right">
                  Period redemptions
                </TableHead>
                <TableHead className="text-right">Discount given</TableHead>
                <TableHead className="w-44">Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {coupon.discountPct}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {coupon.usedCount.toLocaleString("en-EG")} / {" "}
                    {coupon.maxUsage === 0
                      ? "∞"
                      : coupon.maxUsage.toLocaleString("en-EG")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {coupon.periodRedemptions.toLocaleString("en-EG")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatEGP(coupon.totalDiscountGiven)}
                  </TableCell>
                  <TableCell>{formatDateTime(coupon.expire)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent>
          <EmptyState
            icon={
              <LucideTicketPercent className="size-5" aria-hidden="true" />
            }
            title="No coupons"
            description="Coupon performance will appear here."
          />
        </CardContent>
      )}
    </Card>
  );
}
