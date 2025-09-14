import { create } from "zustand";

export const useUIStore = create((set) => ({
  // filters
  search: "",
  category: "All",
  vibe: "All",

  // layout density (kept as-is)
  density: "compact", // "compact" | "comfortable"

  // THEME (NEW)
  theme: "dark", // "dark" | "light"

  // setters
  setSearch: (v) => set({ search: v }),
  setCategory: (v) => set({ category: v }),
  setVibe: (v) => set({ vibe: v }),

  // optional density toggle (unchanged)
  toggleDensity: () =>
    set((s) => ({
      density: s.density === "comfortable" ? "compact" : "comfortable",
    })),

  // NEW: theme toggle
  toggleTheme: () =>
    set((s) => ({
      theme: s.theme === "dark" ? "light" : "dark",
    })),
}));
