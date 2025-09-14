export const minsToHhmm = (mins) => {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const hhmmToMins = (hhmm) => {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatRange = (startMins, durationMins) => {
  if (startMins == null || durationMins == null) return null;
  const end = startMins + durationMins;
  return `${minsToHhmm(startMins)}–${minsToHhmm(end)}`;
};
