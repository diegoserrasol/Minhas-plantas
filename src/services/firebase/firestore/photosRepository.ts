import { getDocs, query, where } from "firebase/firestore";
import type { Photo } from "@/types/entities";
import { createUserSubcollectionRepository } from "./createUserSubcollectionRepository";

const base = createUserSubcollectionRepository<Photo>("photos");

/**
 * Sorting happens in memory rather than via `orderBy("createdAt")`: pairing
 * it with the `plantId` equality filter needs a composite index, and an
 * undeployed index fails the read with `failed-precondition`. One plant's
 * photo count is small enough that the client-side sort costs nothing.
 */
async function listByPlantId(uid: string, plantId: string): Promise<Photo[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), where("plantId", "==", plantId))
  );
  return snapshot.docs
    .map((d) => d.data())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const photosRepository = { ...base, listByPlantId };
