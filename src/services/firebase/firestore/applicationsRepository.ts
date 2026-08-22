import {
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { Application } from "@/types/entities";
import { createUserSubcollectionRepository } from "./createUserSubcollectionRepository";

const base = createUserSubcollectionRepository<Application>("applications");

async function listByPlantId(
  uid: string,
  plantId: string
): Promise<Application[]> {
  const [direct, viaGroup] = await Promise.all([
    getDocs(query(base.colRef(uid), where("plantId", "==", plantId))),
    getDocs(
      query(
        base.colRef(uid),
        where("affectedPlantIds", "array-contains", plantId)
      )
    ),
  ]);
  const byId = new Map<string, Application>();
  for (const d of [...direct.docs, ...viaGroup.docs]) byId.set(d.id, d.data());
  return [...byId.values()].sort((a, b) => b.date.getTime() - a.date.getTime());
}

async function listByGroupId(
  uid: string,
  groupId: string
): Promise<Application[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), where("groupId", "==", groupId))
  );
  return snapshot.docs.map((d) => d.data());
}

async function listByCycleId(
  uid: string,
  cycleId: string
): Promise<Application[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), where("cycleId", "==", cycleId))
  );
  return snapshot.docs.map((d) => d.data());
}

async function listRecent(uid: string, max = 10): Promise<Application[]> {
  const snapshot = await getDocs(
    query(base.colRef(uid), orderBy("date", "desc"), fbLimit(max))
  );
  return snapshot.docs.map((d) => d.data());
}

export const applicationsRepository = {
  ...base,
  listByPlantId,
  listByGroupId,
  listByCycleId,
  listRecent,
};
