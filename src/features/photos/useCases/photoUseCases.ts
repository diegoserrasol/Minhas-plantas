import { photosRepository } from "@/services/firebase/firestore/photosRepository";
import type { Photo } from "@/types/entities";

/**
 * `dataUrl` is already a compressed JPEG data URI produced by
 * `PhotoPicker` / `compressImageToDataUrl`, so it's guaranteed to fit both
 * the Firestore document limit and the `url.size()` cap in the rules.
 */
export async function addPlantPhoto(
  userId: string,
  plantId: string,
  dataUrl: string,
  note?: string
): Promise<Photo> {
  return photosRepository.create(userId, {
    userId,
    plantId,
    url: dataUrl,
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
