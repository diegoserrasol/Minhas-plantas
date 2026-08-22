"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/types/entities";

export function PhotoCompareSlider({ before, after }: { before: Photo; after: Photo }) {
  const [position, setPosition] = useState(50);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-200">
        <Image src={after.url} alt="Depois" fill sizes="500px" className="object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image src={before.url} alt="Antes" fill sizes="500px" className="object-cover" />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-stone-50 shadow-card"
          style={{ left: `${position}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Comparar antes e depois"
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>
      <div className="flex justify-between text-xs text-stone-500">
        <span>Antes · {format(before.createdAt, "dd MMM yyyy", { locale: ptBR })}</span>
        <span>Depois · {format(after.createdAt, "dd MMM yyyy", { locale: ptBR })}</span>
      </div>
    </div>
  );
}
