import { LucideMapPin } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { CustomerAddress } from "../types";

type CustomerAddressesProps = {
  addresses: CustomerAddress[];
};

type AddressDetailProps = {
  label: string;
  value: ReactNode;
};

export function CustomerAddresses({ addresses }: CustomerAddressesProps) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="addresses-title">
      <h2 id="addresses-title" className="text-base font-medium">
        Saved addresses
      </h2>

      {addresses.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader>
                <CardTitle>
                  <h3>{address.alias}</h3>
                </CardTitle>
                {address.isDefault ? (
                  <CardAction>
                    <Badge>Default</Badge>
                  </CardAction>
                ) : null}
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <AddressDetail label="Country" value={address.country} />
                  <AddressDetail
                    label="Governorate"
                    value={address.governorate}
                  />
                  <AddressDetail label="City" value={address.city} />
                  <AddressDetail label="Area" value={address.area} />
                  <AddressDetail
                    label="Details"
                    value={address.details ?? "—"}
                  />
                  <AddressDetail
                    label="Postal code"
                    value={address.postalCode}
                  />
                  <AddressDetail label="Phone" value={address.phone} />
                  <AddressDetail
                    label="Coordinates"
                    value={`${address.latitude}, ${address.longitude}`}
                  />
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <EmptyState
            icon={<LucideMapPin className="size-5" aria-hidden="true" />}
            title="No saved addresses"
            description="This customer has not saved an address yet."
          />
        </div>
      )}
    </section>
  );
}

function AddressDetail({ label, value }: AddressDetailProps) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}
