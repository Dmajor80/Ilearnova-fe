import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./homepage/HomePage";
import SignupForm from "./signup/SignupForm";

// Login Pages
import LoginPage from "./teacher/LoginPage";
import StudentLogin from "./student/StudentLogin";
import ParentLogin from "./parent/ParentLogin";
import AdminLogin from "./admin/AdminLogin";

// Dashboards
import StudentDashboard from "./student/StudentDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import ParentDashboard from "./parent/ParentDashboard";

// Student Dashboard Inner Routes
import Overview from "./student/Overview";
import Messages from "./student/Messages";
import Attendance from "./student/Attendance";
import Assignments from "./student/Assignments";
import Timetable from "./student/Timetable";
import Grade from "./student/Grade";
import { CoursePage, CoursesComponent } from "./student/CoursesComponent";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/parent-login" element={<ParentLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Dashboards */}
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />

      {/* Student Dashboard with Nested Routes */}
      <Route path="/student-dashboard" element={<StudentDashboard />}>
        <Route path="overview" element={<Overview />} />
        <Route path="message" element={<Messages />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignment" element={<Assignments />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="grade" element={<Grade />} />
        <Route path="courses" element={<CoursesComponent />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
      </Route>
    </Routes>
  );
};

export default App;
