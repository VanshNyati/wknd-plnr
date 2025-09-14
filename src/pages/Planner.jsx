import CatalogPanel from "../components/organisms/CatalogPanel";
import PlannerBoard from "../components/organisms/PlannerBoard";
import PresetBar from "../components/molecules/PresetBar";

export default function Planner() {
  return (
    <section
      className="
        grid grid-cols-1 gap-6 pb-12
        lg:grid-cols-[380px,1fr]
        xl:grid-cols-[420px,1fr]
        2xl:grid-cols-[460px,1fr]
      "
    >
      <div className="panel min-w-0">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="heading-2 mb-0 text-white/90">Activity Catalog</h2>
          <PresetBar />
        </div>
        <CatalogPanel />
      </div>

      <div className="panel min-w-0">
        <PlannerBoard />
      </div>
    </section>
  );
}
