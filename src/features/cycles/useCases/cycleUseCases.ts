import { validateTarget } from "@/domain/cycles/validateCycleTarget";
import { calculateNextApplicationDate } from "@/domain/cycles/calculateNextApplicationDate";
import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import type { CareCycle } from "@/types/entities";

export type CreateCycleInput = Omit<
  CareCycle,
  "id" | "createdAt" | "updatedAt" | "status" | "lastApplicationDate" | "nextApplicationDate"
>;

export async function createCycle(input: CreateCycleInput): Promise<CareCycle> {
  validateTarget(input.plantId, input.groupId);

  const now = new Date();
  return cyclesRepository.create(input.userId, {
    ...input,
    status: "ativo",
    nextApplicationDate: calculateNextApplicationDate(
      input.startDate,
      input.frequencyValue,
      input.frequencyUnit
    ),
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateCycle(
  userId: string,
  cycleId: string,
  data: Partial<Omit<CareCycle, "id" | "userId" | "createdAt">>
): Promise<void> {
  await cyclesRepository.update(userId, cycleId, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function pauseCycle(userId: string, cycleId: string): Promise<void> {
  await updateCycle(userId, cycleId, { status: "pausado" });
}

export async function reactivateCycle(
  userId: string,
  cycleId: string
): Promise<void> {
  await updateCycle(userId, cycleId, { status: "ativo" });
}

export async function deleteCycle(userId: string, cycleId: string): Promise<void> {
  await cyclesRepository.update(userId, cycleId, {
    status: "excluido",
    updatedAt: new Date(),
  });
}
