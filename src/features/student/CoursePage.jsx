import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChevronLeft, Circle, ExternalLink } from "lucide-react";
import { completeStudentMaterial, getStudentClassMaterials } from "@/api/student";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { ListSkeleton, Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";

const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);

const OPEN_LABEL = { youtube: "Watch", video_url: "Watch", file: "Open file", quiz: "Open quiz" };

function Lesson({ lesson, number, onDone, saving }) {
  const href = lesson.link || lesson.file;
  return (
    <li className="flex gap-4 py-4">
      <span className="mt-0.5 flex-shrink-0" aria-hidden="true">
        {lesson.is_completed ? (
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        ) : (
          <Circle className="h-6 w-6 text-slate-300" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-900">
          {number}. {lesson.title}
        </h3>
        <p className="text-sm text-slate-500">
          {[lesson.topic_name, lesson.estimated_duration_minutes && `${lesson.estimated_duration_minutes} min`, lesson.uploaded_by_name]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {lesson.description && <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{lesson.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
            >
              {OPEN_LABEL[lesson.content_type] || "Open"} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only"> {lesson.title} (opens in a new tab)</span>
            </a>
          )}
          {lesson.is_completed ? (
            <span className="text-sm font-medium text-green-700">Done</span>
          ) : (
            <button
              type="button"
              onClick={() => onDone(lesson.id)}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Mark as done"}
              <span className="sr-only"> {lesson.title}</span>
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

/** One class's published lessons, in order, with the student's progress. */
export default function CoursePage() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    getStudentClassMaterials(courseId)
      .then((payload) => active && setData(unwrap(payload)))
      .catch((err) => active && setError(apiErrorDetails(err).messages.join(" ")));
    return () => {
      active = false;
    };
  }, [courseId]);

  const markDone = async (id) => {
    setSaving(id);
    setSaveError("");
    try {
      await completeStudentMaterial(id);
      setData((d) => ({
        ...d,
        materials: d.materials.map((m) => (m.id === id ? { ...m, is_completed: true } : m)),
      }));
    } catch (err) {
      setSaveError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setSaving(null);
    }
  };

  const lessons = data?.materials || [];
  const done = lessons.filter((m) => m.is_completed).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-2 sm:p-4">
      <Link to="/student-dashboard/courses" className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> My courses
      </Link>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : !data ? (
        <div className="space-y-6">
          <SkeletonRegion label="Loading course" className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </SkeletonRegion>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <ListSkeleton rows={4} label="Loading lessons" />
          </div>
        </div>
      ) : (
        <>
          <header>
            <h2 className="text-2xl font-bold text-slate-900">{data.class.name}</h2>
            <p className="text-slate-600">
              {data.class.teacher_name ? `Class teacher: ${data.class.teacher_name}` : "No class teacher yet"}
            </p>
            {lessons.length > 0 && (
              <div className="mt-4 max-w-md">
                <p className="mb-1 text-sm text-slate-700">
                  {done} of {lessons.length} lessons done
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${(done / lessons.length) * 100}%` }} />
                </div>
              </div>
            )}
          </header>

          {saveError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{saveError}</p>}

          <section className="rounded-xl bg-white px-5 shadow-sm" aria-label="Lessons">
            {lessons.length ? (
              <ol className="divide-y">
                {lessons.map((lesson, i) => (
                  <Lesson key={lesson.id} lesson={lesson} number={i + 1} onDone={markDone} saving={saving === lesson.id} />
                ))}
              </ol>
            ) : (
              <p className="py-8 text-center text-slate-500">Your teachers haven't published any lessons for this class yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
