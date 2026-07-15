import { LucideUsers } from "lucide-react";
import Link from "next/link";

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
import { formatEGP } from "@/lib/format";

import type { CustomersAnalytics } from "../types";

type TopSpendersTableProps = {
  customers: CustomersAnalytics["topSpenders"];
};

export function TopSpendersTable({ customers }: TopSpendersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Top spenders</h2>
        </CardTitle>
      </CardHeader>
      {customers.length > 0 ? (
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Paid spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {customer.ordersCount.toLocaleString("en-EG")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatEGP(customer.totalSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent>
          <EmptyState
            icon={<LucideUsers className="size-5" aria-hidden="true" />}
            title="No top spenders"
            description="Customer spend for this range will appear here."
          />
        </CardContent>
      )}
    </Card>
  );
}
