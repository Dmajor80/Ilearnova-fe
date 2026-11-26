import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { useParentAnnouncements } from "@/hooks/parent";
import { ListSkeleton } from "@/components/ui/Skeleton";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

/** Announcements from your child's school, newest first. */
export default function Announcement() {
  const { announcements, loading, error } = useParentAnnouncements();
  const [term, setTerm] = useState("");
  const q = term.trim().toLowerCase();
  const shown = announcements.filter((a) => `${a.title} ${a.message}`.toLowerCase().includes(q));

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-2 sm:p-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Announcements</h2>
          <p className="text-slate-600">News from your child's school.</p>
        </div>
        {announcements.length > 1 && (
          <div className="relative w-72 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search announcements"
              placeholder="Search announcements"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3"
            />
          </div>
        )}
      </header>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error.message}</p>
      ) : loading ? (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <ListSkeleton rows={4} label="Loading announcements" />
        </div>
      ) : shown.length ? (
        <ul className="space-y-4">
          {shown.map((a) => (
            <li key={a.id}>
              <article className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{a.title}</h3>
                <p className="text-sm text-slate-500">
                  {[formatDate(a.created_at), a.author_name, a.organization_name].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-3 whitespace-pre-line text-slate-700">{a.message}</p>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <Bell className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
          <p className="text-slate-500">{q ? "No announcements match your search." : "No announcements from the school yet."}</p>
        </div>
      )}
    </div>
  );
}
