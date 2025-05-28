import React from "react";
import HomePage from "./homepage/HomePage";
import { Route, Routes } from "react-router-dom";
import SignupForm from "./signup/SignupForm";
import LoginPage from "./teacher/LoginPage";
import StudentLogin from "./student/StudentLogin";
import ParentLogin from "./parent/ParentLogin";
import AdminLogin from "./admin/AdminLogin";
import StudentDashboard from "./student/StudentDashboard";
import ParentDashboard from "./parent/ParentDashboard";
// import Payment from "./parent/Payment";
import Attendance from "./parent/Attendance";
import Timetable from "./parent/Timetable";
import Result from "./parent/Result";
import Transcript from "./parent/components/Transcript";

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
        {/* student dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        {/* end of student dashboard */}
        {/* Parent dashboard */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        {/*end of  Parent dashboard */}
        {/* <Route path="/payments" element={<Payment />} /> */}
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/attendance" element={<Attendance/>} />
        <Route path="/result" element={<Result />} />
        <Route path="/transcript" element={<Transcript />} />
        {/* <Route path="/messages" element={<Messages />} /> */}
        {/* <Route path="/parent-dashboard" element={<ParentDashboard />} /> */}
        


      </Routes>
    </>
  );
};

export default App;
