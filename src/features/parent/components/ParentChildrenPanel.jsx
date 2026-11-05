import { useState } from "react";
import { useLinkParentStudent } from "@/hooks/parent";
import { getParentChildClass, getParentChildName } from "./parentDisplayUtils";

export default function ParentChildrenPanel({
  children,
  loading,
  error,
  refreshData,
  onSelectChild,
  selectedChildId
}) {
  const { linkStudent, mutating, error: linkError, notification } = useLinkParentStudent();
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const studentEmail = email.trim();
    if (!studentEmail) return;

    try {
      await linkStudent({ email: studentEmail });
      setEmail("");
      await refreshData();
    } catch {
      // The hook exposes the request error and notification for display.
    }
  };

  return (
    <section className="space-y-5">
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-slate-800">Link a student</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter your child&apos;s email address to request a link to their student account.
        </p>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="parent-student-email">Student email</label>
          <input
            id="parent-student-email"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@example.com"
          />
          <button
            className="rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white disabled:opacity-60"
            type="submit"
            disabled={mutating}
          >
            {mutating ? "Sending request…" : "Link student"}
          </button>
        </form>
        {linkError && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {notification.message || "The student link request could not be completed."}
          </p>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">My children</h2>
            <p className="text-sm text-slate-600">Students linked to your parent account.</p>
          </div>
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            type="button"
            onClick={refreshData}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading && <p className="py-6 text-center text-slate-600">Loading linked students…</p>}
        {!loading && error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
            Could not load linked students.
            <button className="ml-2 underline" type="button" onClick={refreshData}>Try again</button>
          </div>
        )}
        {!loading && !error && children.length === 0 && (
          <p className="rounded-lg bg-slate-50 p-5 text-center text-slate-600">
            No students are linked to your account yet.
          </p>
        )}
        {!loading && !error && children.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => onSelectChild?.(child)}
                className={`rounded-xl border p-4 text-left transition hover:border-blue-400 hover:bg-blue-50 ${
                  String(selectedChildId) === String(child.id)
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 font-semibold text-white">
                    {getParentChildName(child).charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <span className="block font-semibold text-slate-800">{getParentChildName(child)}</span>
                    <span className="block text-sm text-slate-600">{getParentChildClass(child)}</span>
                  </span>
                </span>
                {child.school_name || child.school?.name ? (
                  <span className="mt-3 block text-sm text-slate-600">
                    {child.school_name || child.school.name}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
