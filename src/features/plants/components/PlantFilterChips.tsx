"use client";

import { SegmentedControl } from "@/components/ui/SegmentedControl";

export type PlantFilter = "todas" | "grupos" | "hoje" | "atrasado";

const options: { value: PlantFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "grupos", label: "Grupos" },
  { value: "hoje", label: "Manejo hoje" },
  { value: "atrasado", label: "Atrasadas" },
];

export function PlantFilterChips({
  value,
  onChange,
}: {
  value: PlantFilter;
  onChange: (value: PlantFilter) => void;
}) {
  return (
    <SegmentedControl
      aria-label="Filtrar plantas"
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}
