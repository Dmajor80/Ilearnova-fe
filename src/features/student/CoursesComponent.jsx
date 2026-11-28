import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, User } from "lucide-react";
import { getStudentCourseCatalogue, getStudentCourseProgress } from "@/api/student";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { progressLabel } from "./courseLabel";

const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);

/**
 * The student's classes with lesson progress joined in by class id, then
 * the subjects they take outside their classes (classless ones like French,
 * or another class's subject they were added to), which are courses too.
 */
async function loadMyCourses() {
  const [catalogue, progress] = await Promise.all([
    getStudentCourseCatalogue({ enrolled: "true" }),
    getStudentCourseProgress(),
  ]);
  const rows = unwrap(progress) || [];
  const byId = new Map(rows.filter((p) => p.kind !== "subject").map((p) => [String(p.course_id), p]));
  const classes = (unwrap(catalogue) || []).map((course) => {
    const p = byId.get(String(course.id));
    return {
      ...course,
      total_lessons: p?.total_lessons ?? 0,
      completed_lessons: p?.completed_lessons ?? 0,
      completion_percentage: p?.completion_percentage ?? 0,
    };
  });
  const subjects = rows
    .filter((p) => p.kind === "subject")
    .map((p) => ({ ...p, id: `subject:${p.course_id}`, kind: "subject", name: progressLabel(p) }));
  return [...classes, ...subjects];
}

function CourseCard({ course }) {
  const navigate = useNavigate();
  const { total_lessons: total, completed_lessons: done } = course;
  const finished = total > 0 && done >= total;
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800">{course.name}</h3>
      {course.description && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{course.description}</p>}
      {course.kind === "subject" ? (
        <p className="mt-1 text-sm text-slate-600">A subject you take outside your class.</p>
      ) : (
        <dl className="mt-4 space-y-1 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Class teacher</dt>
            <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <dd>{course.teacher_name || "No class teacher yet"}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Subjects</dt>
            <BookOpen className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <dd>{course.subject_count} subject{course.subject_count === 1 ? "" : "s"}</dd>
          </div>
        </dl>
      )}
      <div className="mt-4">
        <p className="mb-1 text-sm text-slate-700">
          {total ? `${done} of ${total} lessons done` : "No lessons published yet"}
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${course.completion_percentage}%` }} />
        </div>
      </div>
      <button
        type="button"
        onClick={() =>
          navigate(course.kind === "subject" ? "/student-dashboard/materials" : `/student-dashboard/courses/${course.id}`)
        }
        className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
      >
        {course.kind === "subject" ? "Open documents" : finished ? "Review lessons" : done ? "Continue learning" : "Open lessons"}
        <span className="sr-only"> for {course.name}</span>
      </button>
    </article>
  );
}

/** The classes the student is enrolled in, from the backend. No sample data. */
export function CoursesComponent() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;
    loadMyCourses()
      .then((data) => active && setCourses(data))
      .catch((err) => active && setError(apiErrorDetails(err).messages.join(" ")));
    return () => {
      active = false;
    };
  }, []);

  const term = searchTerm.trim().toLowerCase();
  const filtered = (courses || []).filter(
    (c) => String(c.name || "").toLowerCase().includes(term) || c.teacher_name?.toLowerCase().includes(term)
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 sm:p-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My courses</h2>
          <p className="text-slate-600">Your classes and subjects, and the lessons your teachers have published.</p>
        </div>
        {courses?.length > 1 && (
          <div className="relative w-72 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search your courses"
              placeholder="Search by class or teacher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3"
            />
          </div>
        )}
      </header>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : courses === null ? (
        <CardGridSkeleton count={3} label="Loading your courses" />
      ) : filtered.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
          {term ? "No courses match your search." : "You aren't in any class yet. Your school adds you to your class."}
        </p>
      )}
    </div>
  );
}

export default CoursesComponent;
