import Planner from "./pages/Planner";
import { exportImage } from "./utils/share";
import { useState, useEffect, useCallback } from "react";
import { usePlanStore } from "./store/planStore";
import { useToast } from "./store/toastStore";
import { useUIStore } from "./store/uiStore";
import Button from "./components/atoms/Button";

export default function App() {
  // Hydration gate
  const [ready, setReady] = useState(
    usePlanStore.persist.hasHydrated?.() ?? false
  );

  useEffect(() => {
    const unsub = usePlanStore.persist.onFinishHydration?.(() =>
      setReady(true)
    );
    return () => unsub?.();
  }, []);

  const toast = useToast((s) => s.show);

  // THEME
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const onShare = useCallback(async () => {
    const res = await exportImage("#plan-panel");
    if (res === "shared") toast("Shared plan via native share!", "success");
    else if (res === "copied") toast("Image copied to clipboard!", "success");
    else toast("Image downloaded.", "success");

    try {
      const { default: confetti } = await import("canvas-confetti");
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.2 } });
    } catch {}
  }, [toast]);

  if (!ready) return null;

  return (
    <div className="min-h-screen relative">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:outline-none focus:ring-2 ring-white/70 bg-black text-white px-3 py-2 absolute left-3 top-3 rounded-md z-50"
      >
        Skip to content
      </a>

      <header className="container-page py-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="heading-1">Weekendly</h1>

          <div className="header-actions">
            <div className="btn-group">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "Light theme" : "Dark theme"}
              </Button>
              <Button variant="dark" size="sm" onClick={onShare}>
                Share / Save Image
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="container-page">
        <Planner />
      </main>

      <footer className="container-page py-10 text-xs md:text-sm text-white/60 text-center">
        Built with ❤️ for the weekend dreamers by Vansh Nyati.
      </footer>
    </div>
  );
}
