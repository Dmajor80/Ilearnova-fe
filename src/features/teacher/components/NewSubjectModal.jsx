import { useState } from "react";
import { X } from "lucide-react";
import { createTeacherSubject } from "@/api/teacher";
import { apiErrorDetails } from "@/lib/apiHelpers";

const errorText = (err) => apiErrorDetails(err).messages.map((m) => m.replace(/^(name|classname): /, "")).join(" ");

/**
 * A teacher with the ``create_subjects`` permission adds a subject to a class
 * they lead (``classes``: [{ id, name }]) or with no class; they teach it.
 * ``defaultClass`` preselects one of ``classes`` (e.g. opened from that
 * class's page). ``onCreated(subject)`` fires after it is saved.
 */
export default function NewSubjectModal({ classes, defaultClass = "", onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", description: "", classname: defaultClass });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = await createTeacherSubject({
        name: form.name.trim(),
        description: form.description,
        classname: form.classname || null,
      });
      onCreated?.(payload?.data ?? payload);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form role="dialog" aria-modal="true" aria-labelledby="new-subject-title" onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 id="new-subject-title" className="text-xl font-semibold">New subject</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500"><X size={20} /></button>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Subject name
          <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Class
          <select value={form.classname} onChange={(e) => setForm({ ...form, classname: e.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal">
            <option value="">No class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <p className="text-xs text-gray-500">
          Pick a class you lead, or "No class" for a subject only some students take; you enrol them yourself if allowed.
        </p>
        <label className="block text-sm font-medium text-gray-700">
          Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="mt-1 w-full rounded-lg border p-3 font-normal" />
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={saving || !form.name.trim()} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Create subject"}
        </button>
      </form>
    </div>
  );
}
