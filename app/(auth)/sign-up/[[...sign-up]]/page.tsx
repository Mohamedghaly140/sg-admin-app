import { notFound } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="flex min-h-svh items-center justify-center">
      <SignUp />
    </main>
  );
}
