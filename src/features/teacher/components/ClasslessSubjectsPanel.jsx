import { useState } from "react";
import { BookOpen, Users } from "lucide-react";

/**
 * Read-only view of the teacher's subjects that have no class (e.g. French
 * taken by a few pupils from several classes) and who is enrolled in each.
 * Enrolment itself is managed by the school admin.
 */
export default function ClasslessSubjectsPanel({ subjects, fetchStudents }) {
  const [openId, setOpenId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const classless = subjects.filter((subject) => !subject.class_id);
  if (!classless.length) return null;

  const toggle = async (subject) => {
    if (openId === subject.id) {
      setOpenId("");
      return;
    }
    setOpenId(subject.id);
    setStudents([]);
    setFailed(false);
    setLoading(true);
    try {
      setStudents(await fetchStudents(subject.id));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="classless-subjects-heading" className="rounded-xl bg-white p-5 shadow-sm">
      <h2 id="classless-subjects-heading" className="text-xl font-bold text-gray-900">Subjects without a class</h2>
      <p className="mb-4 text-sm text-gray-600">
        Only the students enrolled in these subjects take them. Your school admin manages who is enrolled.
      </p>
      <div className="space-y-3">
        {classless.map((subject) => (
          <div key={subject.id} className="rounded-lg border">
            <button
              type="button"
              aria-expanded={openId === subject.id}
              onClick={() => toggle(subject)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-gray-50"
            >
              <span className="flex items-center gap-2 font-semibold text-gray-900">
                <BookOpen size={18} className="text-blue-600" /> {subject.name}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Users size={16} /> {subject.student_count ?? 0} enrolled
              </span>
            </button>
            {openId === subject.id && (
              <div className="border-t p-4">
                {loading ? <p className="text-sm text-gray-500">Loading students...</p>
                  : failed ? <p role="alert" className="text-sm text-red-700">Could not load the students. Try again.</p>
                    : students.length ? (
                      <ul className="divide-y">
                        {students.map((student) => (
                          <li key={student.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
                            <span className="font-medium text-gray-900">{student.name || student.username}</span>
                            <span className="text-gray-500">{student.username}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-gray-500">No students are enrolled yet.</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
