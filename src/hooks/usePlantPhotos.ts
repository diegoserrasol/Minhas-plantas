import { listPlantPhotos } from "@/features/photos/useCases/photoUseCases";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function usePlantPhotos(plantId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => listPlantPhotos(user.uid, plantId) : null,
    [user?.uid, plantId]
  );
}
