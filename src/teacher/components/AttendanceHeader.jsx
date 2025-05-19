import React from "react";

const AttendanceHeader = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Attendance</h2>
      <div className="flex gap-2">
        <select className="border rounded px-3 py-1 text-sm">
          <option>Class A</option>
        </select>
        <button className="border px-3 py-1 rounded text-sm flex items-center gap-1">
          <span>Filter</span>
        </button>
        <button className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200">
          Mark all absent
        </button>
        <button className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200">
          Mark all Present
        </button>
      </div>
    </div>
  );
};

export default AttendanceHeader;
