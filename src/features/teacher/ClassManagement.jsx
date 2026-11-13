import { useState } from "react";
import { BookOpen, FilePlus2, Megaphone, Plus, RefreshCw, Users } from "lucide-react";
import { useTeacherAnnouncements, useTeacherClasses } from "@/hooks/teacher";
import { useOrganization } from "@/context/OrganizationContext";
import CoursesComponent from "./components/CourseComponents";

export default function ClassManagement() {
  const classesApi = useTeacherClasses();
  const announcementApi = useTeacherAnnouncements();
  const { currentOrgId } = useOrganization();
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [announcement, setAnnouncement] = useState({ title: "", message: "" });
  const [material, setMaterial] = useState({ title: "", description: "", content_type: "text", link: "" });
  const [subjectName, setSubjectName] = useState("");
  const [topic, setTopic] = useState({ name: "", description: "" });
  const [classForm, setClassForm] = useState({ name: "", description: "" });

  const selectClass = async (classItem) => {
    setSelectedClass(classItem);
    setSelectedSubjectId("");
    try {
      await Promise.all([
        classesApi.fetchClass(classItem.id),
        classesApi.fetchMaterials(classItem.id),
        classesApi.fetchSubjects(classItem.id)
      ]);
    } catch {
      // The API hook reports request failures.
    }
  };

  const saveAnnouncement = async (event) => {
    event.preventDefault();
    try {
      await announcementApi.publishAnnouncement(announcement);
      setAnnouncement({ title: "", message: "" });
      setActiveModal(null);
    } catch {
      // The API hook reports request failures.
    }
  };

  const saveMaterial = async (event) => {
    event.preventDefault();
    if (!selectedClass) return;
    try {
      await classesApi.addMaterial(selectedClass.id, {
        ...material,
        class_obj: selectedClass.id,
        organization: selectedClass.organization
      });
      setMaterial({ title: "", description: "", content_type: "text", link: "" });
      setActiveModal(null);
    } catch {
      // The API hook reports request failures.
    }
  };

  const saveSubject = async (event) => {
    event.preventDefault();
    if (!selectedClass) return;
    try {
      const created = await classesApi.addSubject(selectedClass.id, { name: subjectName });
      setSubjectName("");
      if (created?.id) setSelectedSubjectId(created.id);
      setActiveModal(null);
    } catch {
      // The API hook reports request failures.
    }
  };

  const saveTopic = async (event) => {
    event.preventDefault();
    if (!selectedSubjectId) return;
    try {
      await classesApi.addTopic(selectedSubjectId, topic);
      setTopic({ name: "", description: "" });
      setActiveModal(null);
    } catch {
      // The API hook reports request failures.
    }
  };

  const saveClass = async (event) => {
    event.preventDefault();
    if (!currentOrgId) return;
    try {
      await classesApi.addClass({
        ...classForm,
        organization: currentOrgId,
        is_active: true
      });
      setClassForm({ name: "", description: "" });
      setActiveModal(null);
    } catch {
      // The API hook reports request failures.
    }
  };

  const modalForm = activeModal === "announcement"
    ? { title: "Publish announcement", submit: saveAnnouncement, busy: announcementApi.mutating }
    : activeModal === "material"
      ? { title: "Add class material", submit: saveMaterial, busy: classesApi.mutating }
      : activeModal === "subject"
        ? { title: "Add subject", submit: saveSubject, busy: classesApi.mutating }
        : activeModal === "class"
          ? { title: "Create class", submit: saveClass, busy: classesApi.mutating }
          : { title: "Add topic", submit: saveTopic, busy: classesApi.mutating };

  return (
    <div className="space-y-6">
      <CoursesComponent page="Class Management" />
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your classes</h2>
            <p className="text-sm text-gray-600">Manage class subjects, topics, course materials, and announcements.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveModal("class")} disabled={!currentOrgId} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              <Plus size={17} /> Create class
            </button>
            {!currentOrgId && <span className="self-center text-xs text-gray-500">Choose an organization to create a class.</span>}
            <button onClick={() => setActiveModal("announcement")} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
              <Megaphone size={17} /> Announcement
            </button>
            <button onClick={() => classesApi.refreshData({}, true)} aria-label="Refresh classes" className="rounded-lg border px-3 text-gray-700 hover:bg-gray-50">
              <RefreshCw size={17} />
            </button>
          </div>
        </div>
        {classesApi.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{classesApi.error.message}</p>}
        {classesApi.loading && <p className="py-5 text-center text-gray-500">Loading classes...</p>}
        {!classesApi.loading && !classesApi.classes.length && <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">No classes are currently assigned to you.</p>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {classesApi.classes.map((classItem) => (
            <button key={classItem.id} onClick={() => selectClass(classItem)} className={`rounded-xl border p-4 text-left transition hover:border-blue-400 hover:shadow-sm ${selectedClass?.id === classItem.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{classItem.name || classItem.class_name || "Class"}</h3>
                  {classItem.description && <p className="mt-1 text-sm text-gray-600">{classItem.description}</p>}
                </div>
                <BookOpen className="shrink-0 text-blue-600" size={20} />
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-gray-600"><Users size={16} /> {classItem.student_count ?? "—"} students</p>
              {classItem.teacher_name && <p className="mt-1 text-xs text-gray-500">Teacher: {classItem.teacher_name}</p>}
            </button>
          ))}
        </div>
      </section>

      {selectedClass && (
        <section className="space-y-5 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedClass.name || selectedClass.class_name}</h2>
              <p className="text-sm text-gray-600">{selectedClass.description || "Class details and learning content"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveModal("subject")} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"><Plus size={15} className="mr-1 inline" /> Subject</button>
              <button onClick={() => setActiveModal("topic")} disabled={!selectedSubjectId} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"><Plus size={15} className="mr-1 inline" /> Topic</button>
              <button onClick={() => setActiveModal("material")} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"><FilePlus2 size={15} className="mr-1 inline" /> Course material</button>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Subjects</h3>
            {classesApi.subjects.length ? (
              <div className="flex flex-wrap gap-2">
                {classesApi.subjects.map((subject) => (
                  <button key={subject.id} onClick={async () => {
                    setSelectedSubjectId(subject.id);
                    try { await classesApi.fetchTopics(subject.id); } catch { /* Hook reports failures. */ }
                  }} className={`rounded-full border px-3 py-1.5 text-sm ${selectedSubjectId === subject.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200"}`}>
                    {subject.name}
                  </button>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No subjects found for this class.</p>}
          </div>

          {selectedSubjectId && (
            <div>
              <h3 className="mb-3 font-semibold">Topics</h3>
              {classesApi.topics.length ? <div className="flex flex-wrap gap-2">{classesApi.topics.map((item) => <span key={item.id} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm">{item.name}</span>)}</div> : <p className="text-sm text-gray-500">No topics found for this subject.</p>}
            </div>
          )}

          <div>
            <h3 className="mb-3 font-semibold">Course materials</h3>
            {classesApi.materials.length ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {classesApi.materials.map((item) => (
                  <article key={item.id} className="rounded-lg border p-4">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                    <p className="mt-2 text-xs text-gray-500">{item.content_type || "Material"}{item.is_published === false ? " · Draft" : ""}</p>
                    {(item.link || item.file) && <a className="mt-2 inline-block text-sm text-blue-600 hover:underline" href={item.link || item.file} target="_blank" rel="noreferrer">Open material</a>}
                  </article>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No course materials are available for this class.</p>}
          </div>
        </section>
      )}

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={modalForm.submit} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{modalForm.title}</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-gray-500">Close</button>
            </div>
            {activeModal === "announcement" && <>
              <input required maxLength={255} placeholder="Title" value={announcement.title} onChange={(event) => setAnnouncement({ ...announcement, title: event.target.value })} className="w-full rounded-lg border p-3" />
              <textarea required placeholder="Message" value={announcement.message} onChange={(event) => setAnnouncement({ ...announcement, message: event.target.value })} className="w-full rounded-lg border p-3" rows="4" />
            </>}
            {activeModal === "material" && <>
              <input required maxLength={255} placeholder="Title" value={material.title} onChange={(event) => setMaterial({ ...material, title: event.target.value })} className="w-full rounded-lg border p-3" />
              <textarea placeholder="Description" value={material.description} onChange={(event) => setMaterial({ ...material, description: event.target.value })} className="w-full rounded-lg border p-3" rows="3" />
              <select value={material.content_type} onChange={(event) => setMaterial({ ...material, content_type: event.target.value })} className="w-full rounded-lg border p-3">
                {["text", "file", "video_url", "youtube", "quiz"].map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
              </select>
              <input type="url" placeholder="Link (optional)" value={material.link} onChange={(event) => setMaterial({ ...material, link: event.target.value })} className="w-full rounded-lg border p-3" />
            </>}
            {activeModal === "subject" && <input required maxLength={100} placeholder="Subject name" value={subjectName} onChange={(event) => setSubjectName(event.target.value)} className="w-full rounded-lg border p-3" />}
            {activeModal === "topic" && <>
              <input required maxLength={100} placeholder="Topic name" value={topic.name} onChange={(event) => setTopic({ ...topic, name: event.target.value })} className="w-full rounded-lg border p-3" />
              <textarea placeholder="Description" value={topic.description} onChange={(event) => setTopic({ ...topic, description: event.target.value })} className="w-full rounded-lg border p-3" rows="3" />
            </>}
            {activeModal === "class" && <>
              <input required maxLength={100} placeholder="Class name" value={classForm.name} onChange={(event) => setClassForm({ ...classForm, name: event.target.value })} className="w-full rounded-lg border p-3" />
              <textarea placeholder="Description" value={classForm.description} onChange={(event) => setClassForm({ ...classForm, description: event.target.value })} className="w-full rounded-lg border p-3" rows="3" />
              {!currentOrgId && <p role="alert" className="text-sm text-red-700">Select an organization before creating a class.</p>}
            </>}
            <button disabled={modalForm.busy} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
              {modalForm.busy ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
