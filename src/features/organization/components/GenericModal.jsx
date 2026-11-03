import React, { useState } from "react";
import { X } from "lucide-react";

const fieldGroups = {
  student: [
    { name: "first_name", label: "First name" },
    { name: "last_name", label: "Last name" },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "student_id", label: "Student ID" },
    { name: "class_id", label: "Class ID" },
    { name: "phone_number", label: "Phone number" },
    { name: "date_of_birth", label: "Date of birth", type: "date" }
  ],
  teacher: [
    { name: "first_name", label: "First name" },
    { name: "last_name", label: "Last name" },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "employee_id", label: "Employee ID" },
    { name: "qualification", label: "Qualification" },
    { name: "salary_amount", label: "Salary amount", type: "number" },
    { name: "salary_frequency", label: "Salary frequency" },
    { name: "phone_number", label: "Phone number" },
    { name: "date_of_birth", label: "Date of birth", type: "date" }
  ],
  class: [
    { name: "name", label: "Class name", required: true },
    { name: "grade_level", label: "Grade level" },
    { name: "section", label: "Section" },
    { name: "academic_year", label: "Academic year" },
    { name: "capacity", label: "Capacity", type: "number" }
  ],
  exam: [
    { name: "name", label: "Exam name", required: true },
    { name: "subject", label: "Subject", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "status", label: "Status" }
  ]
};

const GenericModal = ({ item, type, onSave, onClose, saving = false, availableClasses = [] }) => {
  const [form, setForm] = useState(() => {
    const initial = item ? { ...item } : {};
    if (type === "student" || type === "teacher") {
      const [firstName = "", ...lastName] = String(initial.name || "").split(" ");
      initial.first_name = initial.first_name || firstName;
      initial.last_name = initial.last_name || lastName.join(" ");
    }
    return initial;
  });
  const fields = fieldGroups[type] || [];

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = fields.reduce((result, field) => {
      const value = form[field.name];
      if (value !== undefined && value !== "") {
        result[field.name] = field.type === "number" ? Number(value) : value;
      }
      return result;
    }, {});
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold capitalize text-gray-800">{item ? "Edit" : "Add"} {type}</h3>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="text-gray-500 hover:text-gray-800"><X className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={`organization-${type}-${field.name}`} className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label>
              {field.name === "class_id" && availableClasses.length > 0 ? (
                <select
                  id={`organization-${type}-${field.name}`}
                  value={form[field.name] || ""}
                  required={field.required}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-3"
                >
                  <option value="">Select a class</option>
                  {availableClasses.map((classItem, index) => (
                    <option key={classItem.id || index} value={classItem.id || classItem.class_id || ""}>
                      {classItem.name || classItem.class_name || classItem.title || `Class ${index + 1}`}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`organization-${type}-${field.name}`}
                  type={field.type || "text"}
                  value={form[field.name] ?? ""}
                  required={field.required}
                  min={field.type === "number" ? "0" : undefined}
                  step={field.name === "salary_amount" ? "0.01" : undefined}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving..." : item ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericModal;
