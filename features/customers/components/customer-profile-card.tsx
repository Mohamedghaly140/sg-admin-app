import type { ReactNode } from "react";

import { ActiveBadge } from "@/components/shared/active-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";

import type { CustomerDetail } from "../types";

type CustomerProfileCardProps = {
  customer: CustomerDetail;
};

type ProfileDetailProps = {
  label: string;
  value: ReactNode;
};

export function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Profile</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ProfileDetail label="Name" value={customer.name} />
          <ProfileDetail label="Email" value={customer.email} />
          <ProfileDetail label="Phone" value={customer.phone} />
          <ProfileDetail
            label="Account state"
            value={<ActiveBadge active={customer.active} />}
          />
          <ProfileDetail
            label="Joined"
            value={formatDate(customer.createdAt)}
          />
        </dl>
      </CardContent>
    </Card>
  );
}

function ProfileDetail({ label, value }: ProfileDetailProps) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}
