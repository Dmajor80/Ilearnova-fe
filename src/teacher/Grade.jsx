// src/pages/Grade.jsx
import React from "react";
import TranscriptHeader from "./components/TranscriptHeader";
import StudentProfile from "./components/StudentProfile";
import GradeLegend from "./components/GradeLegend";
import CoursesComponent from "./components/CourseComponents";
import TranscriptTable from "./components/TranscriptTable";
import AssignmentRow from "./components/AssignmentRow";
import AssignmentTableHeader from "./components/AssignmentTableHeader";
import AttendanceHeader from "./components/AttendanceHeader";
import AssignmentHeader from "./components/AssignmentHeader";


// const student = {
//   name: "Priscilla Daniel",
//   id: "loremx/STU001",
//   grade: "Grade 8",
//   image: "https://randomuser.me/api/portraits/women/1.jpg"
// };
const students = [
  {
    sn: 1,
    name: "John Doe",
    status: "Early",
    comments: "Excellent attendance and participation",
    score: "23"
  },
  {
    sn: 2,
    name: "Jane Smith",
    status: "late",
    comments: "Needs to improve punctuality",
    score: "75"
  },
  {
    sn: 3,
    name: "Alice Johnson",
    status: "late",
    comments: "Good commitment overall",
    score: "81"
  },
  {
    sn: 4,
    name: "Bob Lee",
    status: "Early",
    comments: "Inconsistent in attendance",
    score: "68"
  },
  {
    sn: 5,
    name: "Charlie Kim",
    status: "late",
    comments: "Highly disciplined and attentive",
    score: "88"
  },
  {
    sn: 6,
    name: "Dana White",
    status: "late",
    comments: "Must work on time management",
    score: "59"
  },
  {
    sn: 7,
    name: "Evan Peters",
    status: "Early",
    comments: "Shows potential, stay consistent",
    score: "77"
  },
  {
    sn: 8,
    name: "Fiona Clark",
    status: "late",
    comments: "Often arrives late to class",
    score: "70"
  },
  {
    sn: 9,
    name: "George Adams",
    status: "Early",
    comments: "Model student",
    score: "90"
  },
  {
    sn: 10,
    name: "Helen Brooks",
    status: "late",
    comments: "Low attendance affecting performance",
    score: "62"
  }
];

// const studentsList = ["Priscilla Daniel", "John Doe", "Jane Smith"];

const Grade = () => {
  return (
    <div className="bg-[#F5F8FE]">
      <CoursesComponent page="Grade" />

    <AssignmentHeader/>

      <div className="bg-white mt-6">
           <AssignmentTableHeader/>

      <div className="border border-[#A3AED0] flex flex-col gap-5 rounded-xl p-4 mt-1.5">
          {
        students.map((student, index) => (
          <div>
            <AssignmentRow
              key={index}
              sn={student.sn}
              name={student.name}
              status={student.status}
              comments={student.comments}
              score={parseInt(student.score)} // Only extracts the number before "%"
            />

          </div>
        ))
      }
        
      </div>
    


        
      </div>

   

    </div>
  );
};

export default Grade;
