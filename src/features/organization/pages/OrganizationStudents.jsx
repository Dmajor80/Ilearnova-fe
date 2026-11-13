import React, { useMemo, useState } from "react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import useOrganizationStudents from "@/hooks/organization/useStudentData";
import useOrganizationClasses from "@/hooks/organization/useOrganizationClasses";
import GenericModal from "../components/GenericModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { GraduationCap, Users, UserCheck, AlertTriangle, RefreshCw } from "lucide-react";

const getStudentName = (student) =>
  student.full_name ||
  [student.first_name, student.last_name].filter(Boolean).join(" ") ||
  student.name ||
  student.email ||
  "—";

const getRecordStatus = (record) => {
  if (typeof record.is_active === "boolean") return record.is_active ? "Active" : "Inactive";
  if (typeof record.status === "string" && record.status) {
    const status = record.status.toLowerCase();
    if (status === "active") return "Active";
    if (status === "inactive") return "Inactive";
    return record.status;
  }
  return "Unknown";
};

const OrganizationStudents = () => {
  const studentsApi = useOrganizationStudents();
  const classesApi = useOrganizationClasses({ page: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const rows = useMemo(() => studentsApi.students.map((student) => ({
    ...student,
    displayName: getStudentName(student),
    displayClass: student.class_name || student.grade || student.class || "—",
    displayStatus: getRecordStatus(student)
  })), [studentsApi.students]);
  const statStyles = {
    blue: { background: "bg-blue-50", foreground: "text-blue-600" },
    green: { background: "bg-green-50", foreground: "text-green-600" },
    yellow: { background: "bg-yellow-50", foreground: "text-yellow-600" }
  };

  const saveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        await studentsApi.updateStudent(editingStudent.id, studentData);
      } else {
        await studentsApi.createStudent(studentData);
      }
      setShowModal(false);
      setEditingStudent(null);
    } catch (error) {
      console.warn("Unable to save organization student:", error);
    }
  };

  const removeStudent = async () => {
    try {
      await studentsApi.deleteStudent(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.warn("Unable to delete organization student:", error);
    }
  };

  return (
    <div className="space-y-5 rounded-xl bg-white p-3 shadow-sm sm:p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 sm:text-2xl">Student Management</h3>
          <p className="text-sm text-gray-600">Manage student records and enrollment</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <input
            aria-label="Search students"
            className="min-w-0 flex-1 rounded-lg border px-3 py-2 sm:w-56"
            placeholder="Search students"
            value={studentsApi.searchQuery}
            onChange={(event) => studentsApi.handleSearch(event.target.value)}
          />
          <button
            onClick={() => { setEditingStudent(null); setShowModal(true); }}
            className="min-h-[44px] rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Add Student
          </button>
          <button
            onClick={() => studentsApi.refreshData(true)}
            aria-label="Refresh students"
            className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ["Total Students", studentsApi.totalStudents, GraduationCap, "blue"],
          ["Active", rows.filter((student) => student.displayStatus === "Active").length, UserCheck, "green"],
          ["Inactive", rows.filter((student) => student.displayStatus === "Inactive").length, AlertTriangle, "yellow"]
        ].map(([label, value, icon, color]) => (
          <div key={label} className={`flex items-center justify-between rounded-xl border p-4 ${statStyles[color].background}`}>
            <div><p className="text-sm text-gray-600">{label}</p><p className="text-2xl font-bold">{value}</p></div>
            {React.createElement(icon, { className: `h-7 w-7 ${statStyles[color].foreground}` })}
          </div>
        ))}
      </div>

      {studentsApi.error && <p role="alert" className="text-sm text-red-600">{studentsApi.error.message}</p>}
      <SchoolDataTable
        data={rows}
        loading={studentsApi.loading}
        error={studentsApi.error?.message}
        columns={[
          { key: "displayName", label: "Student Name" },
          { key: "email", label: "Email", className: "hidden sm:table-cell" },
          { key: "displayClass", label: "Class" },
          { key: "displayStatus", label: "Status", render: (status) => (
            <span className={`rounded-full px-2 py-1 text-xs ${status === "Active" ? "bg-green-100 text-green-800" : status === "Inactive" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>{status}</span>
          ) },
          { key: "actions", label: "", sortable: false, align: "right", render: (_, row) => (
            <div className="flex justify-end gap-2">
              <button className="text-blue-700 hover:underline" onClick={() => { setEditingStudent(row); setShowModal(true); }}>Edit</button>
              <button className="text-red-700 hover:underline" onClick={() => setDeleteConfirm(row)}>Delete</button>
            </div>
          ) }
        ]}
        showPagination={false}
      />

      {studentsApi.totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button className="rounded border px-3 py-2 disabled:opacity-50" disabled={!studentsApi.hasPreviousPage} onClick={() => studentsApi.handlePageChange(studentsApi.currentPage - 1)}>Previous</button>
          <span>Page {studentsApi.currentPage} of {studentsApi.totalPages}</span>
          <button className="rounded border px-3 py-2 disabled:opacity-50" disabled={!studentsApi.hasNextPage} onClick={() => studentsApi.handlePageChange(studentsApi.currentPage + 1)}>Next</button>
        </div>
      )}

      {showModal && <GenericModal item={editingStudent} type="student" saving={studentsApi.mutating} availableClasses={classesApi.classes} onSave={saveStudent} onClose={() => { setShowModal(false); setEditingStudent(null); }} />}
      {deleteConfirm && <DeleteConfirmModal item={deleteConfirm} type="student" onConfirm={removeStudent} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
};

export default OrganizationStudents;
