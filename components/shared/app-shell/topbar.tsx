import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/shared/app-shell/breadcrumbs";
import { ThemeToggle } from "@/components/shared/app-shell/theme-toggle";

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
