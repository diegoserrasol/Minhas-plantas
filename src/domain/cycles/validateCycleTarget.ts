export class CycleTargetError extends Error {}

/**
 * A cycle or application must target exactly one of plant/group, never
 * both and never neither. Enforced here so it cannot be bypassed by
 * skipping a form validator.
 */
export function validateTarget(plantId?: string, groupId?: string): void {
  const hasPlant = Boolean(plantId);
  const hasGroup = Boolean(groupId);

  if (hasPlant === hasGroup) {
    throw new CycleTargetError(
      "Informe uma planta OU um grupo, nunca os dois ou nenhum."
    );
  }
}
