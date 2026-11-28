import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Link as LinkIcon, Plus, RefreshCw, Search, Video } from "lucide-react";
import { useTeacherClasses, useTeacherSubjects } from "@/hooks/teacher";
import { teacherSubjectLabel } from "@/hooks/teacher/teacherSubjects";
import { DOCUMENT_ACCEPT, DOCUMENT_HINT, documentProblem, materialErrorMessage } from "@/lib/materialFiles";
import CoursesComponent from "./components/CourseComponents";

const CONTENT_TYPES = ["file", "video_url", "youtube", "text", "quiz"];
const EMPTY_FORM = { title: "", description: "", content_type: "text", link: "", is_published: true };

/* Where a material goes: "subject:<id>" (one of the teacher's subjects,
   classless ones included) or "class:<id>" (the whole class). */
const parseTarget = (value) => {
  const [kind, id] = String(value || "").split(":");
  return { kind, id };
};

/** "French (no class)", "Mathematics — JSS1A", or the class for a class-wide material. */
const materialLabel = (item) =>
  item.subject_name
    ? teacherSubjectLabel({ name: item.subject_name, class_name: item.class_name })
    : item.class_name || "";

export default function Resources() {
  const classesApi = useTeacherClasses();
  const subjectsApi = useTeacherSubjects();
  const [target, setTarget] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const { fetchMaterials, fetchSubjectMaterials } = classesApi;
  const subjects = subjectsApi.subjects;
  const classes = classesApi.classes;

  useEffect(() => {
    if (target) return;
    if (subjects.length) setTarget(`subject:${subjects[0].id}`);
    else if (classes.length) setTarget(`class:${classes[0].id}`);
  }, [classes, subjects, target]);

  useEffect(() => {
    const { kind, id } = parseTarget(target);
    if (kind === "subject") fetchSubjectMaterials(id).catch(() => {});
    if (kind === "class") fetchMaterials(id).catch(() => {});
  }, [fetchMaterials, fetchSubjectMaterials, target]);

  const { kind: targetKind, id: targetId } = parseTarget(target);
  const selectedClass = targetKind === "class" ? classes.find((item) => item.id === targetId) : null;
  const selectedSubject = targetKind === "subject" ? subjects.find((item) => item.id === targetId) : null;
  const hasTarget = Boolean(selectedClass || selectedSubject);
  const materials = classesApi.materials;
  const filteredMaterials = useMemo(() => materials.filter((item) => {
    const matchesSearch = `${item.title || ""} ${item.description || ""}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = contentType === "all" || item.content_type === contentType;
    return matchesSearch && matchesType;
  }), [contentType, materials, searchTerm]);

  const closeForm = () => {
    setShowForm(false);
    setFormError("");
  };

  const saveMaterial = async (event) => {
    event.preventDefault();
    if (!hasTarget) return;
    const problem = form.content_type === "file" ? documentProblem(file) : "";
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError("");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("content_type", form.content_type);
    formData.append("is_published", String(form.is_published));
    if (form.link) formData.append("link", form.link);
    if (file && form.content_type === "file") formData.append("file", file);

    try {
      if (selectedSubject) {
        formData.append("subject", selectedSubject.id);
        await classesApi.addSubjectMaterial(selectedSubject.id, formData);
      } else {
        await classesApi.addMaterial(selectedClass.id, formData);
      }
      setForm(EMPTY_FORM);
      setFile(null);
      closeForm();
    } catch (err) {
      setFormError(materialErrorMessage(err));
    }
  };

  const iconFor = (type) => {
    if (type === "video_url" || type === "youtube") return <Video size={20} />;
    if (type === "text") return <FileText size={20} />;
    if (type === "file") return <BookOpen size={20} />;
    return <LinkIcon size={20} />;
  };

  const targetPicker = (id) => (
    <select id={id} value={target} onChange={(event) => setTarget(event.target.value)} className="mt-1 w-full rounded-lg border p-3">
      {subjects.length > 0 && (
        <optgroup label="My subjects">
          {subjects.map((item) => <option key={item.id} value={`subject:${item.id}`}>{teacherSubjectLabel(item)}</option>)}
        </optgroup>
      )}
      {classes.length > 0 && (
        <optgroup label="Whole class">
          {classes.map((item) => <option key={item.id} value={`class:${item.id}`}>{`${item.name || item.class_name} (whole class)`}</option>)}
        </optgroup>
      )}
    </select>
  );

  const loading = classesApi.loading || subjectsApi.loading;

  return (
    <div className="space-y-6">
      <CoursesComponent page="Resources" />
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course materials</h2>
            <p className="text-sm text-gray-600">Share documents with a subject you teach, including subjects without a class, or with a whole class.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { classesApi.refreshData({}, true); subjectsApi.refreshData?.(true); }} aria-label="Refresh classes" className="rounded-lg border px-3 text-gray-700"><RefreshCw size={17} /></button>
            <button onClick={() => setShowForm(true)} disabled={!hasTarget} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"><Plus size={17} /> Add material</button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <label htmlFor="materials-target" className="text-sm font-medium">Subject or class
            {targetPicker("materials-target")}
          </label>
          <label className="text-sm font-medium">Search
            <span className="relative mt-1 block"><Search className="absolute left-3 top-3.5 text-gray-400" size={17} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search course materials" className="w-full rounded-lg border py-3 pl-10 pr-3" /></span>
          </label>
          <label className="text-sm font-medium">Content type
            <select value={contentType} onChange={(event) => setContentType(event.target.value)} className="mt-1 w-full rounded-lg border p-3">
              <option value="all">All types</option>
              {CONTENT_TYPES.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
            </select>
          </label>
        </div>

        {classesApi.error && !showForm && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{classesApi.error.message}</p>}
        {loading && <p className="py-8 text-center text-gray-500">Loading course materials...</p>}
        {!loading && !hasTarget && <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No subjects or classes are available to browse course materials.</p>}
        {!loading && hasTarget && !filteredMaterials.length && <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No materials found here yet.</p>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {!loading && filteredMaterials.map((item) => (
            <article key={item.id} className="rounded-xl border p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="rounded-lg bg-blue-50 p-2 text-blue-700">{iconFor(item.content_type)}</span>
                <span className={`rounded-full px-2 py-1 text-xs ${item.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{item.is_published ? "Published" : "Draft"}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              {materialLabel(item) && <p className="text-xs font-medium text-indigo-700">{materialLabel(item)}</p>}
              {item.description && <p className="mt-1 line-clamp-3 text-sm text-gray-600">{item.description}</p>}
              <p className="mt-3 text-xs capitalize text-gray-500">{(item.content_type || "material").replace("_", " ")}</p>
              {(item.file || item.link) && <a href={item.file || item.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">Open material</a>}
            </article>
          ))}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveMaterial} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">Add course material</h3><button type="button" onClick={closeForm} className="text-gray-500">Close</button></div>
            <label htmlFor="material-target" className="block text-sm font-medium">Add to
              {targetPicker("material-target")}
            </label>
            <input required maxLength={255} placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-lg border p-3" />
            <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-lg border p-3" rows="3" />
            <label className="block text-sm font-medium">Material type
              <select value={form.content_type} onChange={(event) => setForm({ ...form, content_type: event.target.value })} className="mt-1 w-full rounded-lg border p-3">{CONTENT_TYPES.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}</select>
            </label>
            <input type="url" placeholder="Link (optional)" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} className="w-full rounded-lg border p-3" />
            {form.content_type === "file" && (
              <div>
                <label htmlFor="material-file" className="block text-sm font-medium">Document</label>
                <input
                  id="material-file"
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  aria-describedby="material-file-hint"
                  onChange={(event) => { setFile(event.target.files?.[0] || null); setFormError(""); }}
                  className="mt-1 w-full rounded-lg border p-3"
                />
                <p id="material-file-hint" className="mt-1 text-xs text-gray-500">{DOCUMENT_HINT}</p>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} /> Publish immediately</label>
            {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
            <button disabled={classesApi.mutating} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{classesApi.mutating ? "Saving..." : "Save material"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
