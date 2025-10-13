import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import ClassPerformanceOverview from "@/components/dashboard/ClassPerformanceOverview";
import ClassRosters from "@/components/dashboard/ClassRosters";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";

import { getEnhancedOrganizationDashboard } from "@/api/dashboardApi";
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
  Home,
  BookOpen,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  GraduationCap,
  Building,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [progress, setProgress] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [modalType, setModalType] = useState(''); // 'exam', 'student', etc.
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const chartRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getEnhancedOrganizationDashboard();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch organization dashboard:', err);
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

  const addExam = (exam) => {
    setExams([...exams, { ...exam, id: Date.now() }]);
  };

  const updateExam = (exam) => {
    setExams(exams.map(e => e.id === exam.id ? exam : e));
  };

  const deleteExam = (id) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const addStudent = (student) => {
    setStudents([...students, { ...student, id: Date.now() }]);
  };

  const updateStudent = (student) => {
    setStudents(students.map(s => s.id === student.id ? student : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const addTeacher = (teacher) => {
    setTeachers([...teachers, { ...teacher, id: Date.now() }]);
  };

  const updateTeacher = (teacher) => {
    setTeachers(teachers.map(t => t.id === teacher.id ? teacher : t));
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const addClass = (cls) => {
    setClasses([...classes, { ...cls, id: Date.now() }]);
  };

  const updateClass = (cls) => {
    setClasses(classes.map(c => c.id === cls.id ? cls : c));
  };

  const deleteClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };


  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: UserCheck },
    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "exams", label: "Exams", icon: FileText },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
  ];

  const GenericModal = ({ item, type, onSave, onClose }) => {
    const [form, setForm] = useState(item || {});

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(form);
    };

    const renderFields = () => {
      switch (type) {
        case 'exam':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Exam Name</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
                <input type="text" value={form.subject || ''} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                <input type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                <select value={form.status || 'Upcoming'} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Upcoming</option>
                  <option>Completed</option>
                </select>
              </div>
            </>
          );
        case 'student':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Student Name</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Grade</label>
                <input type="text" value={form.grade || ''} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                <select value={form.status || 'Active'} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </>
          );
        case 'teacher':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Teacher Name</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
                <input type="text" value={form.subject || ''} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                <select value={form.status || 'Active'} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </>
          );
        case 'class':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Class Name</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
                <input type="text" value={form.subject || ''} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Assigned Teacher</label>
                <input type="text" value={form.teacher || ''} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Number of Students</label>
                <input type="number" value={form.students || 0} onChange={(e) => setForm({ ...form, students: parseInt(e.target.value) || 0 })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" />
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 capitalize">{type} {item ? 'Edit' : 'Add'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderFields()}
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ item, type, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
        <h3 className="text-xl font-semibold mb-4 text-red-600">Confirm Delete</h3>
        <p className="mb-6 text-gray-600">Are you sure you want to delete this {type}? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );

  const fadeInUp = (delay) => {
    return {
      animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
      opacity: 0,
      transform: "translateY(20px)",
    };
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div
                className="bg-white p-3 sm:p-4 rounded-xl shadow-sm min-h-[120px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_students || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-[14px] font-medium">Total Students</p>
              </div>

              <div
                className="bg-white p-3 sm:p-4 rounded-xl shadow-sm min-h-[120px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_teachers || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-[14px] font-medium">Total Teachers</p>
              </div>

              <div
                className="bg-white p-3 sm:p-4 rounded-xl shadow-sm min-h-[120px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_classes || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-[14px] font-medium">Total Classes</p>
              </div>

              <div
                className="bg-white p-3 sm:p-4 rounded-xl shadow-sm min-h-[120px]"
                style={fadeInUp(0.2)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[35px] text-[#3737df] font-normal">
                    {dashboardData?.quick_stats?.total_subjects || 0}
                  </h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-[14px] font-medium">Total Subjects</p>
              </div>
            </div>

            <ClassPerformanceOverview classPerformance={dashboardData?.class_performance || []} />
            <ClassRosters classRosters={dashboardData?.class_rosters || []} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-6">
              <RecentActivityFeed activities={dashboardData?.recent_activity || []} />
              <StudentAlertsPanel alerts={dashboardData?.system_alerts || []} />
            </div>

            <div className="mt-6">
              <QuickActionsGrid actions={dashboardData?.quick_actions || []} />
            </div>
          </>
        );

      case "students":
        return (
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Student Management</h3>
                <p className="text-gray-600 text-sm sm:text-base">Manage student records and enrollment</p>
              </div>
              <button onClick={() => { setModalType('student'); setEditingStudent(null); setShowModal(true); }} className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Add Student</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-blue-700">Total Students</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{students.length}</p>
                  </div>
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-green-700">Active</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{students.filter(s => s.status === 'Active').length}</p>
                  </div>
                  <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-yellow-700">At Risk</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{students.filter(s => s.status === 'Inactive').length}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <SchoolDataTable
                data={students}
                columns={[
                  { key: 'name', label: 'Student Name' },
                  { key: 'email', label: 'Email', className: 'hidden sm:table-cell' },
                  { key: 'grade', label: 'Grade' },
                  { key: 'status', label: 'Status', render: (status) => <span className={`px-2 py-1 rounded-full text-xs ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status}</span> },
                ]}
                actions={['edit', 'delete']}
                onAction={(row, action) => {
                  if (action === 'edit') {
                    setModalType('student');
                    setEditingStudent(row);
                    setShowModal(true);
                  }
                  if (action === 'delete') {
                    setDeleteConfirm({ id: row.id, type: 'student' });
                  }
                }}
              />
            </div>
            {showModal && modalType === 'student' && <GenericModal item={editingStudent} type="student" onSave={(student) => {
              if (editingStudent) {
                updateStudent(student);
              } else {
                addStudent(student);
              }
              setShowModal(false);
              setEditingStudent(null);
            }} onClose={() => { setShowModal(false); setEditingStudent(null); }} />}
            {deleteConfirm && deleteConfirm.type === 'student' && <DeleteConfirmModal item={students.find(s => s.id === deleteConfirm.id)} type="student" onConfirm={() => { deleteStudent(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
          </div>
        );

      case "teachers":
        return (
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Teacher Management</h3>
                <p className="text-gray-600 text-sm sm:text-base">Manage faculty and staff</p>
              </div>
              <button onClick={() => { setModalType('teacher'); setEditingTeacher(null); setShowModal(true); }} className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
                <UserCheck className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Add Teacher</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-purple-700">Total Teachers</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">{teachers.length}</p>
                  </div>
                  <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-green-700">Active</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{teachers.filter(t => t.status === 'Active').length}</p>
                  </div>
                  <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-indigo-700">Average Rating</p>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600">4.5</p>
                  </div>
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <SchoolDataTable
                data={teachers}
                columns={[
                  { key: 'name', label: 'Teacher Name' },
                  { key: 'email', label: 'Email', className: 'hidden sm:table-cell' },
                  { key: 'subject', label: 'Subject' },
                  { key: 'status', label: 'Status', render: (status) => <span className={`px-2 py-1 rounded-full text-xs ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status}</span> },
                ]}
                actions={['edit', 'delete']}
                onAction={(row, action) => {
                  if (action === 'edit') {
                    setModalType('teacher');
                    setEditingTeacher(row);
                    setShowModal(true);
                  }
                  if (action === 'delete') {
                    setDeleteConfirm({ id: row.id, type: 'teacher' });
                  }
                }}
              />
            </div>
            {showModal && modalType === 'teacher' && <GenericModal item={editingTeacher} type="teacher" onSave={(teacher) => {
              if (editingTeacher) {
                updateTeacher(teacher);
              } else {
                addTeacher(teacher);
              }
              setShowModal(false);
              setEditingTeacher(null);
            }} onClose={() => { setShowModal(false); setEditingTeacher(null); }} />}
            {deleteConfirm && deleteConfirm.type === 'teacher' && <DeleteConfirmModal item={teachers.find(t => t.id === deleteConfirm.id)} type="teacher" onConfirm={() => { deleteTeacher(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
          </div>
        );

      case "classes":
        return (
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Class Management</h3>
                <p className="text-gray-600 text-sm sm:text-base">Manage classes and schedules</p>
              </div>
              <button onClick={() => { setModalType('class'); setEditingClass(null); setShowModal(true); }} className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Add Class</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-indigo-700">Total Classes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{classes.length}</p>
                  </div>
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-green-700">Active Classes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{classes.filter(c => c.status === 'Active').length || classes.length}</p>
                  </div>
                  <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-teal-700">Avg Size</p>
                    <p className="text-2xl sm:text-3xl font-bold text-teal-600">25</p>
                  </div>
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-500" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <SchoolDataTable
                data={classes}
                columns={[
                  { key: 'name', label: 'Class Name' },
                  { key: 'subject', label: 'Subject' },
                  { key: 'teacher', label: 'Teacher', className: 'hidden sm:table-cell' },
                  { key: 'students', label: '# Students' },
                ]}
                actions={['edit', 'delete']}
                onAction={(row, action) => {
                  if (action === 'edit') {
                    setModalType('class');
                    setEditingClass(row);
                    setShowModal(true);
                  }
                  if (action === 'delete') {
                    setDeleteConfirm({ id: row.id, type: 'class' });
                  }
                }}
              />
            </div>
            {showModal && modalType === 'class' && <GenericModal item={editingClass} type="class" onSave={(cls) => {
              if (editingClass) {
                updateClass(cls);
              } else {
                addClass(cls);
              }
              setShowModal(false);
              setEditingClass(null);
            }} onClose={() => { setShowModal(false); setEditingClass(null); }} />}
            {deleteConfirm && deleteConfirm.type === 'class' && <DeleteConfirmModal item={classes.find(c => c.id === deleteConfirm.id)} type="class" onConfirm={() => { deleteClass(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
          </div>
        );

      case "analytics":
        return (
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Analytics Dashboard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
              <div className="p-3 sm:p-4 md:p-6 bg-gray-50 rounded-lg">
                <h4 className="text-sm sm:text-base font-medium mb-2">Performance Trends</h4>
                <div className="h-32 bg-white rounded p-2">
                  <div className="text-center text-gray-500 mt-8">Chart Placeholder</div>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6 bg-gray-50 rounded-lg">
                <h4 className="text-sm sm:text-base font-medium mb-2">Attendance Overview</h4>
                <div className="h-32 bg-white rounded p-2">
                  <div className="text-center text-gray-500 mt-8">Chart Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Reports & Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
              <div className="p-3 sm:p-4 md:p-6 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Monthly Performance Report</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Student Enrollment Report</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case "exams":
        return (
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Exam Management</h3>
                <p className="text-gray-600 text-sm sm:text-base">Manage school exams and schedules</p>
              </div>
              <button onClick={() => { setModalType('exam'); setEditingExam(null); setShowModal(true); }} className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 w-full sm:w-auto justify-center min-h-[44px]">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Add Exam</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-blue-700">Total Exams</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{exams.length}</p>
                  </div>
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-green-700">Upcoming</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{exams.filter(e => new Date(e.date) > new Date()).length}</p>
                  </div>
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-orange-700">Completed</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600">{exams.filter(e => new Date(e.date) < new Date()).length}</p>
                  </div>
                  <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <SchoolDataTable
                data={exams}
                columns={[
                  { key: 'name', label: 'Exam Name' },
                  { key: 'subject', label: 'Subject', className: 'hidden sm:table-cell' },
                  { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
                  { key: 'status', label: 'Status', render: (status) => <span className={`px-2 py-1 rounded-full text-xs ${status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{status}</span> },
                ]}
                actions={['edit', 'delete']}
                onAction={(row, action) => {
                  if (action === 'edit') {
                    setModalType('exam');
                    setEditingExam(row);
                    setShowModal(true);
                  }
                  if (action === 'delete') {
                    setDeleteConfirm({ id: row.id, type: 'exam' });
                  }
                }}
              />
            </div>
            {showModal && modalType === 'exam' && <GenericModal item={editingExam} type="exam" onSave={(exam) => {
              if (editingExam) {
                updateExam(exam);
              } else {
                addExam(exam);
              }
              setShowModal(false);
              setEditingExam(null);
            }} onClose={() => { setShowModal(false); setEditingExam(null); }} />}
            {deleteConfirm && deleteConfirm.type === 'exam' && <DeleteConfirmModal item={exams.find(e => e.id === deleteConfirm.id)} type="exam" onConfirm={() => { deleteExam(deleteConfirm.id); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
          </div>
        );

      case "alerts":
        return (
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">System Alerts</h3>
            <StudentAlertsPanel alerts={dashboardData?.system_alerts || []} />
          </div>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
            <h2 className={`
              font-bold text-[26px] text-blue-900 text-center ml-[1rem] transition-all duration-300
              ${isSidebarOpen ? "block" : "hidden md:block"}
            `}>ILEARNOVA</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false); // Close sidebar on mobile after selection
                    }
                  }}
                  className={`w-full flex items-center px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 text-left rounded-lg transition-colors min-h-[48px] ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 m-4 md:m-6 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow md:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <p className="text-gray-500 text-sm mb-1">Dashboard / Organization</p>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
                  {sidebarItems.find(item => item.id === activeSection)?.label}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-haspopup="true"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <img
                    src={dashboardData?.user?.profile_pic || "/default-profile.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                {/* Dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 border border-gray-200">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && (
            <div className="space-y-6">
              {renderContent()}
            </div>
          )}
        </div>
      </div>

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

export default OrganizationDashboard;
