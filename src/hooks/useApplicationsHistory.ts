import { getApplicationsHistory } from "@/features/applications/useCases/getApplicationsHistory";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function useApplicationsHistory() {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => getApplicationsHistory(user.uid) : null,
    [user?.uid]
  );
}
