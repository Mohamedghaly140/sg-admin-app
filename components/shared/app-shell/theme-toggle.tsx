"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { LucideMoon, LucideSun } from "lucide-react";
import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {mounted && resolvedTheme === "dark" ? <LucideSun /> : <LucideMoon />}
    </Button>
  );
}
