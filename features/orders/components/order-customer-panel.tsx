import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { OrderDetail } from "../types";

type OrderCustomerPanelProps = {
  order: OrderDetail;
};

type DetailRowProps = {
  label: string;
  value: ReactNode;
};

export function OrderCustomerPanel({ order }: OrderCustomerPanelProps) {
  if (order.user) {
    const { shippingAddress, user } = order;

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Customer</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <section className="flex flex-col gap-3">
            <h3 className="font-medium">Contact</h3>
            <dl className="grid gap-3">
              <DetailRow
                label="Name"
                value={
                  <Link
                    href={`/customers/${user.id}`}
                    className="font-medium hover:underline"
                  >
                    {user.name}
                  </Link>
                }
              />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Phone" value={user.phone} />
            </dl>
          </section>

          {shippingAddress ? (
            <section className="flex flex-col gap-3">
              <h3 className="font-medium">Shipping address</h3>
              <dl className="grid gap-3">
                <DetailRow label="Alias" value={shippingAddress.alias} />
                <DetailRow label="Country" value={shippingAddress.country} />
                <DetailRow
                  label="Governorate"
                  value={shippingAddress.governorate}
                />
                <DetailRow label="City" value={shippingAddress.city} />
                <DetailRow label="Area" value={shippingAddress.area} />
                <DetailRow
                  label="Address"
                  value={shippingAddress.addressLine1}
                />
                {shippingAddress.details ? (
                  <DetailRow label="Details" value={shippingAddress.details} />
                ) : null}
                <DetailRow
                  label="Postal code"
                  value={shippingAddress.postalCode}
                />
                <DetailRow label="Phone" value={shippingAddress.phone} />
              </dl>
            </section>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Customer</h2>
        </CardTitle>
        <CardAction>
          <Badge variant="outline">Guest order</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h3 className="font-medium">Contact</h3>
          <dl className="grid gap-3">
            <DetailRow label="Name" value={order.anonName} />
            <DetailRow label="Phone" value={order.anonPhone} />
            <DetailRow label="Email" value={order.anonEmail} />
          </dl>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="font-medium">Shipping address</h3>
          <dl className="grid gap-3">
            <DetailRow label="Country" value={order.anonCountry} />
            <DetailRow label="Governorate" value={order.anonGovernorate} />
            <DetailRow label="City" value={order.anonCity} />
            <DetailRow label="Area" value={order.anonArea} />
            <DetailRow label="Address" value={order.anonAddressLine1} />
            {order.anonDetails ? (
              <DetailRow label="Details" value={order.anonDetails} />
            ) : null}
            <DetailRow label="Postal code" value={order.anonPostalCode} />
            <DetailRow label="Phone" value={order.anonShippingPhone} />
          </dl>
        </section>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words">{value ?? "—"}</dd>
    </div>
  );
}
