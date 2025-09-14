import { formatRange } from "./time";

/**
 * Returns Map<blockId, message> for overlapping blocks.
 * Blocks need: id, title, startMins, durationMins
 */
export function analyzeOverlaps(blocks) {
  const m = new Map();
  const sched = blocks
    .filter((b) => b.startMins != null && b.durationMins != null)
    .sort((a, b) => a.startMins - b.startMins);

  for (let i = 1; i < sched.length; i++) {
    const prev = sched[i - 1];
    const curr = sched[i];
    const prevEnd = prev.startMins + prev.durationMins;
    if (curr.startMins < prevEnd) {
      const msgPrev = `overlaps with ${curr.title} ${formatRange(
        curr.startMins,
        curr.durationMins
      )}`;
      const msgCurr = `overlaps with ${prev.title} ${formatRange(
        prev.startMins,
        prev.durationMins
      )}`;
      if (!m.has(prev.id)) m.set(prev.id, msgPrev);
      if (!m.has(curr.id)) m.set(curr.id, msgCurr);
    }
  }
  return m;
}
