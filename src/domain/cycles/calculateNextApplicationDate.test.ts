import { format } from "date-fns";
import { describe, expect, it } from "vitest";
import { parseLocalDate } from "@/lib/date";
import { calculateNextApplicationDate } from "./calculateNextApplicationDate";
import { applyCycleUpdate } from "./applyCycleUpdate";
import type { CareCycle } from "@/types/entities";

const ymd = (date: Date) => format(date, "yyyy-MM-dd");
const d = parseLocalDate;

describe("calculateNextApplicationDate", () => {
  it("adds days", () => {
    const result = calculateNextApplicationDate(d("2026-08-01"), 15, "dias");
    expect(ymd(result)).toBe("2026-08-16");
  });

  it("adds weeks", () => {
    const result = calculateNextApplicationDate(
      d("2026-08-01"),
      2,
      "semanas"
    );
    expect(ymd(result)).toBe("2026-08-15");
  });

  it("adds months and handles month-end overflow", () => {
    const result = calculateNextApplicationDate(d("2026-01-31"), 1, "meses");
    // date-fns clamps to the last valid day of the target month
    expect(ymd(result)).toBe("2026-02-28");
  });

  it("crosses a year boundary", () => {
    const result = calculateNextApplicationDate(d("2026-12-15"), 3, "meses");
    expect(ymd(result)).toBe("2027-03-15");
  });
});

describe("applyCycleUpdate", () => {
  const baseCycle: CareCycle = {
    id: "c1",
    userId: "u1",
    plantId: "p1",
    productId: "prod1",
    frequencyValue: 15,
    frequencyUnit: "dias",
    startDate: d("2026-07-01"),
    status: "ativo",
    createdAt: d("2026-07-01"),
    updatedAt: d("2026-07-01"),
  };

  it("updates lastApplicationDate and recalculates nextApplicationDate", () => {
    const applicationDate = d("2026-08-01");
    const updated = applyCycleUpdate(baseCycle, applicationDate);

    expect(updated.lastApplicationDate).toEqual(applicationDate);
    expect(
      updated.nextApplicationDate && ymd(updated.nextApplicationDate)
    ).toBe("2026-08-16");
  });

  it("does not mutate the original cycle", () => {
    const applicationDate = d("2026-08-01");
    applyCycleUpdate(baseCycle, applicationDate);

    expect(baseCycle.lastApplicationDate).toBeUndefined();
  });
});
