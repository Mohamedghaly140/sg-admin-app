"use client";

import { LucideStar } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { toggleProductFeatured } from "../actions/toggle-product-featured";

type ToggleProductFeaturedButtonProps = {
  productId: string;
  productName: string;
  featured: boolean;
  display?: "star" | "menu-item";
};

export function ToggleProductFeaturedButton({
  productId,
  productName,
  featured,
  display = "star",
}: ToggleProductFeaturedButtonProps) {
  const [optimisticFeatured, setOptimisticFeatured] = useOptimistic(featured);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const nextFeatured = !optimisticFeatured;

    startTransition(async () => {
      setOptimisticFeatured(nextFeatured);
      const actionState = await toggleProductFeatured(productId, nextFeatured);
      if (actionState.status === "ERROR") {
        toast.error(actionState.message);
      }
    });
  }

  const star = (
    <LucideStar
      className={cn(optimisticFeatured && "fill-current")}
      aria-hidden="true"
    />
  );

  if (display === "menu-item") {
    return (
      <DropdownMenuItem disabled={isPending} onClick={handleClick}>
        {star}
        {optimisticFeatured ? "Remove from featured" : "Mark as featured"}
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={handleClick}
      aria-label={`${optimisticFeatured ? "Remove" : "Add"} ${productName} ${optimisticFeatured ? "from" : "to"} featured products`}
    >
      {star}
    </Button>
  );
}
