import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import type { Plant } from "@/types/entities";

export type CreatePlantInput = Omit<Plant, "id" | "createdAt" | "updatedAt">;

export async function createPlant(input: CreatePlantInput): Promise<Plant> {
  const now = new Date();
  return plantsRepository.create(input.userId, {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updatePlant(
  userId: string,
  plantId: string,
  data: Partial<Omit<Plant, "id" | "userId" | "createdAt">>
): Promise<void> {
  await plantsRepository.update(userId, plantId, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deletePlant(userId: string, plantId: string): Promise<void> {
  await plantsRepository.remove(userId, plantId);
}

export async function listPlants(userId: string): Promise<Plant[]> {
  return plantsRepository.list(userId);
}

export async function getPlant(
  userId: string,
  plantId: string
): Promise<Plant | null> {
  return plantsRepository.getById(userId, plantId);
}
