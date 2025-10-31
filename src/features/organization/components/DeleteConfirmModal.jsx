import React from "react";

const DeleteConfirmModal = ({ item, type, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
      <h3 className="text-xl font-semibold mb-4 text-red-600">Confirm Delete</h3>
      <p className="mb-6 text-gray-600">Are you sure you want to delete this {type}? This action cannot be undone.</p>
      <div className="flex justify-end space-x-3">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;
