import {
  getGroup,
  getGroupMembers,
  listGroups,
} from "@/features/groups/useCases/groupUseCases";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function useGroups() {
  const { user } = useAuth();
  return useAsyncData(user ? () => listGroups(user.uid) : null, [user?.uid]);
}

export function useGroup(groupId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => getGroup(user.uid, groupId) : null,
    [user?.uid, groupId]
  );
}

export function useGroupMembers(groupId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => getGroupMembers(user.uid, groupId) : null,
    [user?.uid, groupId]
  );
}
