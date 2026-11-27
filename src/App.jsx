import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { OrganizationProvider, useOrganization } from "@/context/OrganizationContext";
import Loader from "@/components/Loader";

// Auth Components
import Login from "@/features/auth/Login";
import SignupForm from "@/features/auth/SignupForm";
import RegisterSchool from "@/features/auth/RegisterSchool";
import SchoolSetup from "@/features/auth/SchoolSetup";
import JoinSchool from "@/features/auth/JoinSchool";
import RequireAuth from "@/features/auth/RequireAuth";
import RedirectIfAuthenticated from "@/features/auth/RedirectIfAuthenticated";
import PostLoginRedirect from "@/features/auth/PostLoginRedirect";
import OrgGate from "@/features/auth/OrgGate";
import RoleGate from "@/features/auth/RoleGate";
import PendingApprovalGate from "@/features/auth/PendingApprovalGate";
import ForgotPassword from "@/features/auth/ForgotPassword";
import VerifyOtp from "@/features/auth/VerifyOtp";
import ResetPassword from "@/features/auth/ResetPassword";
import VerifySuccess from "@/features/auth/confirm/VerifySuccess";
import VerifyFailure from "@/features/auth/confirm/VerifyFailure";
import SelectUserType from "@/features/auth/onboarding/SelectUserType";
import OrganizationDetails from "@/features/auth/onboarding/OrganizationDetails";
import Profile from "@/features/auth/Profile";
import AdminLogin from "@/features/admin/AdminLogin";

