import { format } from "date-fns";

/**
 * `new Date("YYYY-MM-DD")` parses as UTC midnight, which drifts to the
 * previous calendar day in negative-offset timezones once read back with
 * local getters (which date-fns arithmetic uses). Every date-only string
 * from a `<input type=date>` or a default "today" must go through this
 * instead, so cycle math never silently loses/gains a day.
 */
export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateInputValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function todayLocalDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
