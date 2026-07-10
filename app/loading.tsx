import Spinner from "@/components/shared/spinner";

export default function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <Spinner className="size-6" />
    </main>
  );
}
