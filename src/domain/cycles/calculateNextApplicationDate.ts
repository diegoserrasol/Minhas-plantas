import { addDays, addMonths, addWeeks } from "date-fns";
import type { FrequencyUnit } from "@/types/entities";

export function addFrequency(
  date: Date,
  value: number,
  unit: FrequencyUnit
): Date {
  switch (unit) {
    case "dias":
      return addDays(date, value);
    case "semanas":
      return addWeeks(date, value);
    case "meses":
      return addMonths(date, value);
  }
}

export function calculateNextApplicationDate(
  applicationDate: Date,
  frequencyValue: number,
  frequencyUnit: FrequencyUnit
): Date {
  return addFrequency(applicationDate, frequencyValue, frequencyUnit);
}
