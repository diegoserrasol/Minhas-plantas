import { Sprout } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PlantPhotoProps {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export function PlantPhoto({ src, alt, className, sizes }: PlantPhotoProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-moss-100 text-moss-500",
          className
        )}
        aria-hidden
      >
        <Sprout className="size-1/3" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "200px"}
        className="object-cover"
      />
    </div>
  );
}
