import { useEffect, useMemo, useState } from "react";

/**
 * Row selection for a paged list. Clears itself when `resetKey` changes
 * (new filters), so a selection never silently covers rows you can't see
 * the filter for.
 */
export default function useSelection(resetKey) {
  const [ids, setIds] = useState(() => new Set());
  useEffect(() => setIds(new Set()), [resetKey]);

  return useMemo(
    () => ({
      ids,
      count: ids.size,
      has: (id) => ids.has(String(id)),
      toggle: (id) =>
        setIds((prev) => {
          const next = new Set(prev);
          const key = String(id);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return next;
        }),
      /** Select every id on the page, or clear them if all already are. */
      togglePage: (pageIds) =>
        setIds((prev) => {
          const keys = pageIds.map(String);
          const next = new Set(prev);
          const all = keys.length > 0 && keys.every((k) => next.has(k));
          keys.forEach((k) => (all ? next.delete(k) : next.add(k)));
          return next;
        }),
      set: (list) => setIds(new Set(list.map(String))),
      clear: () => setIds(new Set()),
    }),
    [ids]
  );
}
