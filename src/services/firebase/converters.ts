import {
  type DocumentData,
  type FirestoreDataConverter,
  Timestamp,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !(value instanceof Date) &&
    !(value instanceof Timestamp) &&
    !Array.isArray(value)
  );
}

/**
 * Recursively drops `undefined` values from a plain object/array.
 * Firestore's `setDoc`/`updateDoc` reject `undefined` outright (unlike
 * `null`), and optional entity fields (species, notes, groupId...) are
 * routinely `undefined` when left blank in a form. `updateDoc` bypasses
 * the custom converter entirely, so every write path — `create` via
 * `toFirestore` below, and the repository's raw `updateDoc` calls — must
 * apply this independently.
 */
export function stripUndefinedDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripUndefinedDeep);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, val]) => val !== undefined)
        .map(([key, val]) => [key, stripUndefinedDeep(val)])
    );
  }
  return value;
}

/** Recursively converts every `Date` in a plain object/array into a Firestore `Timestamp`. */
function datesToTimestamps(value: unknown): unknown {
  if (value instanceof Date) return Timestamp.fromDate(value);
  if (Array.isArray(value)) return value.map(datesToTimestamps);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, datesToTimestamps(val)])
    );
  }
  return value;
}

/** Recursively converts every Firestore `Timestamp` back into a `Date`. */
function timestampsToDates(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate();
  if (Array.isArray(value)) return value.map(timestampsToDates);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, timestampsToDates(val)])
    );
  }
  return value;
}

/**
 * Builds a Firestore converter for entities that use plain `Date` in the
 * domain layer. Keeps Timestamp<->Date conversion out of every repository
 * and out of components entirely.
 */
export function makeConverter<
  T extends { id: string },
>(): FirestoreDataConverter<T> {
  return {
    toFirestore(entity: T): DocumentData {
      const rest: Partial<T> = { ...entity };
      delete rest.id;
      return stripUndefinedDeep(datesToTimestamps(rest)) as DocumentData;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options?: SnapshotOptions
    ): T {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        ...(timestampsToDates(data) as Omit<T, "id">),
      } as T;
    },
  };
}
