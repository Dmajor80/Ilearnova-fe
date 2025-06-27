import React from "react";
export const StudentDetailContent = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Details</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-center">John Doe</h3>
          <p className="text-gray-600 text-center">Student ID: STU001</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <p className="text-gray-900">John Doe</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-gray-900">john.doe@akademi.com</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <p className="text-gray-900">10A</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <p className="text-gray-900">+1 234 567 8900</p>
        </div>
      </div>
    </div>
  </div>
);
