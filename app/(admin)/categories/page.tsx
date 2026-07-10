import { handleAuthError } from "@/lib/api/handle-auth-error";
import { apiFetch } from "@/lib/api/http";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageId: string | null;
  imageUrl: string | null;
  createdAt: string;
  subCategories: {
    id: string;
    name: string;
    slug: string;
  }[];
};

async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await apiFetch<Category[]>("/admin/categories");
    return data;
  } catch (error) {
    handleAuthError(error);
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-base font-medium">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Smoke test data from GET /admin/categories.
        </p>
      </div>

      {categories.length > 0 ? (
        <ul className="divide-y rounded-md border bg-card">
          {categories.map((category) => (
            <li key={category.id} className="px-4 py-3 text-sm">
              {category.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
          No categories found.
        </p>
      )}
    </section>
  );
}
