import React from "react";

const AttendanceTableHeader = () => {
  return (
    <div
      className="text-gray-800 font-semibold grid grid-cols-3 py-2 px-8 rounded-lg"
      style={{ backgroundColor: "#A3AED0" }}
    >
      <div>Student Name</div>
      <div>Status</div>
      <div>Due Date</div>
    </div>
  );
};

export default AttendanceTableHeader;
