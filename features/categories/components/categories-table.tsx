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
import { CategoryRowActions } from "./category-row-actions";
import { SubCategoryRowActions } from "./sub-category-row-actions";
import type { CategoryOption } from "../queries/get-all-categories";
import type { Category } from "../types";

type CategoriesTableProps = {
  categories: Category[];
  categoryOptions: CategoryOption[];
};

export function CategoriesTable({
  categories,
  categoryOptions,
}: CategoriesTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Sub-categories</TableHead>
            <TableHead className="w-36">Created</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
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
                    <ul className="mt-2 flex flex-col gap-1 text-sm">
                      {category.subCategories.map((subCategory) => (
                        <li
                          key={subCategory.id}
                          className="flex items-center justify-between gap-2 rounded-md bg-muted/50 py-1 pl-2"
                        >
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate">{subCategory.name}</span>
                            <span className="truncate text-xs text-muted-foreground">
                              {subCategory.slug}
                            </span>
                          </div>
                          <SubCategoryRowActions
                            categoryId={category.id}
                            categoryOptions={categoryOptions}
                            subCategory={subCategory}
                          />
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell>{formatDate(category.createdAt)}</TableCell>
              <TableCell>
                <CategoryRowActions
                  category={category}
                  categoryOptions={categoryOptions}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
