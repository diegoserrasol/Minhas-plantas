import {
  differenceInCalendarDays,
  startOfDay,
} from "date-fns";
import type { CareUrgency } from "@/types/view-models";

export function daysBetween(from: Date, to: Date): number {
  return differenceInCalendarDays(startOfDay(to), startOfDay(from));
}

export function getCareUrgency(
  nextApplicationDate: Date,
  today: Date
): CareUrgency {
  const days = daysBetween(today, nextApplicationDate);
  if (days < 0) return "atrasado";
  if (days === 0) return "hoje";
  return "proximo";
}

export function formatDaysSince(date: Date, today: Date): string {
  const days = daysBetween(date, today);
  if (days === 0) return "hoje";
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
}

export function formatDaysUntil(date: Date, today: Date): string {
  const days = daysBetween(today, date);
  if (days < 0) return formatDaysSince(date, today);
  if (days === 0) return "hoje";
  if (days === 1) return "amanhã";
  return `em ${days} dias`;
}
