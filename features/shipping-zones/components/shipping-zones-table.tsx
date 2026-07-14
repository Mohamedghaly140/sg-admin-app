import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatEGP } from "@/lib/format";

import type { ShippingZone } from "../types";
import { ShippingZoneActiveToggle } from "./shipping-zone-active-toggle";
import { ShippingZoneRowActions } from "./shipping-zone-row-actions";

type ShippingZonesTableProps = {
  zones: ShippingZone[];
};

// Presentation-only sort: group by governorate, governorate-wide row (null city)
// first so its city overrides sit beneath it. Pagination stays server-side, so
// this only orders the rows on the current page.
function sortZones(zones: ShippingZone[]): ShippingZone[] {
  return [...zones].sort((a, b) => {
    const byGovernorate = a.governorate.localeCompare(b.governorate);
    if (byGovernorate !== 0) return byGovernorate;
    if (a.city === b.city) return 0;
    if (a.city === null) return -1;
    if (b.city === null) return 1;
    return a.city.localeCompare(b.city);
  });
}

function zoneLabel(zone: ShippingZone): string {
  return zone.city
    ? `${zone.governorate} — ${zone.city}`
    : `${zone.governorate} (governorate-wide)`;
}

export function ShippingZonesTable({ zones }: ShippingZonesTableProps) {
  const sortedZones = sortZones(zones);

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>Governorate</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedZones.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell>{zone.country}</TableCell>
              <TableCell className="font-medium">{zone.governorate}</TableCell>
              <TableCell>
                {zone.city ?? (
                  <span className="text-muted-foreground">
                    All cities (governorate-wide)
                  </span>
                )}
              </TableCell>
              <TableCell>{formatEGP(zone.fee)}</TableCell>
              <TableCell>
                <ShippingZoneActiveToggle
                  id={zone.id}
                  isActive={zone.isActive}
                  label={zoneLabel(zone)}
                />
              </TableCell>
              <TableCell>{formatDate(zone.updatedAt)}</TableCell>
              <TableCell>
                <ShippingZoneRowActions zone={zone} label={zoneLabel(zone)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
