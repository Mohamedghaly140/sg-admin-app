"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function AccountDisabledPage() {
  const { signOut } = useClerk();
  const hasSignedOut = useRef(false);

  useEffect(() => {
    if (hasSignedOut.current) return;
    hasSignedOut.current = true;
    signOut({ redirectUrl: "/account-disabled" });
  }, [signOut]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-xl font-semibold">Account disabled</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        Your account has been deactivated. Contact an administrator if you
        believe this is a mistake.
      </p>
    </main>
  );
}
