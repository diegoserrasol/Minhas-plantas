import { query, where, getDocs } from "firebase/firestore";
import type { Plant } from "@/types/entities";
import { createUserSubcollectionRepository } from "./createUserSubcollectionRepository";

const base = createUserSubcollectionRepository<Plant>("plants");

async function listByGroupId(uid: string, groupId: string): Promise<Plant[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), where("groupId", "==", groupId))
  );
  return snapshot.docs.map((d) => d.data());
}

export const plantsRepository = { ...base, listByGroupId };
