"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

const ClerkUserButton = dynamic(
  () => import("@clerk/nextjs").then((module) => module.UserButton),
  {
    ssr: false,
    loading: () => <Skeleton className="size-8 rounded-full" />,
  },
);

export function UserButton() {
  return <ClerkUserButton />;
}
