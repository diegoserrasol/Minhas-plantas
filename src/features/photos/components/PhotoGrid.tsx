"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types/entities";

export function PhotoGrid({
  photos,
  selectable = false,
  selected = [],
  onToggleSelect,
}: {
  photos: Photo[];
  selectable?: boolean;
  selected?: string[];
  onToggleSelect?: (photoId: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {photos.map((photo) => {
        const isSelected = selected.includes(photo.id);
        return (
          <button
            key={photo.id}
            type="button"
            disabled={!selectable}
            onClick={() => onToggleSelect?.(photo.id)}
            className="group relative aspect-square overflow-hidden rounded-md bg-stone-200"
          >
            <Image
              src={photo.url}
              alt={format(photo.createdAt, "dd MMM yyyy", { locale: ptBR })}
              fill
              sizes="150px"
              className="object-cover"
            />
            {selectable && (
              <span
                className={cn(
                  "absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white",
                  isSelected ? "bg-moss-600" : "bg-stone-900/30"
                )}
              >
                {isSelected && <Check className="size-3 text-white" aria-hidden />}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
