import React from "react";
import { Check, X, AlertCircle } from "lucide-react";

/**
 * Reusable notification bar component.
 * Props:
 *  - show: boolean
 *  - type: "success" | "error" | "info"
 *  - message: string
 *  - onClose: () => void
 *  - className: optional extra classes
 *  - position: css classes for positioning (default top-right)
 */
export default function NotificationBar({
  show,
  type = "success",
  message = "",
  onClose,
  className = "",
  position = "fixed top-6 right-6",
}) {
  if (!show) return null;

  const base =
    "z-50 max-w-md p-4 rounded-2xl shadow-2xl transform transition-all duration-500";
  const color =
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
      ? "bg-red-500 text-white"
      : "bg-blue-500 text-white";

  const Icon =
    type === "success" ? Check : type === "error" ? X : AlertCircle;

  return (
    <div className={`${position} ${base} ${color} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="w-6 h-6 mt-0.5" />
        </div>
        <div className="ml-3 flex-1">
          <span className="font-semibold text-sm leading-relaxed">
            {message}
          </span>
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
