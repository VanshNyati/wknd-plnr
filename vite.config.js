import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // <— add this
    environment: "node",
    include: ["src/**/*.test.{js,jsx}", "src/**/__tests__/*.{js,jsx}"],
  },
});
