import { applicationsRepository } from "@/services/firebase/firestore/applicationsRepository";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function useApplicationsHistory(max = 50) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => applicationsRepository.listRecent(user.uid, max) : null,
    [user?.uid, max]
  );
}

export function useApplicationsForPlant(plantId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => applicationsRepository.listByPlantId(user.uid, plantId) : null,
    [user?.uid, plantId]
  );
}
