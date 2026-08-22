import { getDocs, query, where } from "firebase/firestore";
import type { CareCycle } from "@/types/entities";
import { createUserSubcollectionRepository } from "./createUserSubcollectionRepository";

const base = createUserSubcollectionRepository<CareCycle>("careCycles");

async function listActive(uid: string): Promise<CareCycle[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), where("status", "==", "ativo"))
  );
  return snapshot.docs.map((d) => d.data());
}

async function listByPlantId(
  uid: string,
  plantId: string
): Promise<CareCycle[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), where("plantId", "==", plantId))
  );
  return snapshot.docs.map((d) => d.data());
}

async function listByGroupId(
  uid: string,
  groupId: string
): Promise<CareCycle[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), where("groupId", "==", groupId))
  );
  return snapshot.docs.map((d) => d.data());
}

export const cyclesRepository = {
  ...base,
  listActive,
  listByPlantId,
  listByGroupId,
};
