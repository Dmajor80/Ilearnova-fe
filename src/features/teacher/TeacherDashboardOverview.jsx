import React, { useEffect, useState } from 'react';
import { getEnhancedTeacherDashboard } from '@/api/dashboardApi';
import QuickStatsCard from '@/components/dashboard/QuickStatsCard';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import StudentAlertsPanel from '@/components/dashboard/StudentAlertsPanel';
import QuickActionsGrid from '@/components/dashboard/QuickActionsGrid';

const TeacherDashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getEnhancedTeacherDashboard();
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickStatsCard
          title="Total Students"
          value={dashboardData?.quick_stats?.total_students || 0}
          icon="users"
          color="blue"
          trend="+12%"
          trendUp={true}
        />
        <QuickStatsCard
          title="Active Classes"
          value={dashboardData?.quick_stats?.total_classes || 0}
          icon="book"
          color="green"
          trend="+3"
          trendUp={true}
        />
        <QuickStatsCard
          title="Today's Attendance"
          value={`${dashboardData?.quick_stats?.today_attendance || 0}%`}
          icon="calendar"
          color="yellow"
          trend="+5%"
          trendUp={true}
        />
        <QuickStatsCard
          title="Assignments Graded"
          value={dashboardData?.quick_stats?.graded_today || 0}
          icon="check"
          color="purple"
          trend="15/20"
          trendUp={false}
        />
        <QuickStatsCard
          title="Pending Reviews"
          value={dashboardData?.quick_stats?.pending_submissions || 0}
          icon="alert"
          color="red"
          trend="2 urgent"
          trendUp={false}
        />
        <QuickStatsCard
          title="Upcoming Exams"
          value={dashboardData?.quick_stats?.upcoming_exams || 0}
          icon="calendar"
          color="blue"
          trend="Next: Tomorrow"
          trendUp={null}
        />
        <QuickStatsCard
          title="Average Class Score"
          value="84.5%"
          icon="award"
          color="indigo"
          trend="+2.1%"
          trendUp={true}
        />
        <QuickStatsCard
          title="Student Engagement"
          value="92%"
          icon="trending-up"
          color="teal"
          trend="+8%"
          trendUp={true}
        />
      </div>

      {/* Class Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Class Performance Overview</h2>
          <div className="flex items-center space-x-2">
            <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Classes</option>
              <option>Grade 8A Mathematics</option>
              <option>Grade 9B Science</option>
              <option>Grade 7C English</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              View Details
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mathematics Class */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Grade 8A Mathematics</h3>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Excellent</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">28/30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Score:</span>
                <span className="font-medium text-green-600">87.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attendance:</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
          </div>

          {/* Science Class */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Grade 9B Science</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Good</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">25/26</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Score:</span>
                <span className="font-medium text-blue-600">82.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attendance:</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '82%'}}></div>
              </div>
            </div>
          </div>

          {/* English Class */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Grade 7C English</h3>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Needs Attention</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">22/24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Score:</span>
                <span className="font-medium text-yellow-600">74.8%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attendance:</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule & Attendance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule & Attendance</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Mark Attendance
          </button>
        </div>

        <div className="space-y-4">
          {/* Morning Classes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Morning Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Mathematics - Grade 8A</h4>
                  <span className="text-sm text-gray-500">8:00 AM - 9:00 AM</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">Present: 27/30</span>
                  <span className="text-red-600">Absent: 3</span>
                  <span className="text-yellow-600">Late: 1</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Science - Grade 9B</h4>
                  <span className="text-sm text-gray-500">9:15 AM - 10:15 AM</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">Present: 24/26</span>
                  <span className="text-red-600">Absent: 2</span>
                  <span className="text-yellow-600">Late: 0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Afternoon Classes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Afternoon Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">English - Grade 7C</h4>
                  <span className="text-sm text-gray-500">1:00 PM - 2:00 PM</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">Present: 20/24</span>
                  <span className="text-red-600">Absent: 4</span>
                  <span className="text-yellow-600">Late: 2</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">History - Grade 8A</h4>
                  <span className="text-sm text-gray-500">2:15 PM - 3:15 PM</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">Present: 26/30</span>
                  <span className="text-red-600">Absent: 3</span>
                  <span className="text-yellow-600">Late: 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityFeed />
        <StudentAlertsPanel />
      </div>

      {/* Quick Actions */}
      <QuickActionsGrid />

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-xl">📅</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Parent-Teacher Conference</h3>
              <p className="text-sm text-gray-600">February 15, 2024 • 2:00 PM - 4:00 PM</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">🏆</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Science Fair</h3>
              <p className="text-sm text-gray-600">March 5, 2024 • All Day</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600 text-xl">📚</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Professional Development Workshop</h3>
              <p className="text-sm text-gray-600">March 12, 2024 • 9:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardOverview;
