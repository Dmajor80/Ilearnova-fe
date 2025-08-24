import { useEffect, useState } from "react";

/**
 * Read-only hook that returns true if the user prefers a dark color scheme.
 */
export default function usePrefersDarkMode() {
  const getPref = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [prefersDark, setPrefersDark] = useState(getPref);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setPrefersDark(e.matches);
    // Modern browsers
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    // Fallback
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, []);

  return prefersDark;
}
