import { useEffect, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { TOAST_EVENT } from "@/lib/toast";

const STYLES = {
  success: ["border-green-200 bg-white", CheckCircle2, "text-green-600"],
  error: ["border-red-200 bg-white", XCircle, "text-red-600"],
  info: ["border-blue-200 bg-white", Info, "text-blue-600"],
};

let nextId = 1;

/** Shows toasts fired with lib/toast's `toast()`. Mount once per layout. */
export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = new Set();
    const onToast = (event) => {
      const id = nextId++;
      setToasts((list) => [...list.slice(-3), { id, ...event.detail }]);
      const timer = setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== id));
        timers.delete(timer);
      }, event.detail.type === "error" ? 7000 : 4500);
      timers.add(timer);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const [box, Icon, tone] = STYLES[t.type] || STYLES.info;
        return (
          <div key={t.id} role={t.type === "error" ? "alert" : "status"} className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg ${box}`}>
            <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${tone}`} aria-hidden="true" />
            <p className="flex-1 text-sm text-gray-800">{t.message}</p>
            <button type="button" aria-label="Dismiss" onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))} className="rounded p-0.5 text-gray-400 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
