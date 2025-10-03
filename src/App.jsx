import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { OrganizationProvider, useOrganization } from "@/context/OrganizationContext";
import Loader from "@/components/Loader";

// Auth Components
import Login from "@/features/auth/Login";
import SignupForm from "@/features/auth/SignupForm";
import RequireAuth from "@/features/auth/RequireAuth";
import RedirectIfAuthenticated from "@/features/auth/RedirectIfAuthenticated";
import PostLoginRedirect from "@/features/auth/PostLoginRedirect";
import OrgGate from "@/features/auth/OrgGate";
import RoleGate from "@/features/auth/RoleGate";
import ForgotPassword from "@/features/auth/ForgotPassword";
import VerifyOtp from "@/features/auth/VerifyOtp";
import ResetPassword from "@/features/auth/ResetPassword";
import VerifySuccess from "@/features/auth/confirm/VerifySuccess";
import VerifyFailure from "@/features/auth/confirm/VerifyFailure";
import SelectUserType from "@/features/auth/onboarding/SelectUserType";
import OrganizationDetails from "@/features/auth/onboarding/OrganizationDetails";

// Dashboard Components
import IdCard from "@/features/student/IdCard";
import AdminDashboard from "@/features/admin/AdminDashboard";
import Dashboard from "@/features/admin/Dashboard";
import Users from "@/features/admin/Users";
import NewUser from "@/features/admin/NewUser";
import Report from "@/features/admin/Report";
import SchoolAdmin from "@/features/school-admin/SchoolAdmin";
import TeacherDashboard from "@/features/teacher/TeacherDashboard";
import StudentDashboard from "@/features/student/StudentDashboard";

// Page Components
import HomePage from "@/pages/HomePage";
import RegisteredHomePage from "@/features/landing/pages/registerHomepage/RegisteredHomePage";
import Error from "@/pages/Error";
import Forbidden from "@/pages/Forbidden";

// Student Dashboard Components
import Overview from "@/features/student/Overview";
import Attendance from "@/features/student/Attendance";
import Assignments from "@/features/student/Assignments";
import Timetable from "@/features/student/Timetable";
import Grade from "@/features/student/Grade";
import { CoursesComponent } from "@/features/student/CoursesComponent";
import CoursePage from "@/features/student/CoursePage";
import Result from "@/features/student/Result";
import Exam from "@/features/student/Exam";

// Communication Features
import { ForumList, ForumDetail, VideoCallList, VideoCallRoom } from "@/features/communication";

// Analytics Features
import LearningAnalytics from "@/features/analytics/components/LearningAnalytics";
import TranscriptViewer from "@/features/analytics/components/TranscriptViewer";
import XAPIStatementViewer from "@/features/analytics/components/XAPIStatementViewer";

// Other Features
import BirthdayDashboard from "@/features/birthday/BirthdayDashboard";
import VirtualLearningDashboard from "@/features/virtual-learning/VirtualLearningDashboard";
import ParentDashboard from "@/features/parent/Pages/ParentDashboard";
import IndividualLearnerPersonalDashboard from "@/features/individual-learners/components/IndividualLearnerPersonalDashboard";

// Pages Component (assuming this exists)
/* Removed import of non-existent Pages component to fix import error */
// import Pages from "@/components/Pages";

const App = () => {
  return (
    <OrganizationProvider>
      <AppContent />
    </OrganizationProvider>
  );
};

const AppContent = () => {
  const { loading } = useOrganization();

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<RegisteredHomePage />} />
      {/* Authentication Routes */}
      <Route path="/new-login" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<RedirectIfAuthenticated><SignupForm /></RedirectIfAuthenticated>} />
      <Route path="/verify-success" element={<VerifySuccess />} />
      <Route path="/verify-failure" element={<VerifyFailure />} />
      <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
      <Route path="/post-login" element={<PostLoginRedirect />} />
      <Route path="/forgot-password" element={<RedirectIfAuthenticated><ForgotPassword /></RedirectIfAuthenticated>} />
      <Route path="/verify-otp" element={<RedirectIfAuthenticated><VerifyOtp /></RedirectIfAuthenticated>} />
      <Route path="/reset-password" element={<RedirectIfAuthenticated><ResetPassword /></RedirectIfAuthenticated>} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/select-user-type" element={<RedirectIfAuthenticated><SelectUserType /></RedirectIfAuthenticated>} />
      <Route path="/organization-details" element={<RedirectIfAuthenticated><OrganizationDetails /></RedirectIfAuthenticated>} />
      {/* Legacy Login Routes */}
      <Route path="/student-login" element={<Navigate to="/login" replace />} />
      <Route path="/parent-login" element={<Navigate to="/login" replace />} />
      <Route path="/Admin-login" element={<Navigate to="/login" replace />} />
      {/* Protected Routes - Require Authentication */}
      <Route path="/teacher-dashboard" element={<RequireAuth><TeacherDashboard /></RequireAuth>} />
      {/* Student Dashboard with nested routes */}
      <Route path="/student-dashboard" element={<RequireAuth><StudentDashboard /></RequireAuth>}>
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
        <Route path="*" element={<Error />} />
      </Route>
      {/* Admin Dashboard */}
      <Route path="/admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new-user" element={<NewUser />} />
        <Route path="reports" element={<Report />} />
        <Route path="*" element={<Error />} />
      </Route>
      {/* School Admin Dashboard */}
      <Route path="/dashboard" element={<RequireAuth><OrgGate><SchoolAdmin /></OrgGate></RequireAuth>} />
      {/* Parent Dashboard */}
      <Route path="/parent-dashboard" element={<RequireAuth><ParentDashboard /></RequireAuth>} />
      {/* Individual Learner Dashboard */}
      <Route path="/individual-learner-dashboard" element={<RequireAuth><IndividualLearnerPersonalDashboard /></RequireAuth>} />
      {/* New Features - Test Routes */}
      <Route path="/birthday-dashboard" element={<RequireAuth><BirthdayDashboard /></RequireAuth>} />
      <Route path="/learning-dashboard" element={<RequireAuth><VirtualLearningDashboard /></RequireAuth>} />
      {/* Communication Features */}
      <Route path="/forums" element={<RequireAuth><ForumList /></RequireAuth>} />
      <Route path="/forums/:forumId" element={<RequireAuth><ForumDetail /></RequireAuth>} />
      <Route path="/video-calls" element={<RequireAuth><VideoCallList /></RequireAuth>} />
      <Route path="/video-calls/:callId" element={<RequireAuth><VideoCallRoom /></RequireAuth>} />
      {/* Analytics Features */}
      <Route path="/analytics" element={<RequireAuth><LearningAnalytics /></RequireAuth>} />
      <Route path="/transcripts" element={<RequireAuth><TranscriptViewer /></RequireAuth>} />
      <Route path="/xapi-statements" element={<RequireAuth><XAPIStatementViewer /></RequireAuth>} />
      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default App;
