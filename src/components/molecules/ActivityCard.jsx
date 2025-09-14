import Button from "../atoms/Button";
import Tag from "../atoms/Tag";
import { useUIStore } from "../../store/uiStore";

export const ActivityCard = ({ activity, onAdd, addedSat, addedSun }) => {
  const density = useUIStore((s) => s.density);
  const pad = density === "compact" ? "p-3" : "p-4";
  const title = density === "compact" ? "text-sm" : "text-base";

  const Disabled = ({ children }) => (
    <span
      className="btn btn-sm btn-muted w-full text-center"
      title="Already in that day"
    >
      {children}
    </span>
  );

  return (
    <div className={`card card-hover ${pad}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{activity.icon}</span>
        <h4 className={`${title} font-semibold text-slate-900`}>
          {activity.title}
        </h4>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tag>{activity.category}</Tag>
        <Tag>{activity.vibe}</Tag>
        <span className="text-xs text-slate-500">
          {activity.durationMins} mins
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {addedSat ? (
          <Disabled>Added to Sat</Disabled>
        ) : (
          <Button size="sm" className="w-full" onClick={() => onAdd("sat")}>
            Add to Sat
          </Button>
        )}

        {addedSun ? (
          <Disabled>Added to Sun</Disabled>
        ) : (
          <Button
            size="sm"
            className="w-full"
            variant="dark"
            onClick={() => onAdd("sun")}
          >
            Add to Sun
          </Button>
        )}
      </div>
    </div>
  );
};
