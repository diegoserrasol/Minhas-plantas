import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import { photosRepository } from "@/services/firebase/firestore/photosRepository";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import type { Plant } from "@/types/entities";

/**
 * `coverPhotoUrl` arrives already compressed from `PhotoPicker` — the
 * compression step used to live here, which meant a form could hand over a
 * File whose compressed size only became known (and only blew up) mid-write.
 */
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
  const [photos, cycles] = await Promise.all([
    photosRepository.listByPlantId(userId, plantId),
    cyclesRepository.listByPlantId(userId, plantId),
  ]);
  await Promise.all([
    ...photos.map((photo) => photosRepository.remove(userId, photo.id)),
    // Applications keep the plant history, but a cycle pointing at a
    // deleted plant would otherwise show up forever as a blank-name
    // card on the dashboard.
    ...cycles.map((cycle) =>
      cyclesRepository.update(userId, cycle.id, { status: "excluido" })
    ),
  ]);
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
