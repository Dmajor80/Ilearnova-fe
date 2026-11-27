import { useState } from "react";
import { X } from "lucide-react";

/** Select value for "this subject has no class". Saved as classname: null. */
export const NO_CLASS = "__none__";

const teacherLabel = (teacher) =>
  teacher.full_name || teacher.name || teacher.email || "Teacher";

/**
 * Add or edit a school subject. A subject either belongs to a class (its
 * students are the class's students) or has no class, in which case the
 * school enrols students into it one by one (e.g. French for some JSS1-JSS3
 * pupils). Teachers are chosen by their school membership id.
 */
export default function SubjectFormModal({
  subject,
  classes = [],
  teachers = [],
  onSave,
  onClose,
  saving = false,
  error = "",
}) {
  const [form, setForm] = useState(() => ({
    name: subject?.name || "",
    classname: subject ? subject.classname || NO_CLASS : "",
    teacher_role: subject?.teacher_role || "",
    description: subject?.description || "",
  }));
  const [problem, setProblem] = useState("");
  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setProblem("Enter the subject's name.");
      return;
    }
    if (!form.classname) {
      setProblem("Choose a class, or No class.");
      return;
    }
    setProblem("");
    onSave({
      name: form.name.trim(),
      classname: form.classname === NO_CLASS ? null : form.classname,
      teacher_role: form.teacher_role || null,
      description: form.description,
    });
  };

  const message = problem || error;
  const title = subject ? "Edit subject" : "Add subject";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subject-form-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 id="subject-form-title" className="text-xl font-bold text-gray-800">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="subject-name" className="mb-1 block text-sm font-medium text-gray-700">Subject name</label>
            <input
              id="subject-name"
              value={form.name}
              onChange={set("name")}
              required
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>
          <div>
            <label htmlFor="subject-class" className="mb-1 block text-sm font-medium text-gray-700">Class</label>
            <select
              id="subject-class"
              value={form.classname}
              onChange={set("classname")}
              required
              aria-describedby={form.classname === NO_CLASS ? "subject-class-hint" : undefined}
              className="w-full rounded-lg border border-gray-300 p-3"
            >
              <option value="" disabled>Select a class</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name || item.class_name}</option>
              ))}
              <option value={NO_CLASS}>No class (students are enrolled individually)</option>
            </select>
            {form.classname === NO_CLASS && (
              <p id="subject-class-hint" className="mt-1 text-sm text-gray-600">
                Only the students you enrol will take this subject. After saving, use
                its Students button to enrol students individually.
              </p>
            )}
          </div>
          <div>
            <label htmlFor="subject-teacher" className="mb-1 block text-sm font-medium text-gray-700">Teacher</label>
            <select
              id="subject-teacher"
              value={form.teacher_role}
              onChange={set("teacher_role")}
              className="w-full rounded-lg border border-gray-300 p-3"
            >
              <option value="">No teacher yet</option>
              {teachers
                .filter((teacher) => teacher.membership_id)
                .map((teacher) => (
                  <option key={teacher.membership_id} value={teacher.membership_id}>{teacherLabel(teacher)}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="subject-description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="subject-description"
              value={form.description}
              onChange={set("description")}
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>
          {message && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>}
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving..." : "Save subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
