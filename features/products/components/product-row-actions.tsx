"use client";

import Link from "next/link";
import {
  LucideEllipsis,
  LucidePencil,
  LucideRefreshCw,
  LucideTrash2,
} from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Product } from "../types";
import { DeleteProductConfirmDialog } from "./delete-product-button";
import { DuplicateProductButton } from "./duplicate-product-button";
import { SetProductStatusMenuItems } from "./set-product-status-menu-items";
import { ToggleProductFeaturedButton } from "./toggle-product-featured-button";

type ProductRowActionsProps = {
  product: Product;
};

export function ProductRowActions({ product }: ProductRowActionsProps) {
  const actionsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              ref={actionsTriggerRef}
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${product.name}`}
            />
          }
        >
          <LucideEllipsis aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={<Link href={`/products/${product.id}`} />}
            >
              <LucidePencil aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DuplicateProductButton productId={product.id} />
            <ToggleProductFeaturedButton
              productId={product.id}
              productName={product.name}
              featured={product.featured}
              display="menu-item"
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <LucideRefreshCw aria-hidden="true" />
              Set status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <SetProductStatusMenuItems
                  productId={product.id}
                  currentStatus={product.status}
                />
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <LucideTrash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteProductConfirmDialog
        productId={product.id}
        productName={product.name}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        finalFocus={actionsTriggerRef}
      />
    </div>
  );
}
