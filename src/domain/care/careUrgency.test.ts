import { describe, expect, it } from "vitest";
import { parseLocalDate } from "@/lib/date";
import {
  daysBetween,
  formatDaysSince,
  formatDaysUntil,
  getCareUrgency,
} from "./careUrgency";

const d = parseLocalDate;

describe("getCareUrgency", () => {
  const today = d("2026-08-22");

  it("flags a past date as atrasado", () => {
    expect(getCareUrgency(d("2026-08-20"), today)).toBe("atrasado");
  });

  it("flags today as hoje", () => {
    expect(getCareUrgency(d("2026-08-22"), today)).toBe("hoje");
  });

  it("flags a future date as proximo", () => {
    expect(getCareUrgency(d("2026-08-30"), today)).toBe("proximo");
  });
});

describe("daysBetween", () => {
  it("is zero for the same calendar day regardless of time-of-day", () => {
    const morning = new Date(2026, 7, 22, 2, 0, 0);
    const night = new Date(2026, 7, 22, 23, 0, 0);
    expect(daysBetween(morning, night)).toBe(0);
  });
});

describe("formatDaysSince / formatDaysUntil", () => {
  const today = d("2026-08-22");

  it("formats 18 days ago", () => {
    expect(formatDaysSince(d("2026-08-04"), today)).toBe("há 18 dias");
  });

  it("formats tomorrow", () => {
    expect(formatDaysUntil(d("2026-08-23"), today)).toBe("amanhã");
  });

  it("formats an overdue next date via formatDaysUntil", () => {
    expect(formatDaysUntil(d("2026-08-20"), today)).toBe("há 2 dias");
  });
});
