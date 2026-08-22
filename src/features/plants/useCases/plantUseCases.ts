import { compressPlantPhoto } from "@/lib/imageCompression";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import { uploadPlantPhoto } from "@/services/firebase/storage/photoStorage";
import type { Plant } from "@/types/entities";

export type CreatePlantInput = Omit<
  Plant,
  "id" | "createdAt" | "updatedAt" | "coverPhotoUrl" | "coverPhotoStoragePath"
> & { coverPhotoFile?: File };

export async function createPlant(input: CreatePlantInput): Promise<Plant> {
  const { coverPhotoFile, ...rest } = input;
  const now = new Date();
  const plantId = plantsRepository.newId(input.userId);

  let coverPhotoUrl: string | undefined;
  let coverPhotoStoragePath: string | undefined;
  if (coverPhotoFile) {
    const compressed = await compressPlantPhoto(coverPhotoFile);
    const uploaded = await uploadPlantPhoto(compressed, input.userId, plantId);
    coverPhotoUrl = uploaded.url;
    coverPhotoStoragePath = uploaded.storagePath;
  }

  return plantsRepository.create(
    input.userId,
    {
      ...rest,
      coverPhotoUrl,
      coverPhotoStoragePath,
      createdAt: now,
      updatedAt: now,
    },
    plantId
  );
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
