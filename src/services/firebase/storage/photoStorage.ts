import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../client";

export interface UploadedPhoto {
  storagePath: string;
  url: string;
}

export async function uploadPlantPhoto(
  file: File,
  uid: string,
  plantId: string
): Promise<UploadedPhoto> {
  const storagePath = `users/${uid}/plants/${plantId}/${crypto.randomUUID()}.webp`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(storageRef);
  return { storagePath, url };
}

export async function deletePlantPhoto(storagePath: string): Promise<void> {
  await deleteObject(ref(storage, storagePath));
}
