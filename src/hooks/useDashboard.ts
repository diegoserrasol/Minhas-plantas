import { getDashboardData } from "@/features/care/useCases/getDashboardData";
import { todayLocalDate } from "@/lib/date";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function useDashboard() {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => getDashboardData(user.uid, todayLocalDate()) : null,
    [user?.uid]
  );
}
