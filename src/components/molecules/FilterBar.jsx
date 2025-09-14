import { CATEGORIES, VIBES } from "../../data/activities";
import { useUIStore } from "../../store/uiStore";

export default function FilterBar() {
  const { search, category, vibe, setSearch, setCategory, setVibe } =
    useUIStore();

  return (
    <div className="glass rounded-xl p-2 md:p-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <label className="w-full md:max-w-sm">
          <span className="sr-only">Search activities</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities…"
            className="input"
            aria-label="Search activities"
          />
        </label>

        <div className="flex gap-2">
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select"
              aria-label="Filter by category"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by vibe</span>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="select"
              aria-label="Filter by vibe"
            >
              {VIBES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
