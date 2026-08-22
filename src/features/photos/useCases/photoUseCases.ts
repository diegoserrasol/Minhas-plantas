import { compressPlantPhoto } from "@/lib/imageCompression";
import { photosRepository } from "@/services/firebase/firestore/photosRepository";
import {
  deletePlantPhoto,
  uploadPlantPhoto,
} from "@/services/firebase/storage/photoStorage";
import type { Photo } from "@/types/entities";

export async function addPlantPhoto(
  userId: string,
  plantId: string,
  file: File,
  note?: string
): Promise<Photo> {
  const compressed = await compressPlantPhoto(file);
  const { storagePath, url } = await uploadPlantPhoto(
    compressed,
    userId,
    plantId
  );

  return photosRepository.create(userId, {
    userId,
    plantId,
    storagePath,
    url,
    note,
    createdAt: new Date(),
  });
}

export async function removePlantPhoto(
  userId: string,
  photo: Photo
): Promise<void> {
  await deletePlantPhoto(photo.storagePath);
  await photosRepository.remove(userId, photo.id);
}

export async function listPlantPhotos(
  userId: string,
  plantId: string
): Promise<Photo[]> {
  return photosRepository.listByPlantId(userId, plantId);
}
