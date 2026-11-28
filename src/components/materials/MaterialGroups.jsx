import { useMemo, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { apiErrorDetails, saveBlob } from "@/lib/apiHelpers";
import { teacherSubjectLabel } from "@/hooks/teacher/teacherSubjects";
import { ListSkeleton } from "@/components/ui/Skeleton";

/** "French (no class)", "Mathematics — JSS1A", or "JSS1A (whole class)". */
const groupLabel = (m) =>
  m.subject_id
    ? teacherSubjectLabel({ name: m.subject_name, class_name: m.class_name })
    : `${m.class_name} (whole class)`;

const fileName = (m) => {
  const last = String(m.file || "").split("?")[0].split("/").pop();
  return last ? decodeURIComponent(last) : m.title;
};

/**
 * Materials one student can see, one section per subject (subjects without a
 * class included) and class-wide materials under their class. Used by the
 * student and, for their child, the parent.
 *
 * `materials` is null while loading. `download(m)` resolves to the file's
 * Blob; a Download button shows for rows with a `download_url`.
 */
export default function MaterialGroups({ materials, error = "", download, emptyText }) {
  const [downloadError, setDownloadError] = useState("");
  const [downloading, setDownloading] = useState(null);

  const groups = useMemo(() => {
    const byKey = new Map();
    for (const m of materials || []) {
      const key = m.subject_id ? `subject:${m.subject_id}` : `class:${m.class_id}`;
      if (!byKey.has(key)) byKey.set(key, { key, label: groupLabel(m), items: [] });
      byKey.get(key).items.push(m);
    }
    return [...byKey.values()];
  }, [materials]);

  const save = async (m) => {
    setDownloading(m.id);
    setDownloadError("");
    try {
      saveBlob(await download(m), fileName(m));
    } catch (err) {
      setDownloadError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {downloadError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{downloadError}</p>}
      {!error && materials === null && (
        <div className="rounded-xl bg-white p-5 shadow-sm"><ListSkeleton rows={4} label="Loading materials" /></div>
      )}
      {materials?.length === 0 && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
          <p className="font-medium text-slate-800">No course materials yet</p>
          <p className="mt-1 text-sm text-slate-500">{emptyText}</p>
        </div>
      )}

      {groups.map((group) => (
        <section key={group.key} aria-label={group.label} className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">{group.label}</h3>
          <ul className="divide-y">
            {group.items.map((m) => (
              <li key={m.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{m.title}</p>
                  {m.description && <p className="text-sm text-slate-600">{m.description}</p>}
                  {m.uploaded_by_name && <p className="text-xs text-slate-500">Shared by {m.uploaded_by_name}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  {m.download_url && (
                    <button
                      type="button"
                      onClick={() => save(m)}
                      disabled={downloading === m.id}
                      aria-label={`Download ${m.title}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" /> {downloading === m.id ? "Downloading..." : "Download"}
                    </button>
                  )}
                  {m.link && (
                    <a href={m.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">
                      Open link <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
