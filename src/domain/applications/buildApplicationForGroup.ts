import type { Plant } from "@/types/entities";

/**
 * Resolves the plant ids affected by a group application at the moment
 * it is registered, so the link survives later membership changes.
 */
export function resolveAffectedPlantIds(groupPlants: Plant[]): string[] {
  return groupPlants.map((plant) => plant.id);
}
