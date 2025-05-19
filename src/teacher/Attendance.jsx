import React from "react";
import CoursesComponent from "./components/CourseComponents";
import AttendanceTable from "./components/AttendanceTable";

const Attendance = () => {
  return(
    <>
    <CoursesComponent page="Attendance" />
    <div className="min-h-screen bg-gray-100 p-6">
      <AttendanceTable />
    </div>
    
    </>
  )
};

export default Attendance;
