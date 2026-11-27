import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { http } from "@/api/baseClient";
import { schoolSubjectsApi } from "@/api/schoolAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";

const SEARCH_DELAY_MS = 250;

const studentsOf = (payload) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data?.students)) return data.students;
  if (Array.isArray(data?.results)) return data.results;
  return Array.isArray(data) ? data : [];
};

const nameOf = (student) =>
  student.full_name || student.name || [student.first_name, student.last_name].filter(Boolean).join(" ") || student.email || "Student";

const plural = (count) => `${count} ${count === 1 ? "student" : "students"}`;
const countLabel = (count) => `${plural(count)} enrolled`;
// A class subject's roster marks its class's own students "class"; everyone
// else (all students of a classless subject) is enrolled directly.
const fromClass = (student) => student.via === "class";

const errorText = (err) => apiErrorDetails(err).messages.map((m) => m.replace(/^student_ids: /, "")).join(" ");

/**
 * Enrol the school's students in a subject directly: everyone taking a
 * subject without a class, or extra students from other classes joining a
 * class subject (e.g. a JSS2 pupil in JSS1A Mathematics). A class subject's
 * own students come from its class and are managed there. Students are sent
 * by user id. ``onChanged(count)`` fires after each change with the total.
 */
export default function SubjectEnrolmentModal({ subject, onClose, onChanged }) {
  const [enrolled, setEnrolled] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const classed = Boolean(subject.classname);
  const className = subject.class_name || "its class";

  useEffect(() => {
    let live = true;
    schoolSubjectsApi
      .students(subject.id)
      .then((data) => live && setEnrolled(data?.students || []))
      .catch((err) => live && setError(errorText(err)))
      .finally(() => live && setLoadingRoster(false));
    return () => {
      live = false;
    };
  }, [subject.id]);

  useEffect(() => {
    let live = true;
    const timer = setTimeout(() => {
      setSearching(true);
      const term = search.trim();
      http
        .get("/api/admin/school/students/", {
          auth: true,
          params: { status: "active", page_size: 20, ...(term ? { search: term } : {}) },
        })
        .then((payload) => live && setResults(studentsOf(payload)))
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
      const data = await call();
      const students = data?.students || [];
      setEnrolled(students);
      onChanged?.(data?.count ?? students.length);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  const enrolledIds = new Set(enrolled.map((student) => String(student.id)));
  const classIds = new Set(enrolled.filter(fromClass).map((student) => String(student.id)));
  const extras = enrolled.filter((student) => !fromClass(student));
  const summary = classed
    ? `${plural(enrolled.length)}: ${classIds.size} from ${className}, ${extras.length} extra`
    : countLabel(enrolled.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subject-enrolment-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b p-5">
          <div>
            <h3 id="subject-enrolment-title" className="text-xl font-bold text-gray-800">Students taking {subject.name}</h3>
            <p className="text-sm text-gray-600" aria-live="polite">
              {loadingRoster ? "Loading students..." : summary}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid flex-1 gap-5 overflow-y-auto p-5 md:grid-cols-2">
          <section aria-labelledby="enrolled-heading">
            <h4 id="enrolled-heading" className="mb-2 font-semibold text-gray-800">
              {classed ? "Extra students" : "Enrolled"}
            </h4>
            {classed && !loadingRoster && (
              <p className="mb-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                From {className}: {plural(classIds.size)} (manage them in the class)
              </p>
            )}
            <ul aria-label={classed ? "Extra students" : "Enrolled students"} className="divide-y rounded-lg border">
              {extras.map((student) => (
                <li key={student.id} className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">{nameOf(student)}</p>
                    {student.email && <p className="truncate text-xs text-gray-500">{student.email}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => apply(student.id, () => schoolSubjectsApi.unenroll(subject.id, student.id))}
                    disabled={busyId === student.id}
                    aria-label={`Remove ${nameOf(student)}`}
                    className="rounded-lg border px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {!loadingRoster && extras.length === 0 && (
                <li className="p-3 text-sm text-gray-500">
                  {classed ? "No students from other classes yet." : "No students enrolled yet."}
                </li>
              )}
            </ul>
          </section>

          <section aria-labelledby="add-heading">
            <h4 id="add-heading" className="mb-2 font-semibold text-gray-800">
              {classed ? "Add students from other classes" : "Add students"}
            </h4>
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
                const inClass = classIds.has(String(student.id));
                const taken = inClass || enrolledIds.has(String(student.id));
                return (
                  <li key={student.id} className="flex items-center justify-between gap-2 p-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-800">{nameOf(student)}</p>
                      <p className="truncate text-xs text-gray-500">{student.class_name || "No class"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => apply(student.id, () => schoolSubjectsApi.enroll(subject.id, [student.id]))}
                      disabled={taken || busyId === student.id}
                      aria-label={`Add ${nameOf(student)}`}
                      className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {inClass ? "In class" : taken ? "Added" : "Add"}
                    </button>
                  </li>
                );
              })}
              {!searching && results.length === 0 && (
                <li className="p-3 text-sm text-gray-500">No students found.</li>
              )}
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
