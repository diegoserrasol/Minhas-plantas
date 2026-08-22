import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import { groupsRepository } from "@/services/firebase/firestore/groupsRepository";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import type { Group, Plant } from "@/types/entities";

export type CreateGroupInput = Omit<Group, "id" | "createdAt" | "updatedAt">;

export async function createGroup(input: CreateGroupInput): Promise<Group> {
  const now = new Date();
  return groupsRepository.create(input.userId, {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateGroup(
  userId: string,
  groupId: string,
  data: Partial<Omit<Group, "id" | "userId" | "createdAt">>
): Promise<void> {
  await groupsRepository.update(userId, groupId, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteGroup(userId: string, groupId: string): Promise<void> {
  const cycles = await cyclesRepository.listByGroupId(userId, groupId);
  await Promise.all(
    cycles.map((cycle) =>
      cyclesRepository.update(userId, cycle.id, { status: "excluido" })
    )
  );
  await groupsRepository.remove(userId, groupId);
}

export async function listGroups(userId: string): Promise<Group[]> {
  return groupsRepository.list(userId);
}

export async function getGroup(
  userId: string,
  groupId: string
): Promise<Group | null> {
  return groupsRepository.getById(userId, groupId);
}

export async function getGroupMembers(
  userId: string,
  groupId: string
): Promise<Plant[]> {
  return plantsRepository.listByGroupId(userId, groupId);
}

export async function addPlantToGroup(
  userId: string,
  plantId: string,
  groupId: string
): Promise<void> {
  await plantsRepository.update(userId, plantId, { groupId });
}

export async function removePlantFromGroup(
  userId: string,
  plantId: string
): Promise<void> {
  await plantsRepository.update(userId, plantId, { groupId: undefined });
}
