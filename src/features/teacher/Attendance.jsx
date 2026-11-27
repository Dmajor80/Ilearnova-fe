import { createElement, useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar, CheckCircle, Clock, Filter, Users, XCircle } from "lucide-react";
import { useTeacherAttendance, useTeacherSubjects } from "@/hooks/teacher";
import { teacherSubjectLabel } from "@/hooks/teacher/teacherSubjects";
import { getTeacherList } from "@/hooks/teacher/teacherApiUtils";
import CoursesComponent from "./components/CourseComponents";

const today = () => new Date().toISOString().slice(0, 10);
const studentName = (student) =>
  student.name || student.full_name ||
  `${student.first_name || ""} ${student.last_name || ""}`.trim() || student.username || "Student";

export default function Attendance() {
  const subjectsApi = useTeacherSubjects();
  const attendanceApi = useTeacherAttendance();
  const { subjects, fetchStudents } = subjectsApi;
  const fetchAttendanceReport = attendanceApi.fetchAttendanceReport;
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedDate, setSelectedDate] = useState(today());
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState({});
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (!subjects.some((subject) => subject.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0]?.id || "");
    }
  }, [subjects, selectedSubjectId]);

  // The roster is the subject's own: its class's students, or, for a subject
  // without a class, only the students enrolled in it.
  useEffect(() => {
    if (!selectedSubjectId) {
      setStudents([]);
      return undefined;
    }
    let cancelled = false;
    setStudentsLoading(true);
    fetchStudents(selectedSubjectId)
      .then((list) => { if (!cancelled) setStudents(list); })
      .catch(() => { if (!cancelled) setStudents([]); })
      .finally(() => { if (!cancelled) setStudentsLoading(false); });
    return () => { cancelled = true; };
  }, [fetchStudents, selectedSubjectId]);

  useEffect(() => {
    if (!selectedSubjectId) return;
    fetchAttendanceReport(selectedSubjectId, {
      from: selectedDate,
      to: selectedDate
    }).catch(() => {});
  }, [fetchAttendanceReport, selectedDate, selectedSubjectId]);

  useEffect(() => {
    setStatuses({});
  }, [selectedDate, selectedSubjectId]);

  const reportRecords = useMemo(
    () => getTeacherList(attendanceApi.attendanceReport, ["records", "attendance", "attendance_records"]),
    [attendanceApi.attendanceReport]
  );

  const rows = useMemo(() => students.map((student) => {
    const record = reportRecords.find((entry) =>
      (entry.student_id || entry.student_role || entry.student?.id) === student.id
    );
    return {
      ...student,
      status: statuses[student.id] || record?.status || ""
    };
  }).filter((student) =>
    studentName(student).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  ), [students, reportRecords, searchTerm, statuses]);

  const stats = useMemo(() => ({
    total: rows.length,
    present: rows.filter((student) => student.status === "present").length,
    absent: rows.filter((student) => student.status === "absent").length,
    late: rows.filter((student) => student.status === "late").length,
    excused: rows.filter((student) => student.status === "excused").length
  }), [rows]);

  const submitAttendance = async () => {
    if (!selectedSubjectId) return;
    const records = rows.filter((student) => statuses[student.id] || student.status).map((student) => ({
      student_id: student.id,
      status: statuses[student.id] || student.status
    }));
    if (!records.length) return;
    try {
      await attendanceApi.signAttendance(selectedSubjectId, { date: selectedDate, records });
      await attendanceApi.fetchAttendanceReport(selectedSubjectId, {
        from: selectedDate,
        to: selectedDate
      });
      setStatuses({});
    } catch {
      // The API hook reports request failures.
    }
  };

  const statItems = [
    { label: "Students", count: stats.total, Icon: Users, color: "text-blue-600" },
    { label: "Present", count: stats.present, Icon: CheckCircle, color: "text-green-600" },
    { label: "Absent", count: stats.absent, Icon: XCircle, color: "text-red-600" },
    { label: "Late", count: stats.late, Icon: AlertCircle, color: "text-yellow-600" },
    { label: "Excused", count: stats.excused, Icon: Clock, color: "text-purple-600" }
  ];

  return (
    <div className="space-y-6">
      <CoursesComponent page="Attendance" />
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
            <p className="text-sm text-gray-600">Review attendance records and submit attendance for a subject.</p>
          </div>
          <button onClick={submitAttendance} disabled={!selectedSubjectId || attendanceApi.mutating || !Object.keys(statuses).length} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {attendanceApi.mutating ? "Submitting..." : "Submit attendance"}
          </button>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="text-sm font-medium">Subject
            <select value={selectedSubjectId} onChange={(event) => setSelectedSubjectId(event.target.value)} className="mt-1 w-full rounded-lg border p-3">
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{teacherSubjectLabel(subject)}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Date
            <span className="relative mt-1 block">
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="w-full rounded-lg border py-3 pl-10 pr-3" />
            </span>
          </label>
          <label className="text-sm font-medium">Search students
            <span className="relative mt-1 block">
              <Filter className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name or username" className="w-full rounded-lg border py-3 pl-10 pr-3" />
            </span>
          </label>
        </div>

        {subjectsApi.error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-red-700">{subjectsApi.error.message}</p>}
        {attendanceApi.error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-red-700">{attendanceApi.error.message}</p>}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {statItems.map(({ label, count, Icon, color }) => (
            <div key={label} className="flex items-center justify-between rounded-lg border p-4">
              <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold">{count}</p></div>
              {createElement(Icon, { className: color, size: 24 })}
            </div>
          ))}
        </div>

        {subjectsApi.loading || studentsLoading || attendanceApi.loading ? <p className="py-8 text-center text-gray-500">Loading attendance data...</p>
          : !selectedSubjectId ? <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">You are not assigned to any subject yet.</p>
            : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Username</th><th className="px-4 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 font-medium">{studentName(student)}</td>
                        <td className="px-4 py-3 text-gray-600">{student.username || "—"}</td>
                        <td className="px-4 py-3">
                          <select aria-label={`Status for ${studentName(student)}`} value={statuses[student.id] || student.status} onChange={(event) => setStatuses((current) => ({ ...current, [student.id]: event.target.value }))} className="rounded-lg border px-3 py-2">
                            <option value="">Unmarked</option>
                            {["present", "absent", "late", "excused"].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!rows.length && <p className="p-6 text-center text-gray-500">No students take this subject yet.</p>}
              </div>
            )}
      </section>
    </div>
  );
}
