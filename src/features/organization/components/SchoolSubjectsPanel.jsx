import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import { http } from "@/api/baseClient";
import { schoolSubjectsApi } from "@/api/schoolAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import SubjectEnrolmentModal from "./SubjectEnrolmentModal";
import SubjectFormModal from "./SubjectFormModal";

const listOf = (payload, key) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.results)) return data.results;
  return Array.isArray(data) ? data : [];
};

const studentsLabel = (count) => `${count ?? 0} ${count === 1 ? "student" : "students"}`;

/**
 * The school's subjects for the admin: class subjects in one table, subjects
 * without a class in their own list, each with a Students action to enrol
 * students individually.
 */
export default function SchoolSubjectsPanel() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null); // {} for a new subject
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [enrolling, setEnrolling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [subjectData, classPayload, teacherPayload] = await Promise.all([
        schoolSubjectsApi.list({ page_size: 100 }),
        http.get("/api/admin/school/classes/", { auth: true, params: { page_size: 100 } }),
        http.get("/api/admin/school/teachers/", { auth: true, params: { page_size: 100, status: "active" } }),
      ]);
      setSubjects(listOf(subjectData, "subjects"));
      setClasses(listOf(classPayload, "classes"));
      setTeachers(listOf(teacherPayload, "teachers"));
    } catch (err) {
      setLoadError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (values) => {
    setSaving(true);
    setSaveError("");
    try {
      if (editing?.id) await schoolSubjectsApi.update(editing.id, values);
      else await schoolSubjectsApi.create(values);
      setEditing(null);
      await load();
    } catch (err) {
      setSaveError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setSaving(false);
    }
  };

  const openForm = (subject) => {
    setSaveError("");
    setEditing(subject);
  };

  const setCount = (subjectId, count) =>
    setSubjects((current) => current.map((s) => (s.id === subjectId ? { ...s, student_count: count } : s)));

  const classed = subjects.filter((s) => s.classname);
  const classless = subjects.filter((s) => !s.classname);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 sm:text-2xl">Subjects</h3>
          <p className="text-sm text-gray-600">Subjects belong to a class, or have no class and only the students you enrol.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => openForm({})} className="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Add subject</button>
          <button type="button" onClick={load} aria-label="Refresh subjects" className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      {loadError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{loadError}</p>}
      {loading && <p className="text-sm text-gray-500">Loading subjects...</p>}

      {!loading && (
        <>
          <section aria-labelledby="class-subjects-heading" className="space-y-2">
            <h4 id="class-subjects-heading" className="font-semibold text-gray-800">Class subjects</h4>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th scope="col" className="p-3">Subject</th>
                    <th scope="col" className="p-3">Class</th>
                    <th scope="col" className="p-3">Teacher</th>
                    <th scope="col" className="p-3">Students</th>
                    <th scope="col" className="p-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {classed.map((s) => (
                    <tr key={s.id}>
                      <td className="p-3 font-medium text-gray-800">{s.name}</td>
                      <td className="p-3">{s.class_name || "No class"}</td>
                      <td className="p-3">{s.teacher_name || "—"}</td>
                      <td className="p-3">{s.student_count ?? "—"}</td>
                      <td className="p-3 text-right">
                        <button type="button" onClick={() => openForm(s)} aria-label={`Edit ${s.name}`} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Edit</button>
                      </td>
                    </tr>
                  ))}
                  {classed.length === 0 && (
                    <tr><td colSpan={5} className="p-3 text-gray-500">No class subjects yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="classless-subjects-heading" className="space-y-2">
            <h4 id="classless-subjects-heading" className="font-semibold text-gray-800">Subjects without a class</h4>
            <p className="text-sm text-gray-600">Only enrolled students take these subjects, their exams, attendance and results.</p>
            <ul className="divide-y rounded-lg border">
              {classless.map((s) => (
                <li key={s.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.teacher_name || "No teacher yet"}
                      {s.is_active === false ? " · Inactive" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{studentsLabel(s.student_count)}</span>
                    <button
                      type="button"
                      onClick={() => setEnrolling(s)}
                      aria-label={`Students in ${s.name}`}
                      className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-100"
                    >
                      <Users className="h-4 w-4" aria-hidden="true" /> Students
                    </button>
                    <button type="button" onClick={() => openForm(s)} aria-label={`Edit ${s.name}`} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Edit</button>
                  </div>
                </li>
              ))}
              {classless.length === 0 && (
                <li className="p-3 text-sm text-gray-500">No subjects without a class. Add one and choose "No class".</li>
              )}
            </ul>
          </section>
        </>
      )}

      {editing && (
        <SubjectFormModal
          subject={editing.id ? editing : null}
          classes={classes}
          teachers={teachers}
          saving={saving}
          error={saveError}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {enrolling && (
        <SubjectEnrolmentModal
          subject={enrolling}
          onClose={() => setEnrolling(null)}
          onChanged={(count) => setCount(enrolling.id, count)}
        />
      )}
    </div>
  );
}
