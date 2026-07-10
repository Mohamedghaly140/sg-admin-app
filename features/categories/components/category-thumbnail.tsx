import Image from "next/image";
import { LucideImageOff } from "lucide-react";

import { cldUrl } from "@/lib/format";

type CategoryThumbnailProps = {
  imageUrl: string | null;
  name: string;
};

export function CategoryThumbnail({ imageUrl, name }: CategoryThumbnailProps) {
  if (!imageUrl) {
    return (
      <div className="flex size-16 items-center justify-center rounded-md border bg-muted text-muted-foreground">
        <LucideImageOff className="size-5" aria-hidden="true" />
        <span className="sr-only">No image for {name}</span>
      </div>
    );
  }

  return (
    <Image
      src={cldUrl(imageUrl, {
        width: 64,
        height: 64,
        crop: "fill",
        quality: "auto",
        format: "auto",
      })}
      alt={name}
      width={64}
      height={64}
      className="size-16 rounded-md object-cover"
    />
  );
}
