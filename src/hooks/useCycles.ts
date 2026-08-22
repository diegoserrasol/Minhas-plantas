import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function useCycles() {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => cyclesRepository.list(user.uid) : null,
    [user?.uid]
  );
}

export function useCyclesForPlant(plantId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => cyclesRepository.listByPlantId(user.uid, plantId) : null,
    [user?.uid, plantId]
  );
}

export function useCyclesForGroup(groupId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => cyclesRepository.listByGroupId(user.uid, groupId) : null,
    [user?.uid, groupId]
  );
}
