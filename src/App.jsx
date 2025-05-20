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
      </Routes>
    </>
  );
};

export default App;
