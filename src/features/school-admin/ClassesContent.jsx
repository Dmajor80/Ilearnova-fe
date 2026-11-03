import React, { useState } from "react";
import {
  Plus,
  X,
  RefreshCw,
  Loader2,
  AlertCircle,
  School,
} from "lucide-react";
import useClassesData from "@/hooks/useClassesData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

export const ClassesContent = () => {
  const {
    loading,
    error,
    classes,
    mutating,
    refreshData,
    createClass,
    notification
  } = useClassesData();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grade_level: "",
    section: "",
    academic_year: "",
    capacity: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", grade_level: "", section: "", academic_year: "", capacity: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClass(formData);
      setShowModal(false);
      resetForm();
    } catch (err) {
      // Notification already surfaced by the hook; keep modal open.
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-6">
        {notification.show && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={notification.hide}
          />
        )}

        <div className="flex justify-between items-center p-6 bg-white mb-10 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#303972]">Classes</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshData(true)}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setShowModal(true)}
              disabled={loading}
              className="bg-[#4D44B5] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4 font-semibold" />
              <span className="text-[13px] font-semibold">New Class</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center space-x-2 p-16 bg-white rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-gray-500">Loading classes...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-2 p-16 bg-white rounded-lg">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="text-gray-500">Failed to load classes</span>
            <button
              onClick={() => refreshData(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center space-y-3 p-16 bg-white rounded-lg">
            <School className="w-12 h-12 text-gray-400" />
            <span className="text-gray-600 font-medium">No classes set up yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {classes.map((cls, index) => (
              <div key={cls.id || index} className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#303972]">
                  {cls.name || cls.label || `Class ${index + 1}`}
                </h3>
                {(cls.grade_level || cls.section) && (
                  <p className="text-sm text-[#A098AE] mt-1">
                    {[cls.grade_level, cls.section].filter(Boolean).join(" · ")}
                  </p>
                )}
                {cls.academic_year && (
                  <p className="text-xs text-[#A098AE] mt-2">{cls.academic_year}</p>
                )}
                {typeof cls.capacity !== "undefined" && (
                  <p className="text-xs text-[#4D44B5] mt-1 font-medium">
                    Capacity: {cls.capacity}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">New Class</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Grade 10A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                    <input
                      type="text"
                      name="grade_level"
                      value={formData.grade_level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <input
                      type="text"
                      name="academic_year"
                      value={formData.academic_year}
                      onChange={handleInputChange}
                      placeholder="e.g. 2026-2027"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutating}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {mutating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ClassesContent;
