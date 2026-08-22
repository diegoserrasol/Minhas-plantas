import { listPlants } from "@/features/plants/useCases/plantUseCases";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function usePlants() {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => listPlants(user.uid) : null,
    [user?.uid]
  );
}
