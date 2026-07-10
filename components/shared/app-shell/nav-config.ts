import {
  LucideBarChart3,
  LucideFolderTree,
  LucideLayoutDashboard,
  LucideShirt,
  LucideShoppingCart,
  LucideTicket,
  LucideTruck,
  LucideUserCog,
  LucideUsers,
  type LucideIcon,
} from "lucide-react";

export type Role = "USER" | "MANAGER" | "ADMIN";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  adminOnly?: boolean;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    adminOnly: true,
    items: [
      { label: "Dashboard", href: "/", icon: LucideLayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: LucideBarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Orders", href: "/orders", icon: LucideShoppingCart },
      { label: "Customers", href: "/customers", icon: LucideUsers },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/products", icon: LucideShirt },
      { label: "Categories", href: "/categories", icon: LucideFolderTree },
    ],
  },
  {
    label: "Marketing",
    items: [{ label: "Coupons", href: "/coupons", icon: LucideTicket }],
  },
  {
    label: "Configuration",
    items: [
      { label: "Shipping Zones", href: "/shipping-zones", icon: LucideTruck },
    ],
  },
  {
    label: "Administration",
    adminOnly: true,
    items: [{ label: "Staff Users", href: "/staff-users", icon: LucideUserCog }],
  },
];
