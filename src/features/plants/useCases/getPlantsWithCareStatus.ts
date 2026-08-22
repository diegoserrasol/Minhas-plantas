import { getCareUrgency } from "@/domain/care/careUrgency";
import { applicationsRepository } from "@/services/firebase/firestore/applicationsRepository";
import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import { groupsRepository } from "@/services/firebase/firestore/groupsRepository";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import { productsRepository } from "@/services/firebase/firestore/productsRepository";
import type { Application, Group } from "@/types/entities";
import type { PlantWithCareStatus } from "@/types/view-models";

export interface PlantsWithCareStatusResult {
  plants: PlantWithCareStatus[];
  groupsById: Map<string, Group>;
}

function isMostRecent(candidate: Application, current?: Application): boolean {
  return !current || candidate.date.getTime() > current.date.getTime();
}

/**
 * Every plant paired with the cycle that governs it (individually, or via
 * its group) and its most recent application — cycle or standalone — so
 * list cards can show "adubada há X dias" without each card fetching its
 * own data, and without hiding applications that were never tied to a cycle.
 */
export async function getPlantsWithCareStatus(
  userId: string,
  today: Date
): Promise<PlantsWithCareStatusResult> {
  const [plants, activeCycles, products, groups, applications] =
    await Promise.all([
      plantsRepository.list(userId),
      cyclesRepository.listActive(userId),
      productsRepository.list(userId),
      groupsRepository.list(userId),
      applicationsRepository.list(userId),
    ]);

  const productsById = new Map(products.map((p) => [p.id, p]));
  const cycleByPlantId = new Map(
    activeCycles.filter((c) => c.plantId).map((c) => [c.plantId!, c])
  );
  const cycleByGroupId = new Map(
    activeCycles.filter((c) => c.groupId).map((c) => [c.groupId!, c])
  );

  const lastApplicationByPlantId = new Map<string, Application>();
  for (const application of applications) {
    const affectedIds = application.plantId
      ? [application.plantId]
      : (application.affectedPlantIds ?? []);
    for (const plantId of affectedIds) {
      const current = lastApplicationByPlantId.get(plantId);
      if (isMostRecent(application, current)) {
        lastApplicationByPlantId.set(plantId, application);
      }
    }
  }

  const enriched: PlantWithCareStatus[] = plants.map((plant) => {
    const cycle =
      cycleByPlantId.get(plant.id) ??
      (plant.groupId ? cycleByGroupId.get(plant.groupId) : undefined);
    const lastApplication = lastApplicationByPlantId.get(plant.id);

    return {
      ...plant,
      activeCycle: cycle,
      urgency:
        cycle?.nextApplicationDate
          ? getCareUrgency(cycle.nextApplicationDate, today)
          : undefined,
      lastApplicationDate: lastApplication?.date,
      lastApplicationProduct: lastApplication
        ? productsById.get(lastApplication.productId)
        : undefined,
    };
  });

  return { plants: enriched, groupsById: new Map(groups.map((g) => [g.id, g])) };
}
