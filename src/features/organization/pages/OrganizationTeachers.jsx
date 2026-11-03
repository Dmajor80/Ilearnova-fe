import React, { useMemo, useState } from "react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import useOrganizationTeachers from "@/hooks/organization/useTeacherData";
import GenericModal from "../components/GenericModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { UserCheck, Activity, RefreshCw } from "lucide-react";

const getTeacherName = (teacher) =>
  teacher.full_name ||
  [teacher.first_name, teacher.last_name].filter(Boolean).join(" ") ||
  teacher.name ||
  teacher.email ||
  "—";

const getRecordStatus = (record) => {
  if (typeof record.is_active === "boolean") return record.is_active ? "Active" : "Inactive";
  if (typeof record.status === "string" && record.status) return record.status;
  return "Unknown";
};

const OrganizationTeachers = () => {
  const teachersApi = useOrganizationTeachers();
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const rows = useMemo(() => teachersApi.teachers.map((teacher) => ({
    ...teacher,
    displayName: getTeacherName(teacher),
    displaySubject: teacher.subject_name || teacher.subject || teacher.qualification || "—",
    displayStatus: getRecordStatus(teacher)
  })), [teachersApi.teachers]);

  const saveTeacher = async (teacherData) => {
    try {
      if (editingTeacher) {
        await teachersApi.updateTeacher(editingTeacher.id, teacherData);
      } else {
        await teachersApi.createTeacher(teacherData);
      }
      setShowModal(false);
      setEditingTeacher(null);
    } catch (error) {
      console.warn("Unable to save organization teacher:", error);
    }
  };

  const removeTeacher = async () => {
    try {
      await teachersApi.deleteTeacher(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.warn("Unable to delete organization teacher:", error);
    }
  };

  return (
    <div className="space-y-5 rounded-xl bg-white p-3 shadow-sm sm:p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 sm:text-2xl">Teacher Management</h3>
          <p className="text-sm text-gray-600">Manage faculty and staff</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <input
            aria-label="Search teachers"
            className="min-w-0 flex-1 rounded-lg border px-3 py-2 sm:w-56"
            placeholder="Search teachers"
            value={teachersApi.searchQuery}
            onChange={(event) => teachersApi.handleSearch(event.target.value)}
          />
          <button onClick={() => { setEditingTeacher(null); setShowModal(true); }} className="min-h-[44px] rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">Add Teacher</button>
          <button onClick={() => teachersApi.refreshData(true)} aria-label="Refresh teachers" className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border bg-purple-50 p-4">
          <div><p className="text-sm text-gray-600">Total Teachers</p><p className="text-2xl font-bold">{teachersApi.totalTeachers}</p></div>
          <UserCheck className="h-7 w-7 text-purple-600" />
        </div>
        <div className="flex items-center justify-between rounded-xl border bg-green-50 p-4">
          <div><p className="text-sm text-gray-600">Active</p><p className="text-2xl font-bold">{rows.filter((teacher) => teacher.displayStatus === "Active").length}</p></div>
          <Activity className="h-7 w-7 text-green-600" />
        </div>
      </div>

      <SchoolDataTable
        data={rows}
        loading={teachersApi.loading}
        error={teachersApi.error?.message}
        columns={[
          { key: "displayName", label: "Teacher Name" },
          { key: "email", label: "Email", className: "hidden sm:table-cell" },
          { key: "displaySubject", label: "Qualification" },
          { key: "displayStatus", label: "Status", render: (status) => (
            <span className={`rounded-full px-2 py-1 text-xs ${status === "Active" ? "bg-green-100 text-green-800" : status === "Inactive" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>{status}</span>
          ) },
          { key: "actions", label: "", sortable: false, align: "right", render: (_, row) => (
            <div className="flex justify-end gap-2">
              <button className="text-blue-700 hover:underline" onClick={() => { setEditingTeacher(row); setShowModal(true); }}>Edit</button>
              <button className="text-red-700 hover:underline" onClick={() => setDeleteConfirm(row)}>Delete</button>
            </div>
          ) }
        ]}
        showPagination={false}
      />

      {teachersApi.totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button className="rounded border px-3 py-2 disabled:opacity-50" disabled={!teachersApi.hasPreviousPage} onClick={() => teachersApi.handlePageChange(teachersApi.currentPage - 1)}>Previous</button>
          <span>Page {teachersApi.currentPage} of {teachersApi.totalPages}</span>
          <button className="rounded border px-3 py-2 disabled:opacity-50" disabled={!teachersApi.hasNextPage} onClick={() => teachersApi.handlePageChange(teachersApi.currentPage + 1)}>Next</button>
        </div>
      )}

      {showModal && <GenericModal item={editingTeacher} type="teacher" saving={teachersApi.mutating} onSave={saveTeacher} onClose={() => { setShowModal(false); setEditingTeacher(null); }} />}
      {deleteConfirm && <DeleteConfirmModal item={deleteConfirm} type="teacher" onConfirm={removeTeacher} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
};

export default OrganizationTeachers;
