export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-xl font-semibold">Access denied</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        Your account doesn&apos;t have permission to view this section.
      </p>
    </main>
  );
}
