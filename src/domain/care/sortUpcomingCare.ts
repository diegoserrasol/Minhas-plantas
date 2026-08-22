import type { CareItem } from "@/types/view-models";

export function sortUpcomingCare(items: CareItem[]): CareItem[] {
  return [...items].sort((a, b) => a.daysFromToday - b.daysFromToday);
}
