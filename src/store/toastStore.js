import { create } from "zustand";

export const useToast = create((set) => ({
  message: null,
  type: "info", // "info" | "success" | "error"
  show: (message, type = "info") => set({ message, type }),
  clear: () => set({ message: null }),
}));
