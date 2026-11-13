import Payment from "./ParentPayment";
import Attendance from "./ParentAttendance";
import Timetable from "./ParentTimetable";
import ParentResult from "./ParentResult";
import Transcript from "./ParentTranscript";
import DirectMessages from "@/features/communication/DirectMessages";
import ParentDashboard from "./ParentDashboard";
import PaymentProcess from "./PaymentProcess";
import { Route, Routes } from "react-router-dom";
import SignupForm from "../../auth/SignupForm";
// import Login from "../../signup/Login";

function Pages() {
  return (
    <Routes>
      {/* <Route path="/newUser" element={<Login />} /> */}
      {/* <Route path="/signup" element={<SignupForm />} className="hide" /> */}
      {/* <Route path="/parent-signup" element={<ParentSignup />} /> */}
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/parent-payments" element={<Payment />} />
      <Route path="/parent-timetable" element={<Timetable />} />
      <Route path="/parent-attendance" element={<Attendance />} />
      <Route path="/parent-attendance/:id" element={<Attendance />} />
      <Route path="/parent-results" element={<ParentResult />} />
      <Route path="/parent-transcript" element={<Transcript />} />
      <Route path="/parent-messages" element={<DirectMessages />} />
      <Route path="/payment-process" element={<PaymentProcess />} />
    </Routes>
  );
}

export default Pages;
