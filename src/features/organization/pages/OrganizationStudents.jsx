import React, { useState } from "react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import GenericModal from "../components/GenericModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { GraduationCap, Users, UserCheck, AlertTriangle } from "lucide-react";

const OrganizationStudents = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const addStudent = (student) => {
    setStudents([...students, { ...student, id: Date.now() }]);
  };

  const updateStudent = (student) => {
    setStudents(students.map(s => s.id === student.id ? student : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Student Management</h3>
          <p className="text-gray-600 text-sm sm:text-base">Manage student records and enrollment</p>
        </div>
        <button onClick={() => { setEditingStudent(null); setShowModal(true); }} className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
          <Users className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Add Student</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-700">Total Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{students.length}</p>
            </div>
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-700">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{students.filter(s => s.status === 'Active').length}</p>
            </div>
            <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-yellow-700">At Risk</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{students.filter(s => s.status === 'Inactive').length}</p>
            </div>
            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <SchoolDataTable
          data={students}
          columns={[
            { key: 'name', label: 'Student Name' },
            { key: 'email', label: 'Email', className: 'hidden sm:table-cell' },
            { key: 'grade', label: 'Grade' },
            { key: 'status', label: 'Status', render: (status) => <span className={`px-2 py-1 rounded-full text-xs ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status}</span> },
          ]}
          actions={['edit', 'delete']}
          onAction={(row, action) => {
            if (action === 'edit') {
              setEditingStudent(row);
              setShowModal(true);
            }
            if (action === 'delete') {
              setDeleteConfirm({ id: row.id, type: 'student' });
            }
          }}
        />
      </div>
      {showModal && <GenericModal item={editingStudent} type="student" onSave={(student) => {
        if (editingStudent) {
          updateStudent(student);
        } else {
          addStudent(student);
        }
        setShowModal(false);
        setEditingStudent(null);
      }} onClose={() => { setShowModal(false); setEditingStudent(null); }} />}
      {deleteConfirm && deleteConfirm.type === 'student' && <DeleteConfirmModal item={students.find(s => s.id === deleteConfirm.id)} type="student" onConfirm={() => { deleteStudent(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
};

export default OrganizationStudents;
