import { useEffect } from "react";
import { useToast } from "../../store/toastStore";

export default function Toast() {
  const { message, type, clear } = useToast();

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(clear, 1800);
    return () => clearTimeout(t);
  }, [message, clear]);

  if (!message) return null;

  const tone =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
      ? "bg-rose-600"
      : "bg-slate-800";

  const cls = `fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] ${tone} text-white px-4 py-2 rounded-xl shadow-lg`;

  return <div className={cls}>{message}</div>;
}
