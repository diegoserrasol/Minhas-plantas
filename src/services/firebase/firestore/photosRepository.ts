import { getDocs, orderBy, query, where } from "firebase/firestore";
import type { Photo } from "@/types/entities";
import { createUserSubcollectionRepository } from "./createUserSubcollectionRepository";

const base = createUserSubcollectionRepository<Photo>("photos");

async function listByPlantId(
  uid: string,
  plantId: string
): Promise<Photo[]> {
  const snapshot = await getDocs(
    query(
      base.colRef(uid),
      where("plantId", "==", plantId),
      orderBy("createdAt", "desc")
    )
  );
  return snapshot.docs.map((d) => d.data());
}

export const photosRepository = { ...base, listByPlantId };
