import { useTeacherAssignments, useTeacherClasses, useTeacherExaminations, useTeacherStudents } from "@/hooks/teacher";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";

export default function TeacherDashboardOverview() {
  const classesApi = useTeacherClasses();
  const studentsApi = useTeacherStudents();
  const assignmentsApi = useTeacherAssignments();
  const examinationsApi = useTeacherExaminations();
  const loading = classesApi.loading || studentsApi.loading || assignmentsApi.loading || examinationsApi.loading;
  const submissions = assignmentsApi.assignments.reduce(
    (sum, assignment) => sum + Number(assignment.submission_count || 0),
    0
  );

  if (loading) return <div className="p-8 text-center text-gray-600">Loading teacher dashboard...</div>;

  return (
    <div className="space-y-6">
      {[classesApi, studentsApi, assignmentsApi, examinationsApi].some((api) => api.error) && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          Some teacher dashboard data could not be loaded. Refresh the relevant section to retry.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickStatsCard title="Total Students" value={studentsApi.students.length} icon="users" color="blue" />
        <QuickStatsCard title="Active Classes" value={classesApi.classes.length} icon="book" color="green" />
        <QuickStatsCard title="Assignments" value={assignmentsApi.assignments.length} icon="check" color="purple" />
        <QuickStatsCard title="Examinations" value={examinationsApi.examinations.length} icon="calendar" color="yellow" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your classes</h2>
            <span className="text-sm text-gray-500">{classesApi.classes.length} total</span>
          </div>
          {classesApi.classes.length ? <ul className="divide-y">
            {classesApi.classes.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <span className="font-medium">{item.name || item.class_name}</span>
                <span className="text-sm text-gray-500">{item.student_count ?? "—"} students</span>
              </li>
            ))}
          </ul> : <p className="text-sm text-gray-500">No assigned classes found.</p>}
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent assignments</h2>
            <span className="text-sm text-gray-500">{submissions} submissions</span>
          </div>
          {assignmentsApi.assignments.length ? <ul className="divide-y">
            {assignmentsApi.assignments.slice(0, 6).map((item) => (
              <li key={item.id} className="py-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.subject_name || "Subject"} · {item.submission_count || 0} submissions</p>
              </li>
            ))}
          </ul> : <p className="text-sm text-gray-500">No assignments found.</p>}
        </section>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Examinations</h2>
        {examinationsApi.examinations.length ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {examinationsApi.examinations.slice(0, 4).map((exam) => (
              <article key={exam.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{exam.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{exam.subject_name || "Subject"}</p>
                {exam.start_time && <p className="mt-2 text-xs text-gray-500">{new Date(exam.start_time).toLocaleString()}</p>}
              </article>
            ))}
          </div>
        ) : <p className="text-sm text-gray-500">No examinations found.</p>}
      </section>
    </div>
  );
}
