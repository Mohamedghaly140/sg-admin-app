import { ActiveBadge } from "@/components/shared/active-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

import type { StaffRole, StaffUser } from "../types";
import { StaffUserRowActions } from "./staff-user-row-actions";

type StaffUsersTableProps = {
  users: StaffUser[];
  currentUserId: string | null;
  activeAdminCount: number;
};

export function StaffUsersTable({
  users,
  currentUserId,
  activeAdminCount,
}: StaffUsersTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="w-36">Joined</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <ActiveBadge active={user.active} />
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                <StaffUserRowActions
                  user={user}
                  currentUserId={currentUserId}
                  activeAdminCount={activeAdminCount}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getRoleBadgeVariant(
  role: StaffRole,
): "default" | "secondary" | "outline" {
  switch (role) {
    case "ADMIN":
      return "default";
    case "MANAGER":
      return "secondary";
    case "USER":
      return "outline";
  }
}
