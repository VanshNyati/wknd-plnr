import Button from "../atoms/Button";
import { PRESETS } from "../../data/presets";
import { ACTIVITIES } from "../../data/activities";
import { usePlanStore } from "../../store/planStore";

const byId = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a]));

export default function PresetBar() {
  const clearPlan = usePlanStore((s) => s.clearPlan);
  const addToDay = usePlanStore((s) => s.addToDay);

  const apply = (name) => {
    const preset = PRESETS[name];
    if (!preset) return;
    clearPlan();
    for (const id of preset.sat) addToDay(byId[id], "sat");
    for (const id of preset.sun) addToDay(byId[id], "sun");
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(PRESETS).map((k) => (
        <Button key={k} variant="ghost" size="sm" onClick={() => apply(k)}>
          {k} weekend
        </Button>
      ))}
    </div>
  );
}
