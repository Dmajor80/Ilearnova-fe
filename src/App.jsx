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
// import Messages from "./student/Messages";
import Attendance from "./student/Attendance";
// import Assignments from "./student/Assignments";
import Timetable from "./student/Timetable";
import Grade from "./student/Grade";
import { CoursePage, CoursesComponent } from "./student/CoursesComponent";
import Result from "./student/Result";
import Exam from "./student/Exam";
import IdCard from "./student/IdCard";
import AdminDashboard from "./admin/AdminDashboard";
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import NewUser from "./admin/NewUser";
import Report from "./admin/Report";
// import Transcript from "./parent/components/Transcript";
import SchoolAdmin from "./School-Admin/SchoolAdmin";
// import { CoursePage } from "./student/CoursesComponent";
// import Payment from "./parent/Payment";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
        {/* teacher login */}
        <Route path="/login" element={<LoginPage />} />
        {/* student login */}
        <Route path="/student-login" element={<StudentLogin />} />
        {/* Parent login */}
        <Route path="/parent-login" element={<ParentLogin />} />
        {/* Admin login */}
        <Route path="/Admin-login" element={<AdminLogin />} />

        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        {/* student dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route path="/student-dashboard" element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="IDcard" element={<IdCard />} />
          <Route path="attendance" element={<Attendance />} />
          {/* <Route path="assignment" element={<Assignments />} /> */}
          <Route path="timetable" element={<Timetable />} />
          <Route path="transcript" element={<Grade />} />
          <Route path="courses" element={<CoursesComponent />} />
          <Route path="result" element={<Result />} />
          <Route path="exam" element={<Exam />} />
          <Route path="courses/:courseId" element={<CoursePage />} />
          {/* <Route path="messages" element={<Messages />} /> */}
        </Route>
        {/* end of student dashboard */}
        {/* admin section */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new-user" element={<NewUser />} />
          <Route path="reports" element={<Report />} />
        </Route>
        {/*end of  admin section */}
        <Route path="/dashboard" element={<SchoolAdmin />} />
      </Routes>
    </>
  );
};

export default App;
