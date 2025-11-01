import React, { useState } from "react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import GenericModal from "../components/GenericModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { BookOpen, Activity, Users } from "lucide-react";

const OrganizationClasses = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const addClass = (cls) => {
    setClasses([...classes, { ...cls, id: Date.now() }]);
  };

  const updateClass = (cls) => {
    setClasses(classes.map(c => c.id === cls.id ? cls : c));
  };

  const deleteClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Class Management</h3>
          <p className="text-gray-600 text-sm sm:text-base">Manage classes and schedules</p>
        </div>
        <button onClick={() => { setEditingClass(null); setShowModal(true); }} className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Add Class</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-indigo-700">Total Classes</p>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{classes.length}</p>
            </div>
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-700">Active Classes</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{classes.filter(c => c.status === 'Active').length || classes.length}</p>
            </div>
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-teal-700">Avg Size</p>
              <p className="text-2xl sm:text-3xl font-bold text-teal-600">25</p>
            </div>
            <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-500" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <SchoolDataTable
          data={classes}
          columns={[
            { key: 'name', label: 'Class Name' },
            { key: 'subject', label: 'Subject' },
            { key: 'teacher', label: 'Teacher', className: 'hidden sm:table-cell' },
            { key: 'students', label: '# Students' },
          ]}
          actions={['edit', 'delete']}
          onAction={(row, action) => {
            if (action === 'edit') {
              setEditingClass(row);
              setShowModal(true);
            }
            if (action === 'delete') {
              setDeleteConfirm({ id: row.id, type: 'class' });
            }
          }}
        />
      </div>
      {showModal && <GenericModal item={editingClass} type="class" onSave={(cls) => {
        if (editingClass) {
          updateClass(cls);
        } else {
          addClass(cls);
        }
        setShowModal(false);
        setEditingClass(null);
      }} onClose={() => { setShowModal(false); setEditingClass(null); }} />}
      {deleteConfirm && deleteConfirm.type === 'class' && <DeleteConfirmModal item={classes.find(c => c.id === deleteConfirm.id)} type="class" onConfirm={() => { deleteClass(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
};

export default OrganizationClasses;
