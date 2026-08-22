import { applyCycleUpdate } from "@/domain/cycles/applyCycleUpdate";
import { validateTarget } from "@/domain/cycles/validateCycleTarget";
import { resolveAffectedPlantIds } from "@/domain/applications/buildApplicationForGroup";
import { applicationsRepository } from "@/services/firebase/firestore/applicationsRepository";
import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import type { Application, MethodType, UnitType } from "@/types/entities";

export interface RegisterApplicationInput {
  userId: string;
  productId: string;
  plantId?: string;
  groupId?: string;
  date: Date;
  dose?: number;
  unit?: UnitType;
  volume?: number;
  method?: MethodType;
  notes?: string;
  cycleId?: string;
}

/**
 * The single entry point for recording an application. Components must
 * call this instead of writing to Firestore directly — it owns both the
 * application write and the cycle date rollover (PRD §20), so the two
 * never drift apart.
 */
export async function registerApplication(
  input: RegisterApplicationInput
): Promise<Application> {
  validateTarget(input.plantId, input.groupId);

  let affectedPlantIds: string[] | undefined;
  if (input.groupId) {
    const groupPlants = await plantsRepository.listByGroupId(
      input.userId,
      input.groupId
    );
    affectedPlantIds = resolveAffectedPlantIds(groupPlants);
  }

  const application = await applicationsRepository.create(input.userId, {
    userId: input.userId,
    productId: input.productId,
    plantId: input.plantId,
    groupId: input.groupId,
    affectedPlantIds,
    date: input.date,
    dose: input.dose,
    unit: input.unit,
    volume: input.volume,
    method: input.method,
    notes: input.notes,
    cycleId: input.cycleId,
    createdAt: new Date(),
  });

  if (input.cycleId) {
    const cycle = await cyclesRepository.getById(input.userId, input.cycleId);
    if (cycle) {
      const updatedCycle = applyCycleUpdate(cycle, input.date);
      await cyclesRepository.update(input.userId, cycle.id, updatedCycle);
    }
  }

  return application;
}
