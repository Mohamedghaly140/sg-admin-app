import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

import { CategoryThumbnail } from "./category-thumbnail";
import type { Category } from "../types";

type CategoriesTableProps = {
  categories: Category[];
};

export function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Sub-categories</TableHead>
            <TableHead className="w-36">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <CategoryThumbnail
                  imageUrl={category.imageUrl}
                  name={category.name}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {category.slug}
                  </span>
                </div>
              </TableCell>
              <TableCell className="min-w-56 whitespace-normal">
                {category.subCategories.length > 0 ? (
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {category.subCategories.length} sub-categories
                    </summary>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
                      {category.subCategories.map((subCategory) => (
                        <li key={subCategory.id}>{subCategory.name}</li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell>{formatDate(category.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
