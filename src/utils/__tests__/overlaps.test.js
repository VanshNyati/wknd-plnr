import { describe, test, expect } from "vitest";
import { analyzeOverlaps } from "../overlaps";

const mk = (id, title, start, dur) => ({
  id,
  title,
  startMins: start,
  durationMins: dur,
});

describe("analyzeOverlaps", () => {
  test("no overlaps", () => {
    const a = mk("a", "A", 8 * 60, 60); // 08:00–09:00
    const b = mk("b", "B", 9 * 60, 60); // 09:00–10:00
    const map = analyzeOverlaps([a, b]);
    expect(map.size).toBe(0);
  });

  test("adjacent overlaps are flagged both sides", () => {
    const a = mk("a", "Hiking", 8 * 60, 120); // 08:00–10:00
    const b = mk("b", "Photography Walk", 9 * 60, 60); // 09:00–10:00
    const map = analyzeOverlaps([a, b]);

    expect(map.get("a")).toBe("overlaps with Photography Walk 09:00–10:00");
    expect(map.get("b")).toBe("overlaps with Hiking 08:00–10:00");
  });

  test("unscheduled items are ignored", () => {
    const a = mk("a", "A", null, 60);
    const b = mk("b", "B", 10 * 60, 30);
    const map = analyzeOverlaps([a, b]);
    expect(map.size).toBe(0);
  });
});
