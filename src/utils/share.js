import html2canvas from "html2canvas";

/**
 * Export an element as an image with DPR scaling + margins + watermark.
 * Accepts either a DOM element or a CSS selector string for `target`.
 * opts: { dpr=2, margin=24, fileName="weekendly-plan", watermark="Weekendly" }
 * Returns: "shared" | "copied" | "downloaded"
 */
export async function exportImage(target, opts = {}) {
  const dpr = opts.dpr ?? Math.min(window.devicePixelRatio || 1, 2);
  const margin = opts.margin ?? 24;

  // NEW: resolve selector → element
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) throw new Error("exportImage: element not found");

  const canvas = await html2canvas(el, {
    backgroundColor: "#0f172a",
    scale: dpr,
    useCORS: true,
    windowWidth: document.documentElement.clientWidth,
  });

  // add white margin + watermark
  const out = document.createElement("canvas");
  out.width = canvas.width + margin * 2 * dpr;
  out.height = canvas.height + margin * 2 * dpr;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, margin * dpr, margin * dpr);

  ctx.fillStyle = "rgba(0,0,0,.45)";
  ctx.font = `${12 * dpr}px ui-sans-serif, system-ui`;
  ctx.textAlign = "right";
  ctx.fillText(
    opts.watermark ?? "Weekendly",
    out.width - 12 * dpr,
    out.height - 12 * dpr
  );

  const blob = await new Promise((res) => out.toBlob(res, "image/png"));
  const file = new File([blob], `${opts.fileName ?? "weekendly-plan"}.png`, {
    type: "image/png",
  });

  // Try native share first
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Weekendly Plan" });
      return "shared";
    } catch {
      /* fallthrough */
    }
  }

  // Try clipboard copy (Safari/Chrome w/ permissions)
  if (
    navigator.clipboard &&
    "write" in navigator.clipboard &&
    window.ClipboardItem
  ) {
    try {
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob }),
      ]);
      return "copied";
    } catch {
      /* fallthrough */
    }
  }

  // Fallback: download
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(a.href);
  return "downloaded";
}
