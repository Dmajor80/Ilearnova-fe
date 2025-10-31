import React, { useState } from "react";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";
import GenericModal from "../components/GenericModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { FileText, Clock, Activity } from "lucide-react";

const OrganizationExams = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const addExam = (exam) => {
    setExams([...exams, { ...exam, id: Date.now() }]);
  };

  const updateExam = (exam) => {
    setExams(exams.map(e => e.id === exam.id ? exam : e));
  };

  const deleteExam = (id) => {
    setExams(exams.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Exam Management</h3>
          <p className="text-gray-600 text-sm sm:text-base">Manage school exams and schedules</p>
        </div>
        <button onClick={() => { setEditingExam(null); setShowModal(true); }} className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Add Exam</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-700">Total Exams</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{exams.length}</p>
            </div>
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-700">Upcoming</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{exams.filter(e => new Date(e.date) > new Date()).length}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border min-h-[120px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-orange-700">Completed</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{exams.filter(e => new Date(e.date) < new Date()).length}</p>
            </div>
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <SchoolDataTable
          data={exams}
          columns={[
            { key: 'name', label: 'Exam Name' },
            { key: 'subject', label: 'Subject', className: 'hidden sm:table-cell' },
            { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
            { key: 'status', label: 'Status', render: (status) => <span className={`px-2 py-1 rounded-full text-xs ${status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{status}</span> },
          ]}
          actions={['edit', 'delete']}
          onAction={(row, action) => {
            if (action === 'edit') {
              setEditingExam(row);
              setShowModal(true);
            }
            if (action === 'delete') {
              setDeleteConfirm({ id: row.id, type: 'exam' });
            }
          }}
        />
      </div>
      {showModal && <GenericModal item={editingExam} type="exam" onSave={(exam) => {
        if (editingExam) {
          updateExam(exam);
        } else {
          addExam(exam);
        }
        setShowModal(false);
        setEditingExam(null);
      }} onClose={() => { setShowModal(false); setEditingExam(null); }} />}
      {deleteConfirm && deleteConfirm.type === 'exam' && <DeleteConfirmModal item={exams.find(e => e.id === deleteConfirm.id)} type="exam" onConfirm={() => { deleteExam(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
};

export default OrganizationExams;
