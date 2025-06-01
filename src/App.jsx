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
import Result from "./student/Result";
import Exam from "./student/Exam";
import IdCard from "./student/IdCard";
// import { CoursePage } from "./student/CoursesComponent";
import ParentDashboard from "./parent/ParentDashboard";
// import Payment from "./parent/Payment";
import Attendance from "./parent/Attendance";
import Timetable from "./parent/Timetable";
import Result from "./parent/Result";
import Transcript from "./parent/components/Transcript";
import Messages from "./parent/Messages";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
        {/* teacher login */}
        <Route path="/login" element={<LoginPage />} />
        {/* end of teacher login */}
        {/* student login */}
        <Route path="/student-login" element={<StudentLogin />} />
        {/*end of  student login */}
        {/* Parent login */}
        <Route path="/parent-login" element={<ParentLogin />} />
        {/*end of  Parent login */}
        {/* Admin login */}
        <Route path="/Admin-login" element={<AdminLogin />} />
        {/*end of  Admin login */}

      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
        {/* student dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="IDcard" element={<IdCard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignment" element={<Assignments />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="transcript" element={<Grade />} />
          <Route path="courses" element={<CoursesComponent />} />
          <Route path="result" element={<Result />} />
          <Route path="exam" element={<Exam />} />
          <Route path="courses/:courseId" element={<CoursePage />} />
          {/* Parent dashboard */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        {/*end of  Parent dashboard */}
        {/* <Route path="/payments" element={<Payment />} /> */}
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/attendance" element={<Attendance/>} />
        <Route path="/result" element={<Result />} />
        <Route path="/transcript" element={<Transcript />} />
        <Route path="/messages" element={<Messages />} />
        {/* <Route path="/parent-dashboard" element={<ParentDashboard />} /> */}
        </Route>
        {/* end of student dashboard */}
        {/* course page */}
        {/* <Route path="/course-page" element={<CoursePage />} /> */}
        {/* end of course page */}
      </Routes>
    </>
  );
};

export default App;
