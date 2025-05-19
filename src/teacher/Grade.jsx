// src/pages/Grade.jsx
import React from "react";
import TranscriptHeader from "./components/TranscriptHeader";
import StudentProfile from "./components/StudentProfile";
import GradeLegend from "./components/GradeLegend";
import CoursesComponent from "./components/CourseComponents";
import TranscriptTable from "./components/TranscriptTable";

const student = {
  name: "Priscilla Daniel",
  id: "loremx/STU001",
  grade: "Grade 8",
  image: "https://randomuser.me/api/portraits/women/1.jpg"
};

const subjects = [
  {
    name: "Mathematics",
    term1: "85% (A)",
    term2: "88% (A)",
    term3: "90% (A)",
    final: "90% (A)",
    remark: "Excellent performance"
  },
  {
    name: "English Language",
    term1: "79% (B)",
    term2: "82% (A)",
    term3: "80% (B)",
    final: "80% (B)",
    remark: "Good effort"
  },
  {
    name: "Physics",
    term1: "90% (A)",
    term2: "88% (A)",
    term3: "85% (A)",
    final: "88% (A)",
    remark: "Outstanding"
  },
  {
    name: "Chemistry",
    term1: "80% (B)",
    term2: "83% (A)",
    term3: "82% (A)",
    final: "82% (A)",
    remark: "Consistent"
  },
  {
    name: "Biology",
    term1: "75% (B)",
    term2: "77% (B)",
    term3: "79% (B)",
    final: "82% (A)",
    remark: "Needs improvement"
  },
  {
    name: "Civic",
    term1: "90% (A)",
    term2: "90% (A)",
    term3: "92% (A)",
    final: "90% (A)",
    remark: "Excellent Performance"
  },
  {
    name: "Geography",
    term1: "85% (A)",
    term2: "84% (B)",
    term3: "83% (A)",
    final: "84% (A)",
    remark: "Well-done"
  },
  {
    name: "Computer Science",
    term1: "90% (A)",
    term2: "91% (A)",
    term3: "90% (A)",
    final: "90% (A)",
    remark: "Outstanding"
  },
  {
    name: "Physical Education",
    term1: "70% (A)",
    term2: "75% (A)",
    term3: "76% (A)",
    final: "74% (B)",
    remark: "Improving"
  }
];

const studentsList = ["Priscilla Daniel", "John Doe", "Jane Smith"];

const Grade = () => {
  return (
    <>
      <CoursesComponent page="Grade" />

     
    </>
  );
};

export default Grade;
