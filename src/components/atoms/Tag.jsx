export default function Tag({
  children,
  className = "",
  variant = "soft",
  color = "slate",
}) {
  const base = "chip";
  const kind = variant === "solid" ? "chip-solid" : "chip-soft";

  const solidColors = {
    amber: "bg-amber-500",
    green: "bg-green-500",
    sky: "bg-sky-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    slate: "bg-slate-700",
  };

  const colorClass =
    variant === "solid" ? solidColors[color] || solidColors.slate : "";

  return (
    <span className={`${base} ${kind} ${colorClass} ${className}`}>
      {children}
    </span>
  );
}
