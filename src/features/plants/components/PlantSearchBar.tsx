"use client";

import { Search } from "lucide-react";

export function PlantSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nome, espécie ou grupo"
        aria-label="Buscar plantas"
        className="h-11 w-full rounded-full border border-stone-300 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-500/30"
      />
    </div>
  );
}
