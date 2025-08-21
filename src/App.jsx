import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Pages from "./parent/Pages/Pages";
import HomePage from "./homepage/HomePage";
import SignupForm from "./auth/SignupForm";

// Login Pages
import LoginPage from "./teacher/LoginPage";
import StudentLogin from "./student/StudentLogin";
import ParentLogin from "./parent/Pages/ParentLogin";
import AdminLogin from "./admin/AdminLogin";

// Dashboards
import StudentDashboard from "./student/StudentDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";

// Student Dashboard Inner Routes
import Overview from "./student/Overview";
// import Messages from "./student/Messages";
import Attendance from "./student/Attendance";
import Assignments from "./student/Assignments";
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

import SchoolAdmin from "./School-Admin/SchoolAdmin";
import Error from "./Error";
import Login from "./auth/login";
import ForgotPassword from "./auth/ForgotPassword";
import VerifyOtp from "./auth/VerifyOtp";
import ResetPassword from "./auth/ResetPassword";
import RegisteredHomePage from "./registerHomepage/RegisteredHomePage";
 // import LoginNormal from "./signup/LoginNormal";
import VerifySuccess from "./confirm/VerifySuccess";
import VerifyFailure from "./confirm/VerifyFailure";
import SelectUserType from "./onboarding/SelectUserType";
import OrganizationDetails from "./onboarding/OrganizationDetails";
import RequireAuth from "./auth/RequireAuth";
import PostLoginRedirect from "./auth/PostLoginRedirect";
import OrgGate from "./auth/OrgGate";
import RoleGate from "./auth/RoleGate";
import Forbidden from "./errors/Forbidden";

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
        <Route path="/parent-login" element={<Navigate to="/login" replace />} />
        {/*end of  parent login */}
        {/* Parent login */}
        <Route path="/parent-login" element={<Navigate to="/login" replace />} />
        {/* Admin login */}
        <Route path="/Admin-login" element={<Navigate to="/login" replace />} />

        <Route path="/teacher-dashboard" element={<RequireAuth><RoleGate anyOf={['teacher']}><TeacherDashboard /></RoleGate></RequireAuth>} />
        {/* student dashboard */}
        <Route path="/student-dashboard" element={<RequireAuth><RoleGate anyOf={['student']}><StudentDashboard /></RoleGate></RequireAuth>} />
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
        {/* end of student dashboard */}
        {/* course page */}
        {/* <Route path="/course-page" element={<CoursePage />} /> */}
        {/* end of course page */}
        {/* student dashboard */}
        <Route path="/student-dashboard" element={<RequireAuth><StudentDashboard /></RequireAuth>}>
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
        <Route path="/admin-dashboard" element={<RequireAuth><RoleGate anyOf={['superadmin']}><AdminDashboard /></RoleGate></RequireAuth>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new-user" element={<NewUser />} />
          <Route path="reports" element={<Report />} />
          <Route path="*" element={<Error />} />
        </Route>
        {/*end of  admin section */}
        <Route path="/dashboard" element={<RequireAuth><RoleGate anyOf={['org_admin','admin']}><OrgGate><SchoolAdmin /></OrgGate></RoleGate></RequireAuth>} />
      </Routes>
      <Pages />
    </>
  );
};

export default App;
