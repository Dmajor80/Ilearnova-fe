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
import Profile from "@/features/auth/Profile";

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
import OrganizationDashboard from "@/features/organization/OrganizationDashboard";
/* Removed duplicate imports of ParentDashboard and IndividualLearnerPersonalDashboard */
import ParentDashboard from "@/features/parent/Pages/ParentDashboard";
import ParentAttendance from "@/features/parent/Pages/ParentAttendance";
import IndividualLearnerPersonalDashboard from "@/features/individual-learners/components/IndividualLearnerPersonalDashboard";

// Remove duplicate imports of ParentDashboard and IndividualLearnerPersonalDashboard if any

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
/* Removed imports of non-existent components to fix errors */
import BirthdayDashboard from "@/features/birthday/BirthdayDashboard"; // Remove or comment out if file does not exist
import VirtualLearningDashboard from "@/features/virtual-learning/VirtualLearningDashboard"; // Remove or comment out if file does not exist
// import ParentDashboard from "@/features/parent/Pages/ParentDashboard"; // Removed due to missing file
// import IndividualLearnerPersonalDashboard from "@/features/individual-learners/components/IndividualLearnerPersonalDashboard"; // Removed due to missing file
// import ParentDashboard from "@/features/parent/Pages/ParentDashboard";
// import IndividualLearnerPersonalDashboard from "@/features/individual-learners/components/IndividualLearnerPersonalDashboard";

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
      {/* Authentication Routes - Temporarily disabled for development */}
      <Route path="/new-login" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/verify-success" element={<VerifySuccess />} />
      <Route path="/verify-failure" element={<VerifyFailure />} />
      <Route path="/login" element={<Login />} />
      <Route path="/post-login" element={<PostLoginRedirect />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/select-user-type" element={<SelectUserType />} />
      <Route path="/organization-details" element={<OrganizationDetails />} />
      {/* Legacy Login Routes */}
      <Route path="/student-login" element={<Navigate to="/login" replace />} />
      <Route path="/parent-login" element={<Navigate to="/login" replace />} />
      <Route path="/Admin-login" element={<Navigate to="/login" replace />} />
      {/* Dashboard Routes - Authentication temporarily disabled for development */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      {/* Student Dashboard with nested routes */}
      <Route path="/student-dashboard" element={<StudentDashboard />}>
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
      <Route path="/admin-dashboard" element={<AdminDashboard />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new-user" element={<NewUser />} />
        <Route path="reports" element={<Report />} />
        <Route path="*" element={<Error />} />
      </Route>
      {/* School Admin Dashboard - Authentication temporarily disabled */}
      <Route path="/dashboard" element={<SchoolAdmin />} />
      {/* Organization Dashboard - Authentication temporarily disabled */}
      <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
      {/* Parent Dashboard */}
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      {/* Parent Attendance */}
      <Route path="/parent-attendance" element={<ParentAttendance />} />
      <Route path="/parent-attendance/:id" element={<ParentAttendance />} />
      {/* Individual Learner Dashboard */}
      <Route path="/individual-learner-dashboard" element={<IndividualLearnerPersonalDashboard />} />
      {/* New Features - Test Routes */}
      <Route path="/birthday-dashboard" element={<BirthdayDashboard />} />
      <Route path="/learning-dashboard" element={<VirtualLearningDashboard />} />
      {/* Communication Features */}
      <Route path="/forums" element={<ForumList />} />
      <Route path="/forums/:forumId" element={<ForumDetail />} />
      <Route path="/video-calls" element={<VideoCallList />} />
      <Route path="/video-calls/:callId" element={<VideoCallRoom />} />
      {/* Analytics Features */}
      <Route path="/analytics" element={<LearningAnalytics />} />
      <Route path="/transcripts" element={<TranscriptViewer />} />
      <Route path="/xapi-statements" element={<XAPIStatementViewer />} />
      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default App;
