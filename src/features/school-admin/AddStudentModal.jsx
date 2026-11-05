import React, { useState } from "react";
import { X, User, Users, Loader2 } from "lucide-react";
import useStudentData from "@/hooks/useStudentData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

/**
 * AddNewStudent - Self-contained modal for adding a new student
 * Handles its own form state, validation, API call, notifications and error boundary
 * 
 * Props:
 */
const AddNewStudent = () => {
  const {
    createStudent,
    availableGrades,
    gradesLoading,
    mutating,
    notification,
  } = useStudentData();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    student_id: "",
    class_id: "",
  });

  const resetForm = () => {
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      date_of_birth: "",
      address: "",
      student_id: "",
      class_id: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleClose = () => {
  //   if (mutating) return;
  //   resetForm();
  //   onClose?.();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      resetForm();
      onSuccess?.();
    } catch (err) {
      // Notification is already handled by useStudentData hook
      // Keep modal open so admin can correct input
      console.error("Failed to create student:", err);
    }
  };

  // if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div className=" flex items-center justify-center z-50 p-4">
        {/* Notification inside modal */}
        {notification?.show && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4">
            <NotificationBar
              message={notification.message}
              type={notification.type}
              onClose={notification.hide}
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
            {/* <button
              onClick={handleClose}
              disabled={mutating}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4 mt-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Enrollment</h3>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave blank to auto-generate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={gradesLoading}
                >
                  <option value="">
                    {gradesLoading ? "Loading classes..." : "Select class"}
                  </option>
                  {availableGrades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.label || grade.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              {/* <button
                type="button"
                onClick={handleClose}
                disabled={mutating}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button> */}
              <button
                type="submit"
                disabled={mutating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {mutating && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AddNewStudent;
