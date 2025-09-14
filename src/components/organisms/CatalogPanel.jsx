// src/components/organisms/CatalogPanel.jsx
import { ACTIVITIES } from "../../data/activities";
import { useUIStore } from "../../store/uiStore";
import { usePlanStore } from "../../store/planStore";
import FilterBar from "../molecules/FilterBar";
import { ActivityCard } from "../molecules/ActivityCard.jsx";
import ActivityList from "../catalog/ActivityList.jsx"; // NEW

export default function CatalogPanel() {
  const search = useUIStore((s) => s.search);
  const category = useUIStore((s) => s.category);
  const vibe = useUIStore((s) => s.vibe);

  const blocks = usePlanStore((s) => s.blocks);
  const addToDay = usePlanStore((s) => s.addToDay);

  const filtered = ACTIVITIES.filter((a) => {
    const s = search.trim().toLowerCase();
    const bySearch = !s || a.title.toLowerCase().includes(s);
    const byCat = category === "All" || a.category === category;
    const byVibe = vibe === "All" || a.vibe === vibe;
    return bySearch && byCat && byVibe;
  });

  const isAdded = (actId, day) =>
    blocks.some((b) => b.day === day && b.activityId === actId);

  const addedSat = (id) => isAdded(id, "sat");
  const addedSun = (id) => isAdded(id, "sun");

  // Use virtualization only when the list is big; otherwise keep your grid
  const USE_VIRTUAL = filtered.length > 30;

  return (
    <div className="virtual-pane">
      <div className="mb-3">
        <FilterBar />
      </div>

      {USE_VIRTUAL ? (
        <ActivityList
          items={filtered}
          onAdd={(day, a) => addToDay(a, day)}
          addedSat={addedSat}
          addedSun={addedSun}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              addedSat={isAdded(a.id, "sat")}
              addedSun={isAdded(a.id, "sun")}
              onAdd={(day) => addToDay(a, day)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
