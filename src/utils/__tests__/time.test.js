import { describe, test, expect } from "vitest";
import { minsToHhmm, hhmmToMins, formatRange } from "../time";

describe("time utils", () => {
  test("minsToHhmm", () => {
    expect(minsToHhmm(0)).toBe("00:00");
    expect(minsToHhmm(75)).toBe("01:15");
    expect(minsToHhmm(8 * 60)).toBe("08:00");
  });

  test("hhmmToMins", () => {
    expect(hhmmToMins("01:15")).toBe(75);
    expect(hhmmToMins("08:00")).toBe(480);
    expect(hhmmToMins("bad")).toBe(null);
    expect(hhmmToMins("")).toBe(null);
  });

  test("formatRange", () => {
    expect(formatRange(480, 90)).toBe("08:00–09:30");
    expect(formatRange(null, 60)).toBe(null);
  });
});
