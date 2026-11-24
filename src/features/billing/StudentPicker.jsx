import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { http } from "@/api/baseClient";

/**
 * Find one of the school's students by name, email or admission number.
 * `onSelect` receives { id, full_name, email, student_id, class_name } (the
 * school's student list row; `id` is the user id the fees API accepts).
 */
export default function StudentPicker({ selected, onSelect }) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (selected || term.length < 2) {
      setMatches([]);
      return undefined;
    }
    let active = true;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const payload = await http.get("/api/admin/school/students/", {
          auth: true,
          params: { search: term, page_size: 8 },
        });
        const rows = payload?.data?.students ?? payload?.students ?? [];
        if (active) setMatches(rows.slice(0, 8));
      } catch {
        if (active) setMatches([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, selected]);

  if (selected) {
    return (
      <div className="mt-1 flex items-center justify-between rounded-lg border bg-blue-50 px-3 py-2 text-sm">
        <span>
          <span className="font-medium">{selected.full_name || selected.email}</span>
          <span className="text-gray-600">
            {[selected.student_id, selected.class_name].filter(Boolean).map((v) => ` · ${v}`).join("")}
          </span>
        </span>
        <button
          type="button"
          onClick={() => {
            onSelect(null);
            setQuery("");
          }}
          aria-label="Choose another student"
          className="rounded p-1 text-gray-500 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative mt-1">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Name, email or admission no."
        aria-label="Find student"
        className="w-full rounded-lg border py-2 pl-9 pr-3"
      />
      {query.trim().length >= 2 && (
        <ul role="listbox" className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
          {searching && !matches.length && <li className="px-3 py-2 text-sm text-gray-500">Searching…</li>}
          {!searching && !matches.length && <li className="px-3 py-2 text-sm text-gray-500">No students match.</li>}
          {matches.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => {
                  onSelect(s);
                  // Start empty next time (e.g. after the fee is billed and
                  // the form resets), instead of re-running the old search.
                  setQuery("");
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
              >
                <span className="font-medium">{s.full_name || s.email}</span>
                <span className="block text-xs text-gray-500">
                  {[s.student_id, s.class_name, s.email].filter(Boolean).join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
