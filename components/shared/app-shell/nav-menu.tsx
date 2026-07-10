"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/components/shared/app-shell/nav-config";

type NavMenuProps = {
  items: NavItem[];
};

export function NavMenu({ items }: NavMenuProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.label}
              render={<Link href={item.href} />}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
