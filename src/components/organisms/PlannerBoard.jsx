import { useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { usePlanStore } from "../../store/planStore";
import DayColumn from "../molecules/DayColumn";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import { hhmmToMins, minsToHhmm } from "../../utils/time";
import { analyzeOverlaps } from "../../utils/overlaps";

export default function PlannerBoard() {
  const blocks = usePlanStore((s) => s.blocks);
  const removeBlock = usePlanStore((s) => s.removeBlock);
  const updateBlock = usePlanStore((s) => s.updateBlock);
  const moveBlockToDay = usePlanStore((s) => s.moveBlockToDay);
  const clearPlan = usePlanStore((s) => s.clearPlan);

  const [editing, setEditing] = useState(null);

  const byDay = useMemo(() => {
    const sat = blocks.filter((b) => b.day === "sat");
    const sun = blocks.filter((b) => b.day === "sun");
    const sum = (arr) => arr.reduce((t, b) => t + (b.durationMins || 0), 0);
    return {
      sat,
      sun,
      satTotal: sum(sat),
      sunTotal: sum(sun),
      satConflicts: analyzeOverlaps(sat),
      sunConflicts: analyzeOverlaps(sun),
    };
  }, [blocks]);

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const samePlace =
      destination.droppableId === source.droppableId &&
      destination.index === source.index;
    if (samePlace) return;

    moveBlockToDay(draggableId, destination.droppableId, destination.index);
  }

  return (
    <div className="space-y-4" id="plan-panel">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">Your Weekend Plan</h2>
        <Button variant="ghost" onClick={clearPlan}>
          Clear Plan
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DayColumn
            containerId="sat"
            label="Saturday"
            blocks={byDay.sat}
            totalMins={byDay.satTotal}
            conflicts={byDay.satConflicts}
            onRemove={removeBlock}
            onEdit={(b) => setEditing(b)}
          />
          <DayColumn
            containerId="sun"
            label="Sunday"
            blocks={byDay.sun}
            totalMins={byDay.sunTotal}
            conflicts={byDay.sunConflicts}
            onRemove={removeBlock}
            onEdit={(b) => setEditing(b)}
          />
        </div>
      </DragDropContext>

      <EditModal
        block={editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (!editing) return;
          updateBlock(editing.id, patch);
          setEditing(null);
        }}
        onMoveDay={(newDay) => {
          if (!editing) return;
          usePlanStore.getState().moveBlockToDay(editing.id, newDay, 0);
          setEditing(null);
        }}
      />
    </div>
  );
}

function EditModal({ block, onClose, onSave, onMoveDay }) {
  if (!block) return null;
  const [notesVal, setNotes] = useState(block.notes ?? "");
  const [timeVal, setTime] = useState(
    block.startMins != null ? minsToHhmm(block.startMins) : ""
  );
  const [dayVal, setDay] = useState(block.day);
  const [durVal, setDur] = useState(block.durationMins ?? 60);
  const clamp = (n) => Math.min(300, Math.max(15, Math.round(n / 15) * 15));

  return (
    <Modal
      open={!!block}
      onClose={onClose}
      title={`${block.icon} Edit "${block.title}"`}
      actions={
        <>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary text-white"
            onClick={() =>
              onSave({
                notes: notesVal,
                startMins: timeVal ? hhmmToMins(timeVal) : null,
                durationMins: clamp(durVal),
              })
            }
          >
            Save
          </button>
        </>
      }
    >
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600">Notes</span>
          <textarea
            value={notesVal}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input"
            placeholder="Add a small note…"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-slate-600">Optional start time (HH:MM)</span>
          <input
            value={timeVal}
            onChange={(e) => setTime(e.target.value)}
            placeholder="14:30"
            className="input"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-slate-600">Duration (mins)</span>
          <div className="flex gap-2">
            <input
              type="number"
              min={15}
              max={300}
              step={15}
              value={durVal}
              onChange={(e) => setDur(Number(e.target.value || 60))}
              className="input"
            />
            <div className="flex gap-1">
              {[30, 60, 90, 120].map((v) => (
                <button key={v} className="btn-ghost" onClick={() => setDur(v)}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-slate-600">Move to day</span>
          <div className="flex items-center gap-2">
            <select
              value={dayVal}
              onChange={(e) => setDay(e.target.value)}
              className="select"
            >
              <option value="sat">Saturday</option>
              <option value="sun">Sunday</option>
            </select>
            <button className="btn-dark" onClick={() => onMoveDay(dayVal)}>
              Move
            </button>
          </div>
        </label>
      </div>
    </Modal>
  );
}
