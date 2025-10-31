import React, { useState } from "react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import GenericModal from "../components/GenericModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { UserCheck, Activity, TrendingUp } from "lucide-react";

const OrganizationTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const addTeacher = (teacher) => {
    setTeachers([...teachers, { ...teacher, id: Date.now() }]);
  };

  const updateTeacher = (teacher) => {
    setTeachers(teachers.map(t => t.id === teacher.id ? teacher : t));
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Teacher Management</h3>
          <p className="text-gray-600 text-sm sm:text-base">Manage faculty and staff</p>
        </div>
        <button onClick={() => { setEditingTeacher(null); setShowModal(true); }} className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
          <UserCheck className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Add Teacher</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-purple-700">Total Teachers</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{teachers.length}</p>
            </div>
            <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-700">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{teachers.filter(t => t.status === 'Active').length}</p>
            </div>
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-indigo-700">Average Rating</p>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600">4.5</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <SchoolDataTable
          data={teachers}
          columns={[
            { key: 'name', label: 'Teacher Name' },
            { key: 'email', label: 'Email', className: 'hidden sm:table-cell' },
            { key: 'subject', label: 'Subject' },
            { key: 'status', label: 'Status', render: (status) => <span className={`px-2 py-1 rounded-full text-xs ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status}</span> },
          ]}
          actions={['edit', 'delete']}
          onAction={(row, action) => {
            if (action === 'edit') {
              setEditingTeacher(row);
              setShowModal(true);
            }
            if (action === 'delete') {
              setDeleteConfirm({ id: row.id, type: 'teacher' });
            }
          }}
        />
      </div>
      {showModal && <GenericModal item={editingTeacher} type="teacher" onSave={(teacher) => {
        if (editingTeacher) {
          updateTeacher(teacher);
        } else {
          addTeacher(teacher);
        }
        setShowModal(false);
        setEditingTeacher(null);
      }} onClose={() => { setShowModal(false); setEditingTeacher(null); }} />}
      {deleteConfirm && deleteConfirm.type === 'teacher' && <DeleteConfirmModal item={teachers.find(t => t.id === deleteConfirm.id)} type="teacher" onConfirm={() => { deleteTeacher(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
};

export default OrganizationTeachers;
