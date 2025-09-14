// src/store/planStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const VERSION = 1;
const STORAGE_KEY = "wknd-plan-v1";

const initial = () => ({
  blocks: [], // [{id, activityId, title, icon, category, day: 'sat'|'sun', startMins, durationMins, notes}]
});

export const usePlanStore = create(
  persist(
    (set, get) => ({
      ...initial(),

      addToDay: (activity, day) =>
        set((s) => {
          // de-dupe by day+activityId if you want; here we allow multiples
          const block = {
            id: crypto.randomUUID(),
            activityId: activity.id,
            title: activity.title,
            icon: activity.icon,
            category: activity.category,
            day,
            startMins: null,
            durationMins: activity.durationMins ?? 60,
            notes: "",
          };
          return { blocks: [...s.blocks, block] };
        }),

      removeBlock: (id) =>
        set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) })),

      updateBlock: (id, patch) =>
        set((s) => ({
          blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),

      moveBlockToDay: (id, day, index = 0) =>
        set((s) => {
          const src = s.blocks.find((b) => b.id === id);
          if (!src) return {};
          const rest = s.blocks.filter((b) => b.id !== id);
          const target = { ...src, day };
          const into = [];
          let i = 0;
          for (const b of rest) {
            if (b.day === day && i === index) {
              into.push(target);
            }
            into.push(b);
            if (b.day === day) i++;
          }
          if (i <= index) into.push(target);
          return { blocks: into };
        }),

      clearPlan: () => set(initial()),
    }),
    {
      name: STORAGE_KEY,
      version: VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (state, version) => {
        // simple forward-compatible migration
        if (!state) return initial();
        if (version < 1) return { ...state, version: 1 };
        return state;
      },
      // smaller payloads & fewer re-renders
      partialize: (s) => ({ blocks: s.blocks }),
    }
  )
);
