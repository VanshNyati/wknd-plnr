import { memo, useCallback } from "react";
import * as RW from "react-window"; // works across ESM/CJS variants
import { ActivityCard } from "../molecules/ActivityCard.jsx";

// Support both shapes: { FixedSizeList } or default.FixedSizeList
const ListImpl = RW.FixedSizeList || (RW.default && RW.default.FixedSizeList);

/**
 * Virtualized list for the activity catalog.
 * Props:
 *  - items: array of activity objects
 *  - onAdd: (day, activity) => void
 *  - addedSat: (activityId) => boolean
 *  - addedSun: (activityId) => boolean
 *  - height?: number
 *  - rowHeight?: number
 */
function Row({ index, style, data }) {
  const a = data.items[index];
  const addedSat = data.addedSat(a.id);
  const addedSun = data.addedSun(a.id);

  return (
    <div style={style} className="px-0.5">
      <ActivityCard
        activity={a}
        addedSat={addedSat}
        addedSun={addedSun}
        onAdd={(day) => data.onAdd(day, a)}
      />
    </div>
  );
}

function ActivityList({
  items,
  onAdd,
  addedSat,
  addedSun,
  height = 560,
  rowHeight = 132,
}) {
  // If react-window couldn't be resolved as expected, fall back gracefully
  if (!ListImpl) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((a) => (
          <ActivityCard
            key={a.id}
            activity={a}
            addedSat={addedSat(a.id)}
            addedSun={addedSun(a.id)}
            onAdd={(day) => onAdd(day, a)}
          />
        ))}
      </div>
    );
  }

  const itemData = { items, onAdd, addedSat, addedSun };
  const itemKey = useCallback((idx, data) => data.items[idx].id, []);

  return (
    <ListImpl
      height={height}
      width="100%"
      itemCount={items.length}
      itemSize={rowHeight}
      itemData={itemData}
      itemKey={itemKey}
      overscanCount={6}
    >
      {Row}
    </ListImpl>
  );
}

export default memo(ActivityList);
