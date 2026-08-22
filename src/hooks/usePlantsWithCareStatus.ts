import { getPlantsWithCareStatus } from "@/features/plants/useCases/getPlantsWithCareStatus";
import { todayLocalDate } from "@/lib/date";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function usePlantsWithCareStatus() {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => getPlantsWithCareStatus(user.uid, todayLocalDate()) : null,
    [user?.uid]
  );
}
