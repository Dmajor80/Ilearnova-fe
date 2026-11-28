import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { http } from "@/api/baseClient";
import { schoolSubjectsApi, schoolTimetableApi } from "@/api/schoolAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { teacherSubjectLabel } from "@/hooks/teacher/teacherSubjects";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EMPTY = { target: "", day_of_week: "0", start_time: "", end_time: "", room: "", meeting_link: "" };

const listOf = (payload, key) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.results)) return data.results;
  return Array.isArray(data) ? data : [];
};

const hhmm = (value) => String(value || "").slice(0, 5);
const subjectLabel = (s) => teacherSubjectLabel({ name: s.name, class_name: s.class_name });
const slotName = (entry) => entry.subject_name || "Whole class";

/* A slot is for "class:<id>" (the whole class), or "subject:<id>": a class
   subject (sent with its class) or a subject without a class (no class). */
const targetOf = (entry) => (entry.subject ? `subject:${entry.subject}` : `class:${entry.class_obj}`);

/**
 * The school's weekly timetable for the admin: slots for classes and for
 * subjects without a class (e.g. French, taken by pupils from several
 * classes). Those slots have no class and are checked for clashes with their
 * teacher's and students' other slots by the server.
 */
export default function SchoolTimetablePanel() {
  const [entries, setEntries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null); // {} for a new slot
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [removing, setRemoving] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [timetable, subjectData, classPayload] = await Promise.all([
        schoolTimetableApi.list({ page_size: 200 }),
        schoolSubjectsApi.list({ page_size: 100 }),
        http.get("/api/admin/school/classes/", { auth: true, params: { page_size: 100 } }),
      ]);
      setEntries(listOf(timetable, "entries"));
      setSubjects(listOf(subjectData, "subjects"));
      setClasses(listOf(classPayload, "classes"));
    } catch (err) {
      setLoadError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openForm = (entry) => {
    setSaveError("");
    setEditing(entry);
    setForm(
      entry.id
        ? {
            target: targetOf(entry),
            day_of_week: String(entry.day_of_week),
            start_time: hhmm(entry.start_time),
            end_time: hhmm(entry.end_time),
            room: entry.room || "",
            meeting_link: entry.meeting_link || "",
          }
        : EMPTY
    );
  };

  const payload = () => {
    const [kind, id] = form.target.split(":");
    const subject = kind === "subject" ? subjects.find((s) => s.id === id) : null;
    return {
      class_obj: kind === "class" ? id : subject?.classname || null,
      subject: subject ? subject.id : null,
      day_of_week: Number(form.day_of_week),
      start_time: form.start_time,
      end_time: form.end_time,
      room: form.room,
      meeting_link: form.meeting_link,
    };
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      if (editing?.id) await schoolTimetableApi.update(editing.id, payload());
      else await schoolTimetableApi.create(payload());
      setEditing(null);
      await load();
    } catch (err) {
      setSaveError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const classed = subjects.filter((s) => s.classname);
  const classless = subjects.filter((s) => !s.classname);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 sm:text-2xl">Timetable</h3>
          <p className="text-sm text-gray-600">Weekly lessons for classes, and for subjects without a class (only their enrolled students see those).</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => openForm({})} className="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Add slot</button>
          <button type="button" onClick={load} aria-label="Refresh timetable" className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      {loadError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{loadError}</p>}
      {loading && <p className="text-sm text-gray-500">Loading timetable...</p>}

      {editing && (
        <form onSubmit={save} aria-label={editing.id ? "Edit slot" : "New slot"} className="grid gap-3 rounded-lg border bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-medium sm:col-span-2 lg:col-span-3">Slot for
            <select required value={form.target} onChange={set("target")} className="mt-1 w-full rounded-lg border bg-white p-2">
              <option value="">Choose a class or subject</option>
              {classes.length > 0 && (
                <optgroup label="Whole class">
                  {classes.map((c) => <option key={c.id} value={`class:${c.id}`}>{`${c.name} (whole class)`}</option>)}
                </optgroup>
              )}
              {classed.length > 0 && (
                <optgroup label="Class subjects">
                  {classed.map((s) => <option key={s.id} value={`subject:${s.id}`}>{subjectLabel(s)}</option>)}
                </optgroup>
              )}
              {classless.length > 0 && (
                <optgroup label="Subjects without a class">
                  {classless.map((s) => <option key={s.id} value={`subject:${s.id}`}>{subjectLabel(s)}</option>)}
                </optgroup>
              )}
            </select>
          </label>
          <label className="text-sm font-medium">Day
            <select value={form.day_of_week} onChange={set("day_of_week")} className="mt-1 w-full rounded-lg border bg-white p-2">
              {DAYS.map((d, i) => <option key={d} value={String(i)}>{d}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Starts
            <input required type="time" value={form.start_time} onChange={set("start_time")} className="mt-1 w-full rounded-lg border bg-white p-2" />
          </label>
          <label className="text-sm font-medium">Ends
            <input required type="time" value={form.end_time} onChange={set("end_time")} className="mt-1 w-full rounded-lg border bg-white p-2" />
          </label>
          <label className="text-sm font-medium">Room
            <input value={form.room} onChange={set("room")} maxLength={100} className="mt-1 w-full rounded-lg border bg-white p-2" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">Online link (optional)
            <input type="url" value={form.meeting_link} onChange={set("meeting_link")} className="mt-1 w-full rounded-lg border bg-white p-2" />
          </label>
          {saveError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2 lg:col-span-3">{saveError}</p>}
          <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">{saving ? "Saving..." : "Save slot"}</button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border bg-white px-4 py-2 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {!loading && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th scope="col" className="p-3">Day</th>
                <th scope="col" className="p-3">Time</th>
                <th scope="col" className="p-3">Subject</th>
                <th scope="col" className="p-3">Class</th>
                <th scope="col" className="p-3">Room</th>
                <th scope="col" className="p-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((e) => {
                const day = e.day_name || DAYS[e.day_of_week];
                const name = `${slotName(e)} ${day} slot`;
                return (
                  <tr key={e.id}>
                    <td className="p-3">{day}</td>
                    <td className="p-3 tabular-nums">{hhmm(e.start_time)}–{hhmm(e.end_time)}</td>
                    <td className="p-3 font-medium text-gray-800">{slotName(e)}</td>
                    <td className="p-3">{e.class_name || "No class"}</td>
                    <td className="p-3">{e.room || "—"}</td>
                    <td className="space-x-2 whitespace-nowrap p-3 text-right">
                      <button type="button" onClick={() => openForm(e)} aria-label={`Edit ${name}`} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Edit</button>
                      <button type="button" onClick={() => setRemoving(e)} aria-label={`Remove ${name}`} className="rounded-lg border px-3 py-1 text-red-700 hover:bg-red-50">Remove</button>
                    </td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr><td colSpan={6} className="p-3 text-gray-500">No timetable slots yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        title="Remove this slot?"
        message={removing ? `${slotName(removing)} on ${removing.day_name || DAYS[removing.day_of_week]} will come off everyone's timetable.` : ""}
        confirmLabel="Remove slot"
        variant="danger"
        onConfirm={async () => {
          await schoolTimetableApi.remove(removing.id);
          await load();
        }}
        onClose={() => setRemoving(null)}
      />
    </div>
  );
}
