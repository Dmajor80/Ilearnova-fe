import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { teacherPermissionsApi } from "@/api/schoolAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";

const errorText = (err) => apiErrorDetails(err).messages.map((m) => m.replace(/^permissions: /, "")).join(" ");

/**
 * Turn a teacher's extra permissions on or off (all off by default). They
 * apply only to the teacher's own classes and subjects: e.g. Mr Bello may add
 * a pupil to JSS1A, which he leads, but not to JSS2B. ``onSaved(codes)``
 * fires after a successful save.
 */
export default function TeacherPermissionsModal({ teacher, onClose, onSaved }) {
  const name = teacher.full_name || teacher.email || "this teacher";
  const [available, setAvailable] = useState([]);
  const [granted, setGranted] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    teacherPermissionsApi
      .get(teacher.id)
      .then((data) => {
        if (!live) return;
        setAvailable(data?.available || []);
        setGranted(new Set(data?.permissions || []));
      })
      .catch((err) => live && setError(errorText(err)))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [teacher.id]);

  const toggle = (code) =>
    setGranted((current) => {
      const next = new Set(current);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const codes = available.map((p) => p.code).filter((code) => granted.has(code));
      const data = await teacherPermissionsApi.set(teacher.id, codes);
      onSaved?.(data?.permissions ?? codes);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-permissions-title"
        onSubmit={save}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="teacher-permissions-title" className="text-lg font-semibold text-gray-900">Permissions for {name}</h3>
            <p className="mt-1 text-sm text-gray-600">
              These apply only to their own classes and subjects: classes they lead or teach a subject in, and subjects they teach.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <p className="mt-5 text-sm text-gray-500">Loading permissions...</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {available.map((permission) => (
              <li key={permission.code}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={granted.has(permission.code)}
                    onChange={() => toggle(permission.code)}
                    aria-describedby={`perm-${permission.code}`}
                    className="mt-1 h-4 w-4"
                  />
                  <span>
                    <span className="block font-medium text-gray-900">{permission.label}</span>
                    <span id={`perm-${permission.code}`} className="block text-sm text-gray-600">{permission.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading || saving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
