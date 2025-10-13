import { useState, useEffect, useRef } from "react";
import { getStudentDashboard } from "@/api/dashboardApi";
import Profile from "../auth/Profile";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";
import {
  Bell,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Clock,
  Search,
  User,
  Users,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Settings,
  LineChart,
  BarChart2,
  Percent,
  ChevronRight,
  Menu,
  LogOut,
} from "lucide-react";
import completed from "../../assets/completed.png";
import pro from "../../assets/progress (2).png";
import assignment from "../../assets/assignment.png";
import mask from "../../assets/Mask group.png";
import bell from "../../assets/bell.png";
import chemistry from "../../assets/chemistry.png";
import LiveCalendar from "./LiveCalendar";
import StudentsTable from "./StudentsTable";
const Overview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getStudentDashboard();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch student dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      const timer = setTimeout(() => {
        // Animate progress to attendance percentage
        let startProgress = 0;
        const targetProgress = dashboardData.attendance_stats?.percentage || 0;
        const interval = setInterval(() => {
          if (startProgress >= targetProgress) {
            clearInterval(interval);
          } else {
            startProgress += 1;
            setProgress(startProgress);
          }
        }, 20);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [dashboardData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, clear local auth and redirect
      clearAuth();
      navigate("/login");
    }
  };

  // Sample data
  const chartData = [35, 42, 55, 60, 48, 72];
  // const activityData = [
  //   { name: "Team Meeting", time: "9:00 AM", color: "blue" },
  //   { name: "Project Review", time: "11:30 AM", color: "amber" },
  //   { name: "Client Call", time: "2:15 PM", color: "rose" },
  //   { name: "Strategy Session", time: "4:00 PM", color: "purple" },
  // ];

  const taskData = [
    {
      name: "UX Research",
      completion: "80%",
      color: "blue",
      time: "13 Lessons - 3 hrs 15mins",
    },
    {
      name: "Wireframe Design",
      completion: "65%",
      color: "amber",
      time: "13 Lessons - 3 hrs 15mins",
    },
    {
      name: "Frontend Development",
      completion: "42%",
      color: "green",
      time: "13 Lessons - 3 hrs 15mins",
    },
  ];

  // const projectData = [
  //   { name: "Website Redesign", status: "In Progress", daysLeft: 7 },
  //   { name: "Mobile App Updates", status: "On Hold", daysLeft: 12 },
  //   { name: "Marketing Campaign", status: "Completed", daysLeft: 0 },
  // ];

  const teamData = [
    {
      name: "Alex Johnson",
      role: "UX Designer",
      avatar: "AJ",
      performance: 92,
    },
    { name: "Maria Garcia", role: "Developer", avatar: "MG", performance: 88 },
    {
      name: "David Kim",
      role: "Project Manager",
      avatar: "DK",
      performance: 95,
    },
    { name: "Sarah Wilson", role: "Marketing", avatar: "SW", performance: 85 },
    { name: "James Chen", role: "Developer", avatar: "JC", performance: 90 },
  ];

  const fadeInUp = (delay) => {
    return {
      animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
      opacity: 0,
      transform: "translateY(20px)",
    };
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6">


      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <Profile />
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-white p-4 rounded-xl shadow-sm h-[143px] "
          style={fadeInUp(0.2)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px]  text-[#3737df] font-normal ">
              {dashboardData?.quick_stats?.courses_completed || 0}
            </h2>
            <div className="p-2 bg-blue-100 rounded-lg">
              <img src={completed} alt="" />
            </div>
          </div>
          <p className="lg:text-[14px] font-medium">Courses Completed</p>
        </div>

        <div
          className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
          style={fadeInUp(0.2)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal ">
              {dashboardData?.quick_stats?.courses_in_progress || 0}
            </h2>
            <div className="p-2 bg-blue-100 rounded-lg">
              <img src={pro} alt="" />
            </div>
          </div>
          <p className="text-[12px]  font-medium">Courses Progress</p>
        </div>

        <div
          className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
          style={fadeInUp(0.2)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal ">
              {dashboardData?.quick_stats?.pending_assignments || 0}
            </h2>
            <div className="p-2 bg-blue-100 rounded-lg">
              <img src={assignment} alt="" />
            </div>
          </div>
          <p className="lg:text-[14px] font-medium">Pending Assignment</p>
        </div>
      </div>

      {/* Calendar and Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2" style={fadeInUp(0.6)}>
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="  text-[12px] sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium text-[rgba(51, 51, 51, 1)]">
                Courses In progress
              </h3>
              <p className="text-[12px] sm:text-[14px]  md:text-[16px] lg:text-[18px] text-[#484894] font-normal">
                View All
              </p>
            </div>

            {dashboardData?.courses_in_progress?.map((course, index) => (
              <div key={index} className="  mb-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-[5px] ">
                  <div>
                    <img src={completed} alt="" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <div className="">
                        <h4
                          className="lg:text-[14px] font-medium"
                          style={{ color: "rgba(51, 51, 51, 1)" }}
                        >
                          {course.name}
                        </h4>
                        <h4
                          className="text-[12px] font-normal "
                          style={{ color: "rgba(90, 100, 125, 1)" }}
                        >
                          {course.lessons_count} Lessons - {course.duration}
                        </h4>
                      </div>
                      <span className={`text-blue-600 text-sm`}>
                        {course.progress_percentage}%
                        <img src={mask} alt="" />
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${course.progress_percentage}%`,
                          animation: `growWidth 1s ease-out ${
                            0.7 + index * 0.2
                          }s forwards`,
                          transform: "scaleX(0)",
                          transformOrigin: "left",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                No courses in progress
              </div>
            )}
          </div>
          {/* notification */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] text-[#333]">
                Notification
              </h3>
              <button className="text-blue-600 text-[16px] font-normal flex items-center">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {/* notification1 */}
              <div
                className=" mb-7"
                style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              >
                <div className="flex items-center gap-[5px]">
                  <img src={bell} alt="" />
                  <div>
                    <p
                      className="lg:text-[14px] font-medium"
                      style={{ color: "rgba(51, 51, 51, 1)" }}
                    >
                      Assignment Due Soon
                    </p>
                    <p
                      className="text-[12px] font-normal "
                      style={{ color: "rgba(90, 100, 125, 1)" }}
                    >
                      Your Math assignment on ‘Linear Equations’ is due
                      tomorrow, Nov 19, 2024. Don’t forget to submit it on time!
                    </p>
                  </div>
                </div>
                {/* notification button */}
                <button
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium w-full rounded-[5px] h-[25px] lg:h-\[42px\] mt-[1rem] "
                  style={{
                    backgroundColor: "rgba(18, 40, 164, 1)",
                    color: "rgba(255, 255, 255, 1)",
                  }}
                >
                  View Assignment
                </button>
              </div>
              {/* end of  notification1 */}
              {/* notification1 */}
              <div
                className=""
                style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              >
                <div className="flex items-center gap-[5px]">
                  <img src={bell} alt="" />
                  <div>
                    <p
                      className="lg:text-[14px] font-medium"
                      style={{ color: "rgba(51, 51, 51, 1)" }}
                    >
                      Assignment Due Soon
                    </p>
                    <p
                      className="text-[12px] font-normal "
                      style={{ color: "rgba(90, 100, 125, 1)" }}
                    >
                      Your Math assignment on ‘Linear Equations’ is due
                      tomorrow, Nov 19, 2024. Don’t forget to submit it on time!
                    </p>
                  </div>
                </div>
                {/* notification button */}
                <button
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium w-full rounded-[5px] h-[25px] lg:h-\[42px\] mt-[1rem] "
                  style={{
                    backgroundColor: "rgba(18, 40, 164, 1)",
                    color: "rgba(255, 255, 255, 1)",
                  }}
                >
                  View Assignment
                </button>
              </div>
              {/* end of  notification1 */}
              {/* notification1 */}
              <div
                className=""
                style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              >
                <div className="flex items-center gap-[5px]">
                  <img src={bell} alt="" />
                  <div>
                    <p
                      className="lg:text-[14px] font-medium"
                      style={{ color: "rgba(51, 51, 51, 1)" }}
                    >
                      Assignment Due Soon
                    </p>
                    <p
                      className="text-[12px] font-normal "
                      style={{ color: "rgba(90, 100, 125, 1)" }}
                    >
                      Your Math assignment on ‘Linear Equations’ is due
                      tomorrow, Nov 19, 2024. Don’t forget to submit it on time!
                    </p>
                  </div>
                </div>
                {/* notification button */}
                <button
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium w-full rounded-[5px] h-[25px] lg:h-\[42px\] mt-[1rem] "
                  style={{
                    backgroundColor: "rgba(18, 40, 164, 1)",
                    color: "rgba(255, 255, 255, 1)",
                  }}
                >
                  View Assignment
                </button>
              </div>
              {/* end of  notification1 */}
            </div>
          </div>
          {/* end of notification */}
        </div>
        <div className="col-span-1" style={fadeInUp(0.5)}>
          {/* calender */}

          <LiveCalendar />
          {/* end of calender */}

          {/* class */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] w-full h-auto">
            <div className="flex flex-col lg:flex-row items-center gap-[2rem] w-fit">
              <img src={chemistry} alt="" />
              <div>
                <p
                  className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium "
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Chemistry Practical
                </p>
                <p
                  className="lg:text-[14px] font-normal "
                  style={{ color: "rgba(105, 105, 105, 1)" }}
                >
                  October 22nd - 26th .10:00 am
                </p>
              </div>
            </div>
          </div>
          {/* end of class */}

          {/* class */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] w-full h-auto">
            <div className="flex flex-col lg:flex-row items-center gap-[2rem] w-fit">
              <img src={chemistry} alt="" />
              <div>
                <p
                  className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium "
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Chemistry Practical
                </p>
                <p
                  className="lg:text-[14px] font-normal "
                  style={{ color: "rgba(105, 105, 105, 1)" }}
                >
                  October 22nd - 26th .10:00 am
                </p>
              </div>
            </div>
          </div>
          {/* end of class */}

          {/* class */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] w-full h-auto">
            <div className="flex flex-col lg:flex-row items-center gap-[2rem] w-fit">
              <img src={chemistry} alt="" />
              <div>
                <p
                  className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium "
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Chemistry Practical
                </p>
                <p
                  className="lg:text-[14px] font-normal "
                  style={{ color: "rgba(105, 105, 105, 1)" }}
                >
                  October 22nd - 26th .10:00 am
                </p>
              </div>
            </div>
          </div>
          {/* end of class */}

          {/* certification */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] w-full">
            <div className="flex items-center justify-between">
              <p className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium">
                Certification
              </p>
              <p
                className="text-[12px] font-normal"
                style={{ color: "rgba(18, 40, 164, 1)" }}
              >
                View
              </p>
            </div>
            {/* class */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] w-full h-auto">
              <div className="flex flex-col lg:flex-row items-center gap-[2rem] w-fit">
                <img src={chemistry} alt="" />
                <div>
                  <p
                    className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium "
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Chemistry Practical
                  </p>
                  <p
                    className="lg:text-[14px] font-normal "
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    October 22nd - 26th .10:00 am
                  </p>
                </div>
              </div>
            </div>
            {/* end of class */}
            {/* class */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] w-full h-auto">
              <div className="flex flex-col lg:flex-row items-center gap-[2rem] w-fit">
                <img src={chemistry} alt="" />
                <div>
                  <p
                    className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium "
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Chemistry Practical
                  </p>
                  <p
                    className="lg:text-[14px] font-normal "
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    October 22nd - 26th .10:00 am
                  </p>
                </div>
              </div>
            </div>
            {/* end of class */}
            {/* class */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] w-full h-auto">
              <div className="flex flex-col lg:flex-row items-center gap-[2rem] w-fit">
                <img src={chemistry} alt="" />
                <div>
                  <p
                    className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium "
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Chemistry Practical
                  </p>
                  <p
                    className="lg:text-[14px] font-normal "
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    October 22nd - 26th .10:00 am
                  </p>
                </div>
              </div>
            </div>
            {/* end of class */}
          </div>
          {/* certification */}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div
          className="bg-white p-4 rounded-xl shadow-sm"
          style={fadeInUp(0.7)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className=" text-[12px] lg:text-[16px] font-semibold text-gray-800">
              Performance
            </h3>
            <button className=" text-[12px] lg:text-[16px] text-gray-500 flex items-center">
              This Week <ChevronDown size={14} />
            </button>
          </div>

          <div className="relative pt-4">
            <div className="flex justify-center items-center flex-col mb-3">
              <div className="relative h-32 w-32">
                <div className="h-32 w-32 rounded-full border-8 border-gray-100"></div>
                <div
                  className="h-32 w-32 rounded-full border-8 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent absolute top-0 left-0 transform -rotate-45"
                  style={{
                    transform: `rotate(${progress * 3.6 - 45}deg)`,
                    transition: "transform 1s ease-out",
                  }}
                ></div>
                <div className="absolute top-0 left-0 h-32 w-32 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold">{progress}%</span>
                    <p className="text-xs text-gray-500">Completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-span-2 bg-white p-4 rounded-xl shadow-sm"
          style={fadeInUp(0.8)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className=" text-[12px] lg:text-[16px] font-semibold text-gray-800">
              Weekly Progress
            </h3>
            <button className="text-[12px] lg:text-[16px] text-gray-500 flex items-center">
              Last 7 Days <ChevronDown size={14} />
            </button>
          </div>

          <div className="h-52" ref={chartRef}>
            <div className="flex h-40 items-end justify-between gap-2">
              {chartData.map((value, index) => (
                <div
                  key={index}
                  className="relative flex-1 flex flex-col items-center"
                >
                  <div
                    className="bg-green-500 w-full rounded-t-md"
                    style={{
                      height: `${value}%`,
                      maxHeight: "100%",
                      animation: `growHeight 1s ease-out ${
                        1 + index * 0.1
                      }s forwards`,
                      transform: "scaleY(0)",
                      transformOrigin: "bottom",
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    Day {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Section */}
      {dashboardData?.transcript && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6" style={fadeInUp(0.9)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[18px] lg:text-[20px] font-semibold text-gray-800">
              Academic Transcript
            </h3>
            <div className="text-sm text-gray-500">
              Last updated: {dashboardData.transcript.last_updated}
            </div>
          </div>

          {/* GPA Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData.transcript.overall_gpa}
              </div>
              <div className="text-sm text-gray-600">Overall GPA</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {dashboardData.transcript.total_subjects}
              </div>
              <div className="text-sm text-gray-600">Total Subjects</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {dashboardData.transcript.recent_grades?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Recent Grades</div>
            </div>
          </div>

          {/* Subject Averages */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Subject Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.transcript.subject_averages?.map((subject, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-800">{subject.subject}</h5>
                      <p className="text-sm text-gray-600">{subject.academic_year}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {subject.average_score}
                      </div>
                      <div className="text-xs text-gray-500">Average</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{subject.total_grades} grades</span>
                    <span>Latest: {subject.latest_grade}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(subject.average_score / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Recent Grades</h4>
            <div className="space-y-3">
              {dashboardData.transcript.recent_grades?.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      grade.grade === 'A' ? 'bg-green-500' :
                      grade.grade === 'B' ? 'bg-blue-500' :
                      grade.grade === 'C' ? 'bg-yellow-500' :
                      grade.grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      {grade.grade}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{grade.subject}</div>
                      <div className="text-sm text-gray-600">
                        {grade.teacher} • {grade.type} • {grade.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">{grade.score}</div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Transcript Button */}
          {dashboardData.transcript.can_generate_transcript && (
            <div className="mt-6 text-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Generate Full Transcript
              </button>
            </div>
          )}
        </div>
      )}

      {/* Team Performance */}
      <StudentsTable />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes growWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes growHeight {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;
