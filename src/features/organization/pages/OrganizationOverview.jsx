import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  BookOpen,
  FileText,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Award,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  GraduationCap,
  Building,
  Plus,
  ArrowRight
} from "lucide-react";

const OrganizationOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Mock data for the overview
  const mockData = {
    quickStats: {
      total_students: 1250,
      total_teachers: 85,
      total_classes: 42,
      total_subjects: 18,
      active_students: 1180,
      attendance_rate: 94.5,
      average_grade: 85.2
    },
    recentActivities: [
      {
        id: 1,
        type: "enrollment",
        message: "New student enrollment: Sarah Johnson joined Class 10A",
        timestamp: "2 hours ago",
        icon: Users
      },
      {
        id: 2,
        type: "exam",
        message: "Mathematics exam scheduled for tomorrow",
        timestamp: "4 hours ago",
        icon: FileText
      },
      {
        id: 3,
        type: "achievement",
        message: "Class 9B achieved 98% attendance this month",
        timestamp: "1 day ago",
        icon: Award
      },
      {
        id: 4,
        type: "update",
        message: "New teacher Mr. Davis joined the Science department",
        timestamp: "2 days ago",
        icon: UserCheck
      }
    ],
    alerts: [
      {
        id: 1,
        type: "warning",
        message: "Low attendance in Class 8C (below 80%)",
        priority: "high",
        timestamp: "1 hour ago"
      },
      {
        id: 2,
        type: "info",
        message: "Parent-teacher meeting scheduled for next week",
        priority: "medium",
        timestamp: "3 hours ago"
      },
      {
        id: 3,
        type: "success",
        message: "All assignments submitted for Mathematics",
        priority: "low",
        timestamp: "5 hours ago"
      }
    ],
    classPerformance: [
      { class: "10A", average: 88.5, attendance: 96, students: 35 },
      { class: "10B", average: 85.2, attendance: 92, students: 32 },
      { class: "9A", average: 87.8, attendance: 94, students: 38 },
      { class: "9B", average: 86.1, attendance: 91, students: 34 }
    ],
    upcomingEvents: [
      { title: "Mathematics Final Exam", date: "2024-01-15", time: "09:00 AM", type: "exam" },
      { title: "Parent-Teacher Conference", date: "2024-01-18", time: "02:00 PM", type: "meeting" },
      { title: "Science Fair", date: "2024-01-22", time: "10:00 AM", type: "event" }
    ]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = (delay) => ({
    animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
    opacity: 0,
    transform: "translateY(20px)",
  });

  const StatCard = ({ title, value, icon: Icon, color, bgColor, change, changeType }) => (
    <div
      className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      style={fadeInUp(0.2)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{activity.message}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
        </div>
      </div>
    );
  };

  const AlertItem = ({ alert }) => {
    const getAlertStyles = (type) => {
      switch (type) {
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    return (
      <div className={`p-3 rounded-lg border ${getAlertStyles(alert.type)} mb-3`}>
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">{alert.message}</p>
            <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
          </div>
        </div>
      </div>
    );
  };

  const QuickAction = ({ title, description, icon: Icon, onClick, color = "blue" }) => (
    <button
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105 text-left"
    >
      <div className={`p-2 rounded-lg bg-${color}-100 w-fit mb-3`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Organization Dashboard</h1>
        <p className="text-blue-100">Monitor your school's performance and manage operations efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={mockData.quickStats.total_students}
          icon={GraduationCap}
          color="text-blue-600"
          bgColor="bg-blue-100"
          change="+5.2%"
          changeType="positive"
        />
        <StatCard
          title="Total Teachers"
          value={mockData.quickStats.total_teachers}
          icon={UserCheck}
          color="text-green-600"
          bgColor="bg-green-100"
          change="+2.1%"
          changeType="positive"
        />
        <StatCard
          title="Total Classes"
          value={mockData.quickStats.total_classes}
          icon={BookOpen}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          title="Attendance Rate"
          value={`${mockData.quickStats.attendance_rate}%`}
          icon={Target}
          color="text-orange-600"
          bgColor="bg-orange-100"
          change="+1.3%"
          changeType="positive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activities and Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Performance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Class Performance Overview</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {mockData.classPerformance.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Class {cls.class}</p>
                      <p className="text-sm text-gray-600">{cls.students} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{cls.average}% avg</p>
                    <p className="text-sm text-green-600">{cls.attendance}% attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-1">
              {mockData.recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Alerts and Quick Actions */}
        <div className="space-y-6">
          {/* System Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {mockData.alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <QuickAction
                title="Add New Student"
                description="Enroll a new student"
                icon={Plus}
                onClick={() => navigate('/organization-dashboard/students')}
                color="green"
              />
              <QuickAction
                title="Schedule Exam"
                description="Create new examination"
                icon={FileText}
                onClick={() => navigate('/organization-dashboard/exams')}
                color="blue"
              />
              <QuickAction
                title="View Reports"
                description="Access detailed reports"
                icon={PieChart}
                onClick={() => navigate('/organization-dashboard/reports')}
                color="purple"
              />
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockData.upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-600">{event.date} at {event.time}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
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
      `}</style>
    </div>
  );
};

export default OrganizationOverview;
