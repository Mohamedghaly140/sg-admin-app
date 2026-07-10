import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMenu } from "@/components/shared/app-shell/nav-menu";
import { NAV_GROUPS, type Role } from "@/components/shared/app-shell/nav-config";

type AppSidebarProps = {
  role: Role;
};

export function AppSidebar({ role }: AppSidebarProps) {
  const groups = NAV_GROUPS.filter((group) => !group.adminOnly || role === "ADMIN");

  return (
    <Sidebar>
      <SidebarHeader>
        <p className="px-2 py-1.5 text-sm font-semibold">SG Couture Admin</p>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <NavMenu
                items={group.items.map((item) => ({
                  label: item.label,
                  href: item.href,
                  icon: <item.icon />,
                }))}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
