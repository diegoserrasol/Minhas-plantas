import { getPlantTimelineData } from "@/features/plants/useCases/getPlantTimelineData";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function usePlantTimeline(plantId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => getPlantTimelineData(user.uid, plantId) : null,
    [user?.uid, plantId]
  );
}
