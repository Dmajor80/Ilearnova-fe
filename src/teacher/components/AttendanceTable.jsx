import React from "react";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceTableHeader from "./AttendanceTableHeader";
import AttendanceRow from "./AttendanceRow";

const AttendanceTable = () => {
  const attendanceData = [
    { name: "Priscilla Daniel", status: "Present", date: "19/11/2024" },
    { name: "Priscilla Daniel", status: "Absent", date: "19/11/2024" },
    { name: "Priscilla Daniel", status: "Absent", date: "19/11/2024" },
    { name: "Priscilla Daniel", status: "Absent", date: "19/11/2024" },
    { name: "Priscilla Daniel", status: "Present", date: "19/11/2024" },
    { name: "Priscilla Daniel", status: "Present", date: "19/11/2024" },
    { name: "Priscilla Daniel", status: "Present", date: "19/11/2024" },
    { name: "Priscilla Daniel", status: "Late", date: "19/11/2024" },
  ];

  return (
    <div className="max-w-full mx-auto bg-white shadow rounded-xl p-4 ">
      <AttendanceHeader />
      <AttendanceTableHeader />

      <div className="divide-y rounded-b-md overflow-hidden flex flex-col gap-2 mt-2 border rounded-2xl p-4 border-[#A3AED0]">
        {attendanceData.map((item, index) => (
          <AttendanceRow
            key={index}
            name={item.name}
            status={item.status}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
};

export default AttendanceTable;
