import React, { useMemo, useState } from "react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import useOrganizationClasses from "@/hooks/organization/useOrganizationClasses";
import GenericModal from "../components/GenericModal";
import { BookOpen, RefreshCw, Search, Users } from "lucide-react";

const OrganizationClasses = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const classesApi = useOrganizationClasses({ page, search });
  const [showModal, setShowModal] = useState(false);

  const rows = useMemo(() => classesApi.classes.map((item) => ({
    ...item,
    displayName: item.name || "—",
    displayDescription: item.description || "—",
    displayTeacher: item.teacher_name || "—",
    displayStudents: item.student_count ?? "—",
    displayStatus: item.is_active === false ? "Inactive" : item.is_active === true ? "Active" : "Unknown",
    displayCreated: item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"
  })), [classesApi.classes]);

  const saveClass = async (classData) => {
    try {
      await classesApi.createClass(classData);
      setShowModal(false);
    } catch (error) {
      console.warn("Unable to create organization class:", error);
    }
  };

  return (
    <div className="space-y-5 rounded-xl bg-white p-3 shadow-sm sm:p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 sm:text-2xl">Class Management</h3>
          <p className="text-sm text-gray-600">View and search classes in your organization</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Add Class</button>
          <button onClick={() => classesApi.refreshData(true)} aria-label="Refresh classes" className="min-h-[44px] rounded-lg border px-3 text-gray-700 hover:bg-gray-50"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border bg-indigo-50 p-4">
          <div><p className="text-sm text-gray-600">Classes</p><p className="text-2xl font-bold">{classesApi.count}</p></div>
          <BookOpen className="h-7 w-7 text-indigo-600" />
        </div>
        <div className="flex items-center justify-between rounded-xl border bg-teal-50 p-4">
          <div><p className="text-sm text-gray-600">Students on this page</p><p className="text-2xl font-bold">{classesApi.classes.reduce((total, item) => total + (Number(item.student_count) || 0), 0)}</p></div>
          <Users className="h-7 w-7 text-teal-600" />
        </div>
      </div>

      <label className="flex max-w-md items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        <Search className="h-4 w-4 text-gray-500" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search classes"
          aria-label="Search classes"
          className="min-h-[44px] w-full bg-transparent text-sm outline-none"
        />
      </label>

      <SchoolDataTable
        data={rows}
        loading={classesApi.loading}
        error={classesApi.error?.message}
        columns={[
          { key: "displayName", label: "Class Name" },
          { key: "displayDescription", label: "Description" },
          { key: "displayTeacher", label: "Teacher" },
          { key: "displayStudents", label: "Students" },
          { key: "displayStatus", label: "Status" },
          { key: "displayCreated", label: "Created" }
        ]}
        showPagination={false}
      />
      {!classesApi.loading && !classesApi.error && (
        <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
          <span>
            Showing {classesApi.classes.length} classes on this page · {classesApi.count} total
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
              disabled={!classesApi.previous}
              className="min-h-[40px] rounded-lg border px-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={!classesApi.next}
              className="min-h-[40px] rounded-lg border px-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {showModal && <GenericModal type="class" saving={classesApi.mutating} availableClasses={classesApi.availableClasses} onSave={saveClass} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default OrganizationClasses;