// Dashboard Components
import AdminDashboard from "@/features/admin/AdminDashboard";
import Dashboard from "@/features/admin/Dashboard";
import Users from "@/features/admin/Users";
import NewUser from "@/features/admin/NewUser";
import Reports from "@/features/admin/Reports";
import AdminSettings from "@/features/admin/Settings";
import OrganizationDetail from "@/features/admin/OrganizationDetail";
import SuperAdminGate from "@/features/auth/SuperAdminGate";
import OrgAdminGate from "@/features/auth/OrgAdminGate";
import Organizations from "@/features/admin/Organizations";
import EmailLogs from "@/features/admin/EmailLogs";
import Subscriptions from "@/features/admin/Subscriptions";
import SchoolAdmin from "@/features/school-admin/SchoolAdmin";
import TeacherDashboard from "@/features/teacher/TeacherDashboard";
import StudentDashboard from "@/features/student/StudentDashboard";
import OrganizationDashboard from "@/features/organization/OrganizationDashboard";
import OrganizationOverview from "@/features/organization/pages/OrganizationOverview";
import OrganizationStudents from "@/features/organization/pages/OrganizationStudents";
import OrganizationTeachers from "@/features/organization/pages/OrganizationTeachers";
import OrganizationClasses from "@/features/organization/pages/OrganizationClasses";
import OrganizationExams from "@/features/organization/pages/OrganizationExams";
import OrganizationAnalytics from "@/features/organization/pages/OrganizationAnalytics";
import OrganizationReports from "@/features/organization/pages/OrganizationReports";
import OrganizationAlerts from "@/features/organization/pages/OrganizationAlerts";
import OrganizationAnnouncements from "@/features/organization/pages/OrganizationAnnouncements";
import OrganizationOperations from "@/features/organization/pages/OrganizationOperations";
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
import OnlineExamScores from "@/features/student/OnlineExamScores";
import { CoursesComponent } from "@/features/student/CoursesComponent";
import CoursePage from "@/features/student/CoursePage";
import Result from "@/features/student/Result";
import TeacherResults from "@/features/results/TeacherResults";
import GradingPolicyPage from "@/features/results/GradingPolicyPage";
import SubscriptionBanner from "@/features/billing/SubscriptionBanner";
import BillingPage from "@/features/billing/BillingPage";
import PaymentCallback from "@/features/billing/PaymentCallback";
import PricingPage from "@/features/billing/PricingPage";
import SchoolFeesPage from "@/features/billing/SchoolFeesPage";
import MyFees from "@/features/billing/MyFees";
import Exam from "@/features/student/Exam";
import StudentCbt from "@/features/student/StudentCbt";
import DirectMessages from "@/features/communication/DirectMessages";
import StudentMessages from "@/features/student/Messages";

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
import { ParentListContent } from "./features/school-admin/ParentListContent";
import { TeacherListContent } from "./features/school-admin/TeacherListContent";
import HomePageRefresh from "./pages/HomePageRefresh";
// import { ParentListContentNew } from "./features/school-admin/ParentListContentNew";

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
    <>
    <SubscriptionBanner />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/payments/callback" element={<PaymentCallback />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/register/school" element={<RegisterSchool />} />
      <Route path="/register/school/setup" element={<SchoolSetup />} />
      {/* <Route path="/" element={<HomePageRefresh />} /> */}
      <Route path="/home" element={<RegisteredHomePage />} />
      {/* Public authentication routes */}
      <Route path="/new-login" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/join" element={<JoinSchool />} />
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
      {/* Legacy Login Routes */}
      <Route path="/student-login" element={<Navigate to="/login" replace />} />
      <Route path="/parent-login" element={<Navigate to="/login" replace />} />
      <Route path="/Admin-login" element={<AdminLogin />} />
      {/* Authenticated account and dashboard routes */}

      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

      <Route path="/teacher-dashboard" element={<RequireAuth><PendingApprovalGate role="teacher"><TeacherDashboard /></PendingApprovalGate></RequireAuth>} />

      {/* Student Dashboard with nested routes */}
      <Route path="/student-dashboard" element={<RequireAuth><PendingApprovalGate role="student"><StudentDashboard /></PendingApprovalGate></RequireAuth>}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        {/* The ID card lives on the profile page now. */}
        <Route path="IDcard" element={<Navigate to="/profile" replace />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignment" element={<Assignments />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="transcript" element={<OnlineExamScores />} />
        <Route path="courses" element={<CoursesComponent />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        <Route path="result" element={<Result />} />
        <Route path="fees" element={<MyFees />} />
        <Route path="exam" element={<Exam />} />
        <Route path="cbt" element={<StudentCbt />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="*" element={<Error />} />
      </Route>
      
      {/* Admin Dashboard */}
      <Route path="/admin-dashboard" element={<RequireAuth><SuperAdminGate><AdminDashboard /></SuperAdminGate></RequireAuth>}>
        <Route index element={<Navigate to="/admin-dashboard/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new-user" element={<NewUser />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="organizations/:organizationId" element={<OrganizationDetail />} />
        <Route path="emails" element={<EmailLogs />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Old sidebar links: analytics now lives on the dashboard. */}
        <Route path="analytics" element={<Navigate to="/admin-dashboard/dashboard" replace />} />
        <Route path="*" element={<Error />} />
      </Route>
      {/* School Admin Dashboard */}
      <Route path="/dashboard" element={<RequireAuth><SchoolAdmin /></RequireAuth>} />
      {/* Organization Dashboard */}
      <Route path="/organization-dashboard" element={<RequireAuth><OrgAdminGate><OrganizationDashboard /></OrgAdminGate></RequireAuth>}>
        <Route index element={<Navigate to="/organization-dashboard/overview" replace />} />
        <Route path="overview" element={<OrganizationOverview />} />
        <Route path="settings" element={<Navigate to="/organization-dashboard/profile" replace />} />
        <Route path="students" element={<OrganizationStudents />} />
        <Route path="teachers" element={<OrganizationTeachers />} />
        {/* Pending sign-ups live under the Pending pill now. */}
        <Route path="pending-teachers" element={<Navigate to="/organization-dashboard/teachers?status=pending" replace />} />
        <Route path="pending-students" element={<Navigate to="/organization-dashboard/students?status=pending" replace />} />
        <Route path="classes" element={<OrganizationClasses />} />
        <Route path="exams" element={<OrganizationExams />} />
        <Route path="results" element={<TeacherResults forSchoolAdmin />} />
        <Route path="grading" element={<GradingPolicyPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="fees" element={<SchoolFeesPage />} />
        <Route path="profile" element={<Profile embedded />} />
        <Route path="analytics" element={<OrganizationAnalytics />} />
        <Route path="reports" element={<OrganizationReports />} />
        <Route path="alerts" element={<OrganizationAlerts />} />
        <Route path="announcements" element={<OrganizationAnnouncements />} />
        <Route path="operations" element={<OrganizationOperations />} />
        <Route path="messages" element={<DirectMessages />} />
      </Route>
      {/* Parent Dashboard */}
      <Route path="/parent-dashboard" element={<RequireAuth><PendingApprovalGate role="parent"><ParentDashboard /></PendingApprovalGate></RequireAuth>} />
      {/* Parent Attendance */}
      <Route path="/parent-attendance" element={<RequireAuth><PendingApprovalGate role="parent"><ParentAttendance /></PendingApprovalGate></RequireAuth>} />
      <Route path="/parent-attendance/:id" element={<RequireAuth><PendingApprovalGate role="parent"><ParentAttendance /></PendingApprovalGate></RequireAuth>} />
      {/* Individual Learner Dashboard */}
      <Route path="/individual-dashboard" element={<RequireAuth><IndividualLearnerPersonalDashboard /></RequireAuth>} />
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

      {/* <Route path="/parent-list" element={<ParentListContentNew/>} /> */}
      {/* <Route path="/teacher-list" element={<TeacherListContentNew/>} /> */}

      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<Error />} />
    </Routes>
    </>
  );
};

export default App;
