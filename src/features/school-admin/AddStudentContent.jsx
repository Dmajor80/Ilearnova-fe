import React from "react";
export const AddStudentContent = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Student</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Class
        </label>
        <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
          <option>Select Class</option>
          <option>10A</option>
          <option>10B</option>
          <option>11A</option>
          <option>11B</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
      >
        Add Student
      </button>
    </div>
  </div>
);
