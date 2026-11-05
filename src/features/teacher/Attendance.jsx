import { createElement, useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar, CheckCircle, Clock, Filter, Users, XCircle } from "lucide-react";
import { useTeacherAttendance, useTeacherClasses, useTeacherStudents } from "@/hooks/teacher";
import { getTeacherList } from "@/hooks/teacher/teacherApiUtils";
import CoursesComponent from "./components/CourseComponents";

const today = () => new Date().toISOString().slice(0, 10);

export default function Attendance() {
  const classesApi = useTeacherClasses();
  const studentsApi = useTeacherStudents();
  const attendanceApi = useTeacherAttendance();
  const fetchSubjects = classesApi.fetchSubjects;
  const fetchAttendanceReport = attendanceApi.fetchAttendanceReport;
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today());
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (!selectedClassId && classesApi.classes.length) {
      setSelectedClassId(classesApi.classes[0].id);
    }
  }, [classesApi.classes, selectedClassId]);

  useEffect(() => {
    let cancelled = false;
    const loadSubjects = async () => {
      if (!selectedClassId) return;
      try {
        const response = await fetchSubjects(selectedClassId);
        const data = response?.subjects ?? response?.results ?? response;
        const classSubjects = Array.isArray(data) ? data : [];
        if (cancelled) return;
        setSubjects(classSubjects);
        setSelectedSubjectId((current) =>
          classSubjects.some((subject) => subject.id === current)
            ? current
            : classSubjects[0]?.id || ""
        );
      } catch {
        if (!cancelled) {
          setSubjects([]);
          setSelectedSubjectId("");
        }
      }
    };
    loadSubjects();
    return () => { cancelled = true; };
  }, [fetchSubjects, selectedClassId]);

  useEffect(() => {
    if (!selectedSubjectId) return;
    fetchAttendanceReport(selectedSubjectId, {
      start_date: selectedDate,
      end_date: selectedDate
    }).catch(() => {});
  }, [fetchAttendanceReport, selectedDate, selectedSubjectId]);

  useEffect(() => {
    setStatuses({});
  }, [selectedClassId, selectedDate, selectedSubjectId]);

  const reportRecords = useMemo(
    () => getTeacherList(attendanceApi.attendanceReport, ["records", "attendance", "attendance_records"]),
    [attendanceApi.attendanceReport]
  );
  const selectedClass = classesApi.classes.find((item) => item.id === selectedClassId);
  const classStudents = useMemo(
    () => studentsApi.students.filter((student) =>
      !selectedClass?.name || student.class_name === selectedClass.name
    ),
    [selectedClass, studentsApi.students]
  );

  const rows = useMemo(() => classStudents.map((student) => {
    const record = reportRecords.find((entry) =>
      (entry.student_id || entry.student_role || entry.student?.id) === student.id
    );
    return {
      ...student,
      status: statuses[student.id] || record?.status || ""
    };
  }).filter((student) =>
    (student.full_name || `${student.first_name || ""} ${student.last_name || ""}`)
      .toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.student_id || "").toLowerCase().includes(searchTerm.toLowerCase())
  ), [classStudents, reportRecords, searchTerm, statuses]);

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
        start_date: selectedDate,
        end_date: selectedDate
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

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="text-sm font-medium">Class
            <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="mt-1 w-full rounded-lg border p-3">
              {classesApi.classes.map((item) => <option key={item.id} value={item.id}>{item.name || item.class_name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Subject
            <select value={selectedSubjectId} onChange={(event) => setSelectedSubjectId(event.target.value)} className="mt-1 w-full rounded-lg border p-3">
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
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
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name or student ID" className="w-full rounded-lg border py-3 pl-10 pr-3" />
            </span>
          </label>
        </div>

        {classesApi.error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-red-700">{classesApi.error.message}</p>}
        {studentsApi.error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-red-700">{studentsApi.error.message}</p>}
        {attendanceApi.error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-red-700">{attendanceApi.error.message}</p>}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {statItems.map(({ label, count, Icon, color }) => (
            <div key={label} className="flex items-center justify-between rounded-lg border p-4">
              <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold">{count}</p></div>
              {createElement(Icon, { className: color, size: 24 })}
            </div>
          ))}
        </div>

        {classesApi.loading || studentsApi.loading || attendanceApi.loading ? <p className="py-8 text-center text-gray-500">Loading attendance data...</p>
          : !selectedSubjectId ? <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">Select a class with an assigned subject to manage attendance.</p>
            : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 font-medium">{student.full_name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || student.username}</td>
                        <td className="px-4 py-3 text-gray-600">{student.student_id || "—"}</td>
                        <td className="px-4 py-3">
                          <select value={statuses[student.id] || student.status} onChange={(event) => setStatuses((current) => ({ ...current, [student.id]: event.target.value }))} className="rounded-lg border px-3 py-2">
                            <option value="">Unmarked</option>
                            {["present", "absent", "late", "excused"].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!rows.length && <p className="p-6 text-center text-gray-500">No students found for this class.</p>}
              </div>
            )}
      </section>
    </div>
  );
}
