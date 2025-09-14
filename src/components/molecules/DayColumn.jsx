import React, { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Button from "../atoms/Button";
import Tag from "../atoms/Tag";
import { formatRange } from "../../utils/time";
import { useUIStore } from "../../store/uiStore";

const catColor = {
  Food: "from-rose-400 to-rose-300",
  Outdoor: "from-emerald-400 to-emerald-300",
  Indoor: "from-indigo-400 to-indigo-300",
  Social: "from-pink-400 to-pink-300",
  Fitness: "from-blue-400 to-blue-300",
};

/**
 * Portal the dragging element to <body> so any ancestor transform/filters/blur
 * cannot offset the fixed-position clone.
 */
function useDraggableInPortal() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = document.createElement("div");
    mount.style.position = "fixed";
    mount.style.pointerEvents = "none";
    mount.style.top = "0";
    mount.style.left = "0";
    mountRef.current = mount;
    document.body.appendChild(mount);
    return () => {
      document.body.removeChild(mount);
    };
  }, []);

  return (render) => (provided, snapshot, rubric) => {
    const child = render(provided, snapshot, rubric);
    if (!snapshot.isDragging) return child;
    return createPortal(child, mountRef.current);
  };
}

export default function DayColumn({
  containerId,
  label,
  blocks,
  onRemove,
  onEdit,
  totalMins = 0,
  conflicts = new Map(),
}) {
  const density = useUIStore((s) => s.density ?? "compact");

  const hr = Math.floor(totalMins / 60);
  const min = totalMins % 60;

  const padCard = density === "compact" ? "p-3" : "p-4";
  const titleSize = density === "compact" ? "text-base" : "text-lg";

  const renderDraggable = useDraggableInPortal();

  return (
    <div className={`card ${padCard}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`${titleSize} font-semibold text-slate-900`}>{label}</h3>
        <span className="text-xs text-slate-500">
          {blocks.length} item(s)
          {totalMins ? ` • ${hr ? `${hr}h` : ""}${min ? `${min}m` : ""}` : ""}
        </span>
      </div>

      <Droppable droppableId={containerId} type="BLOCK" direction="vertical">
        {(dropProvided, dropSnapshot) => (
          <ul
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            className="space-y-3 list-none p-0 m-0 relative w-full"
          >
            {blocks.length === 0 && !dropSnapshot.isDraggingOver ? (
              <li className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                No activities yet. Add from the catalog →
              </li>
            ) : null}

            {blocks.map((b, index) => (
              <Draggable key={b.id} draggableId={b.id} index={index}>
                {renderDraggable((dragProvided, dragSnapshot) => (
                  <SortableBlock
                    block={b}
                    provided={dragProvided}
                    snapshot={dragSnapshot}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    density={density}
                    conflictMsg={conflicts.get(b.id)}
                  />
                ))}
              </Draggable>
            ))}

            {dropProvided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
}

const SortableBlock = memo(function SortableBlock({
  block: b,
  provided,
  snapshot,
  onRemove,
  onEdit,
  density,
  conflictMsg,
}) {
  const leftGrad = catColor[b.category] || "from-slate-300 to-slate-200";
  const range = formatRange(b.startMins, b.durationMins);

  const pad = density === "compact" ? "p-2.5" : "p-3";
  const gap = density === "compact" ? "gap-2" : "gap-3";
  const title = density === "compact" ? "text-sm" : "text-base";

  // IMPORTANT: only force width to 100% when NOT dragging, otherwise
  // the fixed-position clone becomes full-viewport width.
  const style = {
    ...provided.draggableProps.style,
    boxSizing: "border-box",
    boxShadow: snapshot.isDragging ? "0 12px 24px rgba(2,6,23,.12)" : undefined,
    ...(snapshot.isDragging ? {} : { width: "100%", maxWidth: "100%" }),
  };

  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={style}
      className={`rounded-lg border ${
        conflictMsg
          ? "border-rose-300 ring-1 ring-rose-200"
          : "border-slate-200"
      } bg-white ${pad} select-none`}
      aria-roledescription="draggable item"
    >
      <div className="relative">
        <span
          className={`absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-full bg-gradient-to-b ${leftGrad}`}
        />

        {/* Always vertical stack; actions at the bottom */}
        <div className={`pl-3 flex flex-col ${gap}`}>
          <div className={`flex items-start ${gap} min-w-0 flex-1`}>
            {/* Drag handle */}
            <button
              className="drag-handle shrink-0 rounded-md px-1.5 py-1 ring-1 ring-slate-200 hover:bg-slate-50"
              aria-label="Drag to reorder"
              {...provided.dragHandleProps}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <circle cx="5" cy="6" r="1" />
                <circle cx="5" cy="10" r="1" />
                <circle cx="5" cy="14" r="1" />
                <circle cx="9" cy="6" r="1" />
                <circle cx="9" cy="10" r="1" />
                <circle cx="9" cy="14" r="1" />
              </svg>
            </button>

            <span className="text-xl shrink-0">{b.icon}</span>

            <div className="min-w-0 flex-1">
              <div className={`font-medium text-slate-900 truncate ${title}`}>
                {b.title}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <Tag>{b.category}</Tag>
                <span>{b.durationMins} mins</span>
                {range ? (
                  <span className="text-slate-500">• {range}</span>
                ) : null}
                {b.notes ? (
                  <span className="italic text-slate-500 truncate">
                    “{b.notes}”
                  </span>
                ) : null}
                {conflictMsg ? (
                  <Tag
                    variant="solid"
                    color="amber"
                    className="!text-white !inline-block whitespace-normal leading-tight break-words max-w-[220px] sm:max-w-none"
                  >
                    ⚠ {conflictMsg}
                  </Tag>
                ) : null}
              </div>
            </div>
          </div>

          {/* ACTIONS — ALWAYS BELOW */}
          <div className="mt-1 flex gap-2 w-full">
            <Button
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => onEdit(b)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="w-full sm:w-auto"
              onClick={() => onRemove(b.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
});
