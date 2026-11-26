/** Fire-and-forget toasts; <Toaster /> (components/ui/Toast.jsx) shows them. */
export const TOAST_EVENT = "ilearnova:toast";

export function toast(message, type = "success") {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
}
