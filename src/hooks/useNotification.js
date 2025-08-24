import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Simple notification state hook with optional auto-hide.
 * Usage:
 *  const { show, message, type, notify, hide } = useNotification("success", 5000);
 *  notify("Logged in!", "success");
 */
export default function useNotification(defaultType = "success", autoHideMs = null) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(defaultType);
  const timerRef = useRef(null);

  const hide = useCallback(() => {
    setShow(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const notify = useCallback(
    (msg, nextType = defaultType, duration = autoHideMs) => {
      setMessage(msg);
      setType(nextType);
      setShow(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      if (duration && typeof duration === "number") {
        timerRef.current = setTimeout(() => {
          setShow(false);
          timerRef.current = null;
        }, duration);
      }
    },
    [autoHideMs, defaultType]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { show, message, type, notify, hide, setShow, setMessage, setType };
}
