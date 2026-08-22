import type { Group } from "@/types/entities";
import { createUserSubcollectionRepository } from "./createUserSubcollectionRepository";

export const groupsRepository = createUserSubcollectionRepository<Group>(
  "groups"
);
