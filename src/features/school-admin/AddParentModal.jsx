import React, { useState } from "react";
import { X, User, Loader2 } from "lucide-react";
import useParentData from "@/hooks/useParentData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

/**
 * AddNewParent - Self-contained modal for adding a new parent
 */
const AddNewParent = () => {
  const { createParent, mutating, notification } = useParentData();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      is_active: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createParent(formData);
      resetForm();
    } catch (err) {
      console.error("Failed to create parent:", err);
    }
  };

  // if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div className=" flex items-center justify-center z-50 p-4">
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
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-800">Add New Parent</h2>
            {/* <button
              onClick={handleClose}
              disabled={mutating}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
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
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
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

              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active account
                </label>
              </div>
            </div>

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
                Add Parent
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AddNewParent;
