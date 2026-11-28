import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Plus, RefreshCw, Search } from "lucide-react";
import { http } from "@/api/baseClient";
import { schoolMaterialsApi, schoolSubjectsApi } from "@/api/schoolAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { DOCUMENT_ACCEPT, DOCUMENT_HINT, documentProblem, materialErrorMessage } from "@/lib/materialFiles";
import { teacherSubjectLabel } from "@/hooks/teacher/teacherSubjects";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ListSkeleton } from "@/components/ui/Skeleton";

const EMPTY_FORM = { target: "", title: "", description: "", is_published: true };
const PAGE_SIZE = 100;

const listOf = (payload, key) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.results)) return data.results;
  return Array.isArray(data) ? data : [];
};

const subjectLabel = (s) => teacherSubjectLabel({ name: s.name, class_name: s.class_name });

/** Where a material sits: "French (no class)", "Maths — JSS1A" or "JSS1A (whole class)". */
const placeOf = (m) =>
  m.subject
    ? teacherSubjectLabel({ name: m.subject_name, class_name: m.class_name })
    : `${m.class_name} (whole class)`;

const uploaderOf = (m) => {
  const u = m.uploaded_by;
  if (!u) return "";
  return [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "";
};

/**
 * Every course document of the school, for the school admin: filter by
 * subject or class, upload to any of them (documents only, the same rules
 * as teachers), and delete any, whoever uploaded it.
 */
export default function OrganizationMaterials() {
  const [materials, setMaterials] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);

  const [pagination, setPagination] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Subjects and classes for the pickers: once.
  useEffect(() => {
    Promise.all([
      schoolSubjectsApi.list({ page_size: 100, is_active: "true" }),
      http.get("/api/admin/school/classes/", { auth: true, params: { page_size: 100 } }),
    ])
      .then(([subjectData, classPayload]) => {
        setSubjects(listOf(subjectData, "subjects"));
        setClasses(listOf(classPayload, "classes"));
      })
      .catch((err) => setLoadError(apiErrorDetails(err).messages.join(" ")));
  }, []);

  // Materials: filtered by the server, 100 a page.
  const fetchPage = useCallback(
    async (page) => {
      const [kind, id] = filter.split(":");
      const params = { page, page_size: PAGE_SIZE };
      if (kind === "subject") params.subject_id = id;
      if (kind === "class") params.class_id = id;
      const data = await schoolMaterialsApi.list(params);
      return { rows: listOf(data, "materials"), pagination: (data?.data ?? data)?.pagination || null };
    },
    [filter]
  );

  const load = useCallback(async () => {
    setLoadError("");
    setMaterials(null);
    try {
      const { rows, pagination: info } = await fetchPage(1);
      setMaterials(rows);
      setPagination(info);
    } catch (err) {
      setMaterials([]);
      setLoadError(apiErrorDetails(err).messages.join(" "));
    }
  }, [fetchPage]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { rows, pagination: info } = await fetchPage((pagination?.page || 1) + 1);
      setMaterials((current) => [...(current || []), ...rows]);
      setPagination(info);
    } catch (err) {
      setLoadError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setLoadingMore(false);
    }
  };

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (materials || []).filter(
      (m) => !term || `${m.title} ${m.description || ""}`.toLowerCase().includes(term)
    );
  }, [materials, search]);

  const openForm = () => {
    setForm({ ...EMPTY_FORM, target: filter });
    setFile(null);
    setFormError("");
    setShowForm(true);
  };

  const save = async (event) => {
    event.preventDefault();
    const problem = file ? documentProblem(file) : "Choose a document to upload.";
    if (problem) {
      setFormError(problem);
      return;
    }
    const [kind, id] = form.target.split(":");
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("content_type", "file");
    data.append("is_published", String(form.is_published));
    data.append(kind === "subject" ? "subject" : "class_obj", id);
    data.append("file", file);
    setSaving(true);
    setFormError("");
    try {
      await schoolMaterialsApi.upload(data);
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(materialErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const classed = subjects.filter((s) => s.classname);
  const classless = subjects.filter((s) => !s.classname);
  const targetOptions = (
    <>
      {classless.length > 0 && (
        <optgroup label="Subjects without a class">
          {classless.map((s) => <option key={s.id} value={`subject:${s.id}`}>{subjectLabel(s)}</option>)}
        </optgroup>
      )}
      {classed.length > 0 && (
        <optgroup label="Class subjects">
          {classed.map((s) => <option key={s.id} value={`subject:${s.id}`}>{subjectLabel(s)}</option>)}
        </optgroup>
      )}
      {classes.length > 0 && (
        <optgroup label="Whole class">
          {classes.map((c) => <option key={c.id} value={`class:${c.id}`}>{`${c.name} (whole class)`}</option>)}
        </optgroup>
      )}
    </>
  );

  return (
    <div className="space-y-5 rounded-xl bg-white p-3 shadow-sm sm:p-4 md:p-6">
      <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 sm:text-2xl">Course materials</h3>
          <p className="text-sm text-gray-600">Documents shared with your school&apos;s subjects and classes. Students see those of the subjects they take.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={openForm} className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Upload document
          </button>
          <button type="button" onClick={load} aria-label="Refresh materials" className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="materials-filter" className="text-sm font-medium">Subject or class
          <select id="materials-filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="mt-1 w-full rounded-lg border bg-white p-2.5">
            <option value="">All subjects and classes</option>
            {targetOptions}
          </select>
        </label>
        <label htmlFor="materials-search" className="text-sm font-medium">Search
          <span className="relative mt-1 block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input id="materials-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title" className="w-full rounded-lg border py-2.5 pl-9 pr-3" />
          </span>
        </label>
      </div>

      {loadError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{loadError}</p>}
      {materials === null && <ListSkeleton rows={4} label="Loading materials" />}
      {materials !== null && shown.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <FileText className="mx-auto mb-2 h-9 w-9 text-gray-300" aria-hidden="true" />
          <p className="font-medium text-gray-700">{materials.length ? "No materials match." : "No course materials yet."}</p>
          <p className="text-sm text-gray-500">Documents you or your teachers upload will appear here.</p>
        </div>
      )}

      {shown.length > 0 && (
        <ul className="divide-y rounded-lg border">
          {shown.map((m) => (
            <li key={m.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">
                  {m.title}
                  {!m.is_published && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Draft</span>}
                </p>
                <p className="text-xs font-medium text-indigo-700">{placeOf(m)}</p>
                {m.description && <p className="text-sm text-gray-600">{m.description}</p>}
                {uploaderOf(m) && <p className="text-xs text-gray-500">Uploaded by {uploaderOf(m)}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                {m.file && (
                  <a href={m.file} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50">
                    Open<span className="sr-only"> {m.title} (opens in a new tab)</span>
                  </a>
                )}
                <button type="button" onClick={() => setRemoving(m)} aria-label={`Delete ${m.title}`} className="rounded-lg border px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pagination?.has_next && (
        <div className="text-center">
          <button type="button" onClick={loadMore} disabled={loadingMore} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
            {loadingMore ? "Loading..." : `Load more (${materials.length} of ${pagination.total})`}
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={save} aria-label="Upload document" className="max-h-full w-full max-w-lg space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Upload document</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
            </div>
            <label htmlFor="material-target" className="block text-sm font-medium">Add to
              <select id="material-target" required value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="mt-1 w-full rounded-lg border bg-white p-2.5">
                <option value="">Choose a subject or class</option>
                {targetOptions}
              </select>
            </label>
            <label htmlFor="material-title" className="block text-sm font-medium">Title
              <input id="material-title" required maxLength={255} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" />
            </label>
            <label htmlFor="material-description" className="block text-sm font-medium">Description (optional)
              <textarea id="material-description" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" />
            </label>
            <div>
              <label htmlFor="material-file" className="block text-sm font-medium">Document</label>
              <input
                id="material-file"
                type="file"
                accept={DOCUMENT_ACCEPT}
                aria-describedby="material-file-hint"
                onChange={(e) => { setFile(e.target.files?.[0] || null); setFormError(""); }}
                className="mt-1 w-full rounded-lg border p-2.5"
              />
              <p id="material-file-hint" className="mt-1 text-xs text-gray-500">{DOCUMENT_HINT}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Publish now (students see it straight away)
            </label>
            {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
            <button type="submit" disabled={saving} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
              {saving ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        title="Delete this document?"
        message={removing ? `"${removing.title}" will be removed for everyone in ${placeOf(removing)}. This can't be undone.` : ""}
        confirmLabel="Delete document"
        variant="danger"
        onConfirm={async () => {
          await schoolMaterialsApi.remove(removing.id);
          await load();
        }}
        onClose={() => setRemoving(null)}
      />
    </div>
  );
}
