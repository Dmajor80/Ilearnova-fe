import { useEffect, useState } from "react";
import { resultsApi } from "@/api/resultsApi";
import { CardGridSkeleton } from "@/components/ui/Skeleton";

const marks = (value) => Number(value).toString();

/** One subject the teacher teaches, in one class. */
function CourseCard({ course }) {
  return (
    <article className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{course.name}</h3>
      <p className="text-sm text-gray-600">{course.organization_name}</p>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-gray-500">Class</dt>
          <dd className="font-medium">{course.class_name}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Marked out of</dt>
          <dd className="font-medium">{marks(course.total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-gray-500">
        {(course.components || []).map((c) => `${c.label} ${marks(c.max)}`).join(" · ")}
      </p>
    </article>
  );
}

/**
 * The subjects (and classes) the signed-in teacher teaches, from
 * GET /api/results/subjects/. Shown at the foot of several teacher pages.
 */
function CoursesComponent({ page }) {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;
    resultsApi
      .mySubjects()
      .then((data) => active && setCourses(data || []))
      .catch(() => active && setError("Your subjects could not be loaded. Refresh to try again."));
    return () => {
      active = false;
    };
  }, []);

  const term = searchTerm.trim().toLowerCase();
  const filteredCourses = (courses || []).filter(
    (course) =>
      course.name.toLowerCase().includes(term) || course.class_name?.toLowerCase().includes(term)
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mt-1 text-xs text-gray-500">Page/Teacher Portal</p>
          <h2 className="mt-2 font-medium">{page}</h2>
        </div>
        <div className="relative w-64 max-w-full">
          <input
            type="search"
            aria-label="Search your subjects"
            placeholder="Search subjects or classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 pl-10"
          />
          <svg
            className="absolute left-3 top-2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : courses === null ? (
        <CardGridSkeleton count={3} label="Loading your subjects" />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-gray-500">
                {term ? "No subjects match your search" : "You have not been assigned any subjects yet"}
              </p>
              {!term && <p className="mt-2 text-gray-400">Your school admin assigns subjects to teachers.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CoursesComponent;
