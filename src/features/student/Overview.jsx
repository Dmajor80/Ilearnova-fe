import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useStudentOverview, { summariseCourses } from "./useStudentOverview";
import { ListSkeleton, Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";
import Profile from "../auth/Profile";
import { getStoredUser } from "@/api/auth";
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
import LiveCalendar from "./LiveCalendar";
import { useStudentAnnouncements, useStudentAssignments } from "@/hooks/student";
const Overview = () => {
  const studentAnnouncements = useStudentAnnouncements();
  const studentAssignments = useStudentAssignments();
  const navigate = useNavigate();
  const { courses, attendance, transcript } = useStudentOverview();
  const firstName = getStoredUser()?.first_name;
  const courseSummary = summariseCourses(courses.data || []);
  const attendancePercent = Math.round(attendance.data?.summary?.attendance_percentage || 0);
  const latestTerm = transcript.data?.terms?.[0];
  const [progress, setProgress] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!attendance.loading) {
      const timer = setTimeout(() => {
        // Animate progress to attendance percentage
        let startProgress = 0;
        const targetProgress = attendancePercent;
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
  }, [attendance.loading, attendancePercent]);

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

  // const activityData = [
  //   { name: "Team Meeting", time: "9:00 AM", color: "blue" },
  //   { name: "Project Review", time: "11:30 AM", color: "amber" },
  //   { name: "Client Call", time: "2:15 PM", color: "rose" },
  //   { name: "Strategy Session", time: "4:00 PM", color: "purple" },
  // ];

  // const projectData = [
  //   { name: "Website Redesign", status: "In Progress", daysLeft: 7 },
  //   { name: "Mobile App Updates", status: "On Hold", daysLeft: 12 },
  //   { name: "Marketing Campaign", status: "Completed", daysLeft: 0 },
  // ];

  const fadeInUp = (delay) => {
    return {
      animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
      opacity: 0,
      transform: "translateY(20px)",
    };
  };

  return (
    <div className="w-full min-w-0 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:p-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 md:p-8 mb-6 md:mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="break-words text-2xl md:text-4xl font-bold mb-2">Welcome back{firstName ? `, ${firstName}` : ""}! 👋</h2>
            <p className="text-blue-100 text-base md:text-lg">Ready to continue your learning journey? Let's explore what's new today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      {(courses.error || attendance.error || transcript.error) && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">
          Part of your dashboard could not be loaded. Refresh the page to try again.
        </p>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <Profile />
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div
          className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-[1.02] cursor-pointer"
          style={fadeInUp(0.2)}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {courses.loading ? (
                <SkeletonRegion label="Loading courses"><Skeleton className="h-10 w-12" /></SkeletonRegion>
              ) : (
                courseSummary.completed
              )}
            </h2>
            <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-md">
              <img src={completed} alt="Completed courses" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-600 font-semibold text-lg">Courses Completed</p>
        </div>

        <div
          className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-[1.02] cursor-pointer"
          style={fadeInUp(0.3)}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {courses.loading ? (
                <SkeletonRegion label="Loading courses"><Skeleton className="h-10 w-12" /></SkeletonRegion>
              ) : (
                courseSummary.inProgress.length
              )}
            </h2>
            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-md">
              <img src={pro} alt="Courses in progress" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-600 font-semibold text-lg">Courses In Progress</p>
        </div>

        <div
          className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-[1.02] cursor-pointer"
          style={fadeInUp(0.4)}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {studentAssignments.loading ? (
                <SkeletonRegion label="Loading assignments"><Skeleton className="h-10 w-12" /></SkeletonRegion>
              ) : studentAssignments.error
                  ? "—"
                  : studentAssignments.pendingAssignments.length}
            </h2>
            <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl shadow-md">
              <img src={assignment} alt="Pending assignments" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-600 font-semibold text-lg">Pending Assignments</p>
        </div>
      </div>

      {/* Calendar and Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="min-w-0 md:col-span-2" style={fadeInUp(0.6)}>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6 border border-slate-200">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Courses In Progress
              </h3>
              <button
                type="button"
                onClick={() => navigate("/student-dashboard/courses")}
                className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors hover:scale-105"
              >
                View All →
              </button>
            </div>

            {courses.loading ? (
              <ListSkeleton rows={3} label="Loading courses in progress" />
            ) : courseSummary.inProgress.length ? courseSummary.inProgress.map((course, index) => (
              <div key={course.course_id} className="mb-4 bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="hidden sm:block p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-md">
                    <img src={completed} alt="Course icon" className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-3 mb-3">
                      <div className="min-w-0">
                        <h4 className="break-words text-lg font-bold text-slate-800 mb-1">
                          {course.course_name}
                        </h4>
                        <p className="text-slate-600 font-medium">
                          {course.completed_lessons} of {course.total_lessons} lessons done
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {Math.round(course.completion_percentage)}%
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <img src={mask} alt="Progress" className="w-4 h-4" />
                          <span className="text-sm text-slate-500">Complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"
                        style={{
                          width: `${Math.round(course.completion_percentage)}%`,
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
            )) : (
              <div className="text-center text-slate-500 py-8">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-lg font-medium">No courses in progress</p>
                <p className="text-sm">Start learning to see your progress here!</p>
              </div>
            )}
          </div>
          {/* notification */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-200">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Notifications
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors hover:scale-105">
                View All →
              </button>
            </div>

            {studentAnnouncements.loading ? (
              <p className="text-slate-500" role="status">Loading announcements…</p>
            ) : studentAnnouncements.error ? (
              <p className="text-red-600" role="alert">{studentAnnouncements.error.message}</p>
            ) : studentAnnouncements.announcements.length ? (
              <div className="space-y-4">
                {studentAnnouncements.announcements.map((announcement, index) => {
                  const colors = [
                    "from-blue-50 to-indigo-50 border-blue-100",
                    "from-orange-50 to-red-50 border-orange-100",
                    "from-green-50 to-emerald-50 border-green-100"
                  ];

                  return (
                    <div
                      key={announcement.id}
                      className={`bg-gradient-to-r ${colors[index % colors.length]} p-4 rounded-xl border hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-md">
                          <img src={bell} alt="" className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-lg font-bold text-slate-800 mb-2">
                            {announcement.title}
                          </p>
                          <p className="break-words text-slate-600 font-medium leading-relaxed">
                            {announcement.message}
                          </p>
                          {announcement.created_at && (
                            <p className="mt-2 text-sm text-slate-500">
                              {new Date(announcement.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500">No announcements yet.</p>
            )}
          </div>
          {/* end of notification */}
        </div>
        <div className="min-w-0" style={fadeInUp(0.5)}>
          {/* calender */}

          <LiveCalendar />
          {/* end of calender */}

        <div
          className="bg-white p-4 rounded-xl shadow-sm mt-6"
          style={fadeInUp(0.7)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className=" text-[12px] lg:text-[16px] font-semibold text-gray-800">
              Attendance
            </h3>
          </div>

          {attendance.loading ? (
            <SkeletonRegion label="Loading attendance" className="flex justify-center pt-4 pb-3">
              <Skeleton className="h-32 w-32 rounded-full" />
            </SkeletonRegion>
          ) : (
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
                    <p className="text-xs text-gray-500">
                      {attendance.data?.summary?.total ? "Present" : "No records yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
        </div>
      </div>

      {/* Online exam scores: graded CBT exams, latest term first */}
      <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6" style={fadeInUp(0.9)} aria-labelledby="exam-scores-heading">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <h3 id="exam-scores-heading" className="text-[18px] lg:text-[20px] font-semibold text-gray-800">
            Online exam scores
          </h3>
          <button
            type="button"
            onClick={() => navigate("/student-dashboard/transcript")}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            See all terms →
          </button>
        </div>

        {transcript.loading ? (
          <SkeletonRegion label="Loading exam scores" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg bg-gray-50 p-4">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
              ))}
            </div>
            <ListSkeleton rows={2} label="Loading subjects" />
          </SkeletonRegion>
        ) : latestTerm ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {transcript.data.overall_average}% ({transcript.data.overall_grade})
                </div>
                <div className="text-sm text-gray-600">Overall average</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{latestTerm.subjects.length}</div>
                <div className="text-sm text-gray-600">Subjects this term</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {latestTerm.subjects.reduce((n, subject) => n + subject.exams_taken, 0)}
                </div>
                <div className="text-sm text-gray-600">Exams graded this term</div>
              </div>
            </div>

            <h4 className="text-lg font-medium text-gray-800 mb-4">
              {latestTerm.term === "unassigned"
                ? "Exams without a term"
                : `${latestTerm.term.charAt(0).toUpperCase()}${latestTerm.term.slice(1)} term`}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestTerm.subjects.map((subject) => (
                <div key={subject.subject_id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h5 className="min-w-0 break-words font-medium text-gray-800">{subject.subject_name}</h5>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{subject.average_percentage}%</div>
                      <div className="text-xs text-gray-500">Grade {subject.grade}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {subject.exams_taken} exam{subject.exams_taken === 1 ? "" : "s"}
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(subject.average_percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          !transcript.error && (
            <p className="text-center text-gray-500 py-6">No online exams have been graded yet.</p>
          )
        )}
      </section>


      <style>{`
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
