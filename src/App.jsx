import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Pages from "./features/parent/Pages/Pages";
import HomePage from "./pages/HomePage";
import SignupForm from "./features/auth/SignupForm";

// Login Pages
import LoginPage from "./features/teacher/LoginPage";
import StudentLogin from "./features/student/StudentLogin";
import ParentLogin from "./features/parent/Pages/ParentLogin";
import AdminLogin from "./features/admin/AdminLogin";

// Dashboards
import StudentDashboard from "./features/student/StudentDashboard";
import TeacherDashboard from "./features/teacher/TeacherDashboard";

// Student Dashboard Inner Routes
import Overview from "./features/student/Overview";
// import Messages from "./features/student/Messages";
import Attendance from "./features/student/Attendance";
import Assignments from "./features/student/Assignments";
import Timetable from "./features/student/Timetable";
import Grade from "./features/student/Grade";
import { CoursePage, CoursesComponent } from "./features/student/CoursesComponent";
import Result from "./features/student/Result";
import Exam from "./features/student/Exam";
import IdCard from "./features/student/IdCard";
import AdminDashboard from "./features/admin/AdminDashboard";
import Dashboard from "./features/admin/Dashboard";
import Users from "./features/admin/Users";
import NewUser from "./features/admin/NewUser";
import Report from "./features/admin/Report";

import SchoolAdmin from "./features/school-admin/SchoolAdmin";
import Error from "./pages/Error";
import Login from "./features/auth/Login";
import ForgotPassword from "./features/auth/ForgotPassword";
import VerifyOtp from "./features/auth/VerifyOtp";
import ResetPassword from "./features/auth/ResetPassword";
import RegisteredHomePage from "./features/landing/pages/registerHomepage/RegisteredHomePage";
import VerifySuccess from "./features/auth/confirm/VerifySuccess";
import VerifyFailure from "./features/auth/confirm/VerifyFailure";
import SelectUserType from "./features/auth/onboarding/SelectUserType";
import OrganizationDetails from "./features/auth/onboarding/OrganizationDetails";
import RequireAuth from "./features/auth/RequireAuth";
import PostLoginRedirect from "./features/auth/PostLoginRedirect";
import OrgGate from "./features/auth/OrgGate";
import RoleGate from "./features/auth/RoleGate";
import Forbidden from "./pages/Forbidden";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<RequireAuth><RegisteredHomePage /></RequireAuth>} />

        {/* teacher login */}
        <Route path="/new-login" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/verify-success" element={<VerifySuccess />} />
        <Route path="/verify-failure" element={<VerifyFailure />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post-login" element={<RequireAuth><PostLoginRedirect /></RequireAuth>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/select-user-type" element={<RequireAuth><SelectUserType /></RequireAuth>} />
        <Route path="/organization-details" element={<RequireAuth><OrganizationDetails /></RequireAuth>} />
        {/* student login */}
        <Route path="/student-login" element={<Navigate to="/login" replace />} />
        {/*end of  student login */}
        {/* parent login */}
        {/*end of  parent login */}
        {/* Parent login */}
        <Route path="/parent-login" element={<Navigate to="/login" replace />} />
        {/* Admin login */}
        <Route path="/Admin-login" element={<Navigate to="/login" replace />} />

        <Route path="/teacher-dashboard" element={<RequireAuth><RoleGate anyOf={['teacher']}><TeacherDashboard /></RoleGate></RequireAuth>} />

        {/* student dashboard with nested routes */}
        <Route path="/student-dashboard" element={<RequireAuth><RoleGate anyOf={['student']}><StudentDashboard /></RoleGate></RequireAuth>}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="IDcard" element={<IdCard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignment" element={<Assignments />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="transcript" element={<Grade />} />
          <Route path="courses" element={<CoursesComponent />} />
          <Route path="courses/:courseId" element={<CoursePage />} />
          <Route path="result" element={<Result />} />
          <Route path="exam" element={<Exam />} />
          {/* <Route path="messages" element={<Messages />} /> */}
          <Route path="*" element={<Error />} />
        </Route>
        {/* end of student dashboard */}
        {/* admin section */}
        <Route path="/admin-dashboard" element={<RequireAuth><RoleGate anyOf={['superadmin']}><AdminDashboard /></RoleGate></RequireAuth>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new-user" element={<NewUser />} />
          <Route path="reports" element={<Report />} />
          <Route path="*" element={<Error />} />
        </Route>
        {/*end of  admin section */}
        <Route path="/dashboard" element={<RequireAuth><RoleGate anyOf={['org_admin','admin']}><OrgGate><SchoolAdmin /></OrgGate></RoleGate></RequireAuth>} />

        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<Error />} />
      </Routes>
      <Pages />
    </>
  );
};

export default App;
