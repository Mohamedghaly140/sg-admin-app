import { LucideUsers } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { LeaderboardBar } from "@/components/shared/leaderboard-bar";
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
  const maxSpend = Math.max(
    0,
    ...customers.map((customer) => customer.totalSpent),
  );

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
                <TableHead className="w-10 text-right">
                  <span aria-hidden="true">#</span>
                  <span className="sr-only">Rank</span>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Paid spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="text-right tabular-nums">
                    {index + 1}
                  </TableCell>
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
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="tabular-nums">
                        {formatEGP(customer.totalSpent)}
                      </span>
                      <LeaderboardBar
                        value={customer.totalSpent}
                        max={maxSpend}
                      />
                    </div>
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
