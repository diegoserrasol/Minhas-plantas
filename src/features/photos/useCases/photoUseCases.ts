import { compressPlantPhoto, fileToBase64 } from "@/lib/imageCompression";
import { photosRepository } from "@/services/firebase/firestore/photosRepository";
import type { Photo } from "@/types/entities";

export async function addPlantPhoto(
  userId: string,
  plantId: string,
  file: File,
  note?: string
): Promise<Photo> {
  const compressed = await compressPlantPhoto(file);
  const url = await fileToBase64(compressed);

  return photosRepository.create(userId, {
    userId,
    plantId,
    url,
    note,
    createdAt: new Date(),
  });
}

export async function removePlantPhoto(
  userId: string,
  photo: Photo
): Promise<void> {
  await photosRepository.remove(userId, photo.id);
}

export async function listPlantPhotos(
  userId: string,
  plantId: string
): Promise<Photo[]> {
  return photosRepository.listByPlantId(userId, plantId);
}
