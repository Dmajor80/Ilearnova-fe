import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { searchTeacherSchoolStudents } from "@/api/teacher";
import { apiErrorDetails } from "@/lib/apiHelpers";

const SEARCH_DELAY_MS = 250;

const errorText = (err) => apiErrorDetails(err).messages.map((m) => m.replace(/^student_ids: /, "")).join(" ");
const nameOf = (student) => student.name || student.full_name || student.email || "Student";
const listOf = (payload) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.students) ? data.students : [];
};

/**
 * A teacher adds the school's students to, or removes them from, one of their
 * own classes or classless subjects (with the matching permission from their
 * school admin). ``load()``, ``add(ids)`` and ``remove(ids)`` return the API
 * payload with the new roster; ``onChanged(count)`` fires after each change.
 */
export default function TeacherStudentsModal({ title, load, add, remove, onClose, onChanged }) {
  const [current, setCurrent] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  // Loaded once per dialog; callers need not memoise ``load``.
  const loadRef = useRef(load);

  useEffect(() => {
    let live = true;
    loadRef.current()
      .then((payload) => live && setCurrent(listOf(payload)))
      .catch((err) => live && setError(errorText(err)))
      .finally(() => live && setLoadingRoster(false));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    const timer = setTimeout(() => {
      setSearching(true);
      searchTeacherSchoolStudents(search.trim())
        .then((payload) => live && setResults(listOf(payload)))
        .catch((err) => live && setError(errorText(err)))
        .finally(() => live && setSearching(false));
    }, search ? SEARCH_DELAY_MS : 0);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [search]);

  const apply = async (studentId, call) => {
    setBusyId(studentId);
    setError("");
    try {
      const students = listOf(await call([studentId]));
      setCurrent(students);
      onChanged?.(students.length);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  const currentIds = new Set(current.map((student) => String(student.id)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-students-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b p-5">
          <div>
            <h3 id="teacher-students-title" className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600" aria-live="polite">
              {loadingRoster ? "Loading students..." : `${current.length} ${current.length === 1 ? "student" : "students"}`}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid flex-1 gap-5 overflow-y-auto p-5 md:grid-cols-2">
          <section aria-labelledby="teacher-current-heading">
            <h4 id="teacher-current-heading" className="mb-2 font-semibold text-gray-800">Current students</h4>
            <ul aria-label="Current students" className="divide-y rounded-lg border">
              {current.map((student) => (
                <li key={student.id} className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">{nameOf(student)}</p>
                    {student.email && <p className="truncate text-xs text-gray-500">{student.email}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => apply(student.id, remove)}
                    disabled={busyId === student.id}
                    aria-label={`Remove ${nameOf(student)}`}
                    className="rounded-lg border px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {!loadingRoster && current.length === 0 && <li className="p-3 text-sm text-gray-500">No students yet.</li>}
            </ul>
          </section>

          <section aria-labelledby="teacher-add-heading">
            <h4 id="teacher-add-heading" className="mb-2 font-semibold text-gray-800">Add students</h4>
            <label className="mb-2 flex items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-indigo-500">
              <Search className="h-4 w-4 text-gray-500" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or email"
                aria-label="Search students"
                className="min-h-[40px] w-full bg-transparent text-sm outline-none"
              />
            </label>
            <ul aria-label="School students" aria-busy={searching} className="divide-y rounded-lg border">
              {results.map((student) => {
                const taken = currentIds.has(String(student.id));
                return (
                  <li key={student.id} className="flex items-center justify-between gap-2 p-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-800">{nameOf(student)}</p>
                      <p className="truncate text-xs text-gray-500">{student.classes?.length ? student.classes.join(", ") : "No class"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => apply(student.id, add)}
                      disabled={taken || busyId === student.id}
                      aria-label={`Add ${nameOf(student)}`}
                      className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {taken ? "Added" : "Add"}
                    </button>
                  </li>
                );
              })}
              {!searching && results.length === 0 && <li className="p-3 text-sm text-gray-500">No students found.</li>}
            </ul>
          </section>
        </div>

        {error && <p role="alert" className="mx-5 mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex justify-end border-t p-4">
          <button type="button" onClick={onClose} className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300">Done</button>
        </div>
      </div>
    </div>
  );
}
