import React, { useEffect, useMemo, useState } from "react";
import CoursesComponent from "./components/CourseComponents";
import { Plus, Search, Filter, Calendar, Clock, Users, FileText, Edit, Trash2, Eye, Download, RefreshCw } from "lucide-react";
import { useTeacherAssignments, useTeacherClasses, useTeacherStudents } from "@/hooks/teacher";

const Assignments = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", due_date: "", subject: "", is_active: true });
  const assignmentsApi = useTeacherAssignments();
  const classesApi = useTeacherClasses();
  const fetchSubjects = classesApi.fetchSubjects;
  const studentsApi = useTeacherStudents();
  const [subjects, setSubjects] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [assignmentPage, setAssignmentPage] = useState(1);
  const [submissionPage, setSubmissionPage] = useState(1);

  useEffect(() => {
    const loadSubjects = async () => {
      const subjectResponses = await Promise.all(
        classesApi.classes.map(async (classItem) => {
          try {
            const response = await fetchSubjects(classItem.id);
            const data = response?.subjects ?? response?.results ?? response;
            return (Array.isArray(data) ? data : []).map((subject) => ({
              ...subject,
              class_name: subject.class_name || classItem.name,
              class_id: classItem.id
            }));
          } catch {
            return [];
          }
        })
      );
      setSubjects(subjectResponses.flat());
    };
    if (classesApi.classes.length) loadSubjects();
  }, [classesApi.classes, fetchSubjects]);

  const assignments = assignmentsApi.assignments;
  const openForm = (assignment = null) => {
    setEditingAssignment(assignment);
    setForm({
      title: assignment?.title || "",
      description: assignment?.description || "",
      due_date: assignment?.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : "",
      subject: assignment?.subject || "",
      is_active: assignment?.is_active ?? true
    });
    setShowForm(true);
  };

  const saveAssignment = async (event) => {
    event.preventDefault();
    try {
      await assignmentsApi.saveAssignment({
        ...form,
        due_date: new Date(form.due_date).toISOString()
      }, editingAssignment?.id, { page: assignmentPage });
      setShowForm(false);
      setEditingAssignment(null);
    } catch {
      // The API hook reports request failures to the user.
    }
  };

  const openSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionPage(1);
    setSubmissionsLoading(true);
    try {
      await assignmentsApi.fetchSubmissions(assignment.id, { page: 1 });
    } catch {
      // The API hook reports request failures to the user.
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const changeAssignmentPage = (page) => {
    setAssignmentPage(page);
    assignmentsApi.refreshData({ page });
  };

  const changeSubmissionPage = (page) => {
    if (!selectedAssignment) return;
    setSubmissionPage(page);
    assignmentsApi.fetchSubmissions(selectedAssignment.id, { page }).catch(() => {});
  };

  const filteredAssignments = assignments.filter(assignment => {
    const status = assignment.is_active ? "active" : "inactive";
    const matchesSearch = (assignment.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.subject_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.class_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubmissionRate = (submissions, total) => {
    return total ? Math.round((submissions / total) * 100) : 0;
  };

  const activeCount = useMemo(() => assignments.filter((item) => item.is_active).length, [assignments]);
  const submissionCount = useMemo(() => assignments.reduce((sum, item) => sum + Number(item.submission_count || 0), 0), [assignments]);

  return (
    <>
      <CoursesComponent page="Assignments" />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Assignments Management</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => assignmentsApi.refreshData({ page: assignmentPage }, true)} aria-label="Refresh assignments" className="rounded-lg border px-3 text-gray-700 hover:bg-gray-50">
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Create Assignment</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1">
              {["assignments", "templates", "grading"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {assignmentsApi.loading && <p className="rounded-xl bg-white p-6 text-center text-gray-600">Loading assignments...</p>}
            {assignmentsApi.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{assignmentsApi.error.message}</p>}
            {classesApi.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{classesApi.error.message}</p>}
            {studentsApi.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{studentsApi.error.message}</p>}
            {!assignmentsApi.loading && filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {(() => {
                    const submitted = Number(assignment.submission_count || 0);
                    const total = studentsApi.students.filter((student) => student.class_name === assignment.class_name).length;
                    const status = assignment.is_active ? "active" : "inactive";
                    return (
                  <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                      {assignment.description && <p className="text-gray-600 mb-3">{assignment.description}</p>}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{assignment.subject_name || "Subject"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{assignment.class_name || "Class"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "Not set"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button onClick={() => openSubmissions(assignment)} aria-label="View submissions" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => openForm(assignment)} aria-label="Edit assignment" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={async () => {
                        if (window.confirm(`Delete "${assignment.title}"?`)) {
                          try { await assignmentsApi.removeAssignment(assignment.id, { page: assignmentPage }); } catch { /* Hook reports failures. */ }
                        }
                      }} aria-label="Delete assignment" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress and Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Submissions</div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {submitted}/{total || "—"}
                          </span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${getSubmissionRate(submitted, total)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {total ? `${getSubmissionRate(submitted, total)}%` : "Submissions"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-1">Created</div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {assignment.created_at ? new Date(assignment.created_at).toLocaleDateString() : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button onClick={() => openSubmissions(assignment)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                        View Submissions ({submitted})
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                  </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>

          {!assignmentsApi.loading && filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {assignmentsApi.assignmentPagination && (
            <div className="flex items-center justify-between rounded-xl bg-white p-4">
              <span className="text-sm text-gray-500">
                Page {assignmentsApi.assignmentPagination.page} · {assignmentsApi.assignmentPagination.total} assignments
              </span>
              <div className="flex gap-2">
                <button type="button" disabled={!assignmentsApi.assignmentPagination.previous || assignmentPage <= 1} onClick={() => changeAssignmentPage(assignmentPage - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button>
                <button type="button" disabled={!assignmentsApi.assignmentPagination.next} onClick={() => changeAssignmentPage(assignmentPage + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {activeCount}
                </div>
                <div className="text-sm text-gray-600">Active Assignments</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {submissionCount}
                </div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {assignments.filter((assignment) => !assignment.is_active).length}
                </div>
                <div className="text-sm text-gray-600">Draft Assignments</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {assignments.filter((assignment) => assignment.is_active && assignment.due_date && new Date(assignment.due_date) < new Date()).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveAssignment} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{editingAssignment ? "Edit assignment" : "Create assignment"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
            </div>
            <label className="block text-sm font-medium">Title
              <input required maxLength={200} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="block text-sm font-medium">Description
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded-lg border p-3" rows="3" />
            </label>
            <label className="block text-sm font-medium">Subject
              <select required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="mt-1 w-full rounded-lg border p-3">
                <option value="">Choose a subject</option>
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.class_name} - {subject.name}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Due date
              <input type="datetime-local" required value={form.due_date} onChange={(event) => setForm({ ...form, due_date: event.target.value })} className="mt-1 w-full rounded-lg border p-3" />
            </label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Active</label>
            <button disabled={assignmentsApi.mutating} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
              {assignmentsApi.mutating ? "Saving..." : "Save assignment"}
            </button>
          </form>
        </div>
      )}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Submissions: {selectedAssignment.title}</h3>
              <button onClick={() => setSelectedAssignment(null)} className="text-gray-500">Close</button>
            </div>
            {submissionsLoading ? <p>Loading submissions...</p> : assignmentsApi.submissions.length ? (
              <div className="divide-y">
                {assignmentsApi.submissions.map((submission) => (
                  <div key={submission.id} className="py-3">
                    <p className="font-medium">{submission.student_name || submission.student?.name || "Student"}</p>
                    <p className="text-sm text-gray-600">{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : ""}</p>
                    {submission.content && <p className="mt-1 text-sm">{submission.content}</p>}
                    {submission.submitted_file && <a href={submission.submitted_file} className="text-sm text-blue-600" target="_blank" rel="noreferrer">View submitted file</a>}
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-600">No submissions are available for this assignment.</p>}
            {assignmentsApi.submissionPagination && (
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-sm text-gray-500">
                  Page {assignmentsApi.submissionPagination.page} · {assignmentsApi.submissionPagination.total} submissions
                </span>
                <div className="flex gap-2">
                  <button type="button" disabled={!assignmentsApi.submissionPagination.previous || submissionPage <= 1} onClick={() => changeSubmissionPage(submissionPage - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button>
                  <button type="button" disabled={!assignmentsApi.submissionPagination.next} onClick={() => changeSubmissionPage(submissionPage + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Assignments;
