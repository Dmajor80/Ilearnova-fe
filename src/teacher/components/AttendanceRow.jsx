import React from "react";
import { Link } from "react-router-dom";

const getStatusStyle = (status) => {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-700";
    case "Absent":
      return "bg-red-100 text-red-700";
    case "Late":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "";
  }
};

const AttendanceRow = ({id, name, status, date }) => {
  return (
    <div
      className="grid grid-cols-3 items-center px-4 py-3 border-0 rounded-lg"
      style={{ backgroundColor: "#F5F8FE" }}
    >
      <div><Link to={`/student/${id}`} >{name}</Link></div>
      <div>
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusStyle(
            status
          )}`}
        >
          {status}
        </span>
      </div>
      <div>{date}</div>
    </div>
  );
};

export default AttendanceRow;
