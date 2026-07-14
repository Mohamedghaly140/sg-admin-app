import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEGP } from "@/lib/format";

import type { OrderDetail } from "../types";

type OrderTotalsCardProps = {
  order: OrderDetail;
};

type TotalRowProps = {
  label: string;
  value: string;
  deduction?: boolean;
};

export function OrderTotalsCard({ order }: OrderTotalsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Totals</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3">
          <TotalRow label="Items subtotal" value={order.itemsSubtotal} />
          <TotalRow
            label={
              order.coupon
                ? `Discount (${order.coupon.name})`
                : "Discount"
            }
            value={order.discountApplied}
            deduction
          />
          <TotalRow label="Shipping fees" value={order.shippingFees} />
          <div className="flex items-center justify-between gap-4 border-t pt-3 font-medium">
            <dt>Total</dt>
            <dd>{formatEGP(order.totalOrderPrice)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function TotalRow({ label, value, deduction }: TotalRowProps) {
  const isNonZeroDeduction = deduction && Number(value) > 0;

  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>
        {isNonZeroDeduction ? "−" : null}
        {formatEGP(value)}
      </dd>
    </div>
  );
}
