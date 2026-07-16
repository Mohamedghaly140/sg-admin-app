import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/shared/app-shell/app-sidebar";
import { Topbar } from "@/components/shared/app-shell/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Role } from "@/components/shared/app-shell/nav-config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: Role } | undefined)?.role;

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar role={role ?? "MANAGER"} />
      <SidebarInset>
        <Topbar />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
