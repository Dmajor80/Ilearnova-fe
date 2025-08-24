import React, { useState } from 'react';

const getStatusStyle = (status) => {
  switch (status) {
    case "Early":
      return "bg-green-100 text-green-700";
    case "late":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "";
  }
};

const AssignmentRow = ({ sn, name, status, comments, score }) => {
  // Determine grade based on score directly (no need for useState here)
  let grade = "";
  if (score > 70) {
    grade = "Excellent";
  } else if (score > 50 && score <= 70) {
    grade = "Good";
  } else if (score > 30 && score <= 50) {
    grade = "Average";
  } else {
    grade = "Poor";
  }

  return (
    <div
      className="grid grid-cols-5 items-center px-4 py-3   border-b"
      style={{ backgroundColor: "#F5F8FE" }}
    >
      <div>
        <span className="text-sm font-medium text-gray-700">{sn}</span>
      </div>
      <div>{name}</div>
      <div>
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusStyle(status)}`}
        >
          {status}
        </span>
      </div>
      <div>{grade}</div>
      <div>
        <span className="text-sm font-medium text-gray-700">{comments}</span>
      </div>
    </div>
  );
};

export default AssignmentRow;
