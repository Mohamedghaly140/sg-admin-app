"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NAV_GROUPS } from "@/components/shared/app-shell/nav-config";

const LABELS_BY_HREF = new Map(
  NAV_GROUPS.flatMap((group) => group.items).map((item) => [item.href, item.label]),
);

function labelForSegment(segment: string, href: string) {
  return LABELS_BY_HREF.get(href) ?? decodeURIComponent(segment).replace(/-/g, " ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = labelForSegment(segment, href);

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="capitalize"
                    render={<Link href={href} />}
                  >
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
