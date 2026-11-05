import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Link as LinkIcon, Plus, RefreshCw, Search, Video } from "lucide-react";
import { useTeacherClasses } from "@/hooks/teacher";
import CoursesComponent from "./components/CourseComponents";

const CONTENT_TYPES = ["file", "video_url", "youtube", "text", "quiz"];

export default function Resources() {
  const classesApi = useTeacherClasses();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", content_type: "text", link: "", is_published: true });
  const fetchMaterials = classesApi.fetchMaterials;

  useEffect(() => {
    if (!selectedClassId && classesApi.classes.length) setSelectedClassId(classesApi.classes[0].id);
  }, [classesApi.classes, selectedClassId]);

  useEffect(() => {
    if (selectedClassId) fetchMaterials(selectedClassId).catch(() => {});
  }, [fetchMaterials, selectedClassId]);

  const selectedClass = classesApi.classes.find((item) => item.id === selectedClassId);
  const materials = classesApi.materials;
  const filteredMaterials = useMemo(() => materials.filter((item) => {
    const matchesSearch = `${item.title || ""} ${item.description || ""}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = contentType === "all" || item.content_type === contentType;
    return matchesSearch && matchesType;
  }), [contentType, materials, searchTerm]);

  const saveMaterial = async (event) => {
    event.preventDefault();
    if (!selectedClass) return;
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("content_type", form.content_type);
    formData.append("class_obj", selectedClass.id);
    formData.append("organization", selectedClass.organization);
    formData.append("is_published", String(form.is_published));
    if (form.link) formData.append("link", form.link);
    if (file) formData.append("file", file);

    try {
      await classesApi.addMaterial(selectedClass.id, formData);
      setForm({ title: "", description: "", content_type: "text", link: "", is_published: true });
      setFile(null);
      setShowForm(false);
    } catch {
      // The API hook reports request failures.
    }
  };

  const iconFor = (type) => {
    if (type === "video_url" || type === "youtube") return <Video size={20} />;
    if (type === "text") return <FileText size={20} />;
    if (type === "file") return <BookOpen size={20} />;
    return <LinkIcon size={20} />;
  };

  return (
    <div className="space-y-6">
      <CoursesComponent page="Resources" />
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course materials</h2>
            <p className="text-sm text-gray-600">Browse and add resources attached to your classes.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => classesApi.refreshData({}, true)} aria-label="Refresh classes" className="rounded-lg border px-3 text-gray-700"><RefreshCw size={17} /></button>
            <button onClick={() => setShowForm(true)} disabled={!selectedClass} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"><Plus size={17} /> Add material</button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="text-sm font-medium">Class
            <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="mt-1 w-full rounded-lg border p-3">
              {classesApi.classes.map((item) => <option key={item.id} value={item.id}>{item.name || item.class_name}</option>)}
            </select>
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

        {classesApi.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{classesApi.error.message}</p>}
        {classesApi.loading && <p className="py-8 text-center text-gray-500">Loading course materials...</p>}
        {!classesApi.loading && !classesApi.classes.length && <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No classes are available to browse course materials.</p>}
        {!classesApi.loading && selectedClass && !filteredMaterials.length && <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No materials found for this class.</p>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {!classesApi.loading && filteredMaterials.map((item) => (
            <article key={item.id} className="rounded-xl border p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="rounded-lg bg-blue-50 p-2 text-blue-700">{iconFor(item.content_type)}</span>
                <span className={`rounded-full px-2 py-1 text-xs ${item.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{item.is_published ? "Published" : "Draft"}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
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
            <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">Add course material</h3><button type="button" onClick={() => setShowForm(false)} className="text-gray-500">Close</button></div>
            <input required maxLength={255} placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-lg border p-3" />
            <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-lg border p-3" rows="3" />
            <select value={form.content_type} onChange={(event) => setForm({ ...form, content_type: event.target.value })} className="w-full rounded-lg border p-3">{CONTENT_TYPES.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}</select>
            <input type="url" placeholder="Link (optional)" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} className="w-full rounded-lg border p-3" />
            {form.content_type === "file" && <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-lg border p-3" />}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} /> Publish immediately</label>
            <button disabled={classesApi.mutating} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{classesApi.mutating ? "Saving..." : "Save material"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
