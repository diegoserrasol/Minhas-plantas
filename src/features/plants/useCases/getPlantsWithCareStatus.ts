import { getCareUrgency } from "@/domain/care/careUrgency";
import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import { groupsRepository } from "@/services/firebase/firestore/groupsRepository";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import { productsRepository } from "@/services/firebase/firestore/productsRepository";
import type { Group } from "@/types/entities";
import type { PlantWithCareStatus } from "@/types/view-models";

export interface PlantsWithCareStatusResult {
  plants: PlantWithCareStatus[];
  groupsById: Map<string, Group>;
}

/**
 * Every plant paired with the cycle that governs it (individually, or
 * via its group) so list cards can show "adubada há X dias" without
 * each card fetching its own data.
 */
export async function getPlantsWithCareStatus(
  userId: string,
  today: Date
): Promise<PlantsWithCareStatusResult> {
  const [plants, activeCycles, products, groups] = await Promise.all([
    plantsRepository.list(userId),
    cyclesRepository.listActive(userId),
    productsRepository.list(userId),
    groupsRepository.list(userId),
  ]);

  const productsById = new Map(products.map((p) => [p.id, p]));
  const cycleByPlantId = new Map(
    activeCycles.filter((c) => c.plantId).map((c) => [c.plantId!, c])
  );
  const cycleByGroupId = new Map(
    activeCycles.filter((c) => c.groupId).map((c) => [c.groupId!, c])
  );

  const enriched: PlantWithCareStatus[] = plants.map((plant) => {
    const cycle =
      cycleByPlantId.get(plant.id) ??
      (plant.groupId ? cycleByGroupId.get(plant.groupId) : undefined);

    return {
      ...plant,
      activeCycle: cycle,
      product: cycle ? productsById.get(cycle.productId) : undefined,
      urgency:
        cycle?.nextApplicationDate
          ? getCareUrgency(cycle.nextApplicationDate, today)
          : undefined,
    };
  });

  return { plants: enriched, groupsById: new Map(groups.map((g) => [g.id, g])) };
}
