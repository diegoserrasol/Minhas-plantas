import { getPlant } from "@/features/plants/useCases/plantUseCases";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function usePlant(plantId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => getPlant(user.uid, plantId) : null,
    [user?.uid, plantId]
  );
}
