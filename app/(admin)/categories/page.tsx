import { LucideFolderTree } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function CategoriesPage() {
  return (
    <EmptyState
      icon={<LucideFolderTree className="size-6" />}
      title="Categories"
      description="Coming soon."
    />
  );
}
