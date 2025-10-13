import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Users } from "lucide-react";
import Profile from "../../auth/Profile";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import { getParentDashboard, getEnhancedParentDashboard } from "@/api/dashboardApi";
import ParentAttendance from "./ParentAttendance";
import ParentMessages from "./ParentMessages";
import ParentPayment from "./ParentPayment";
import ParentResult from "./ParentResult";
import ParentTimetable from "./ParentTimetable";
import ParentTranscript from "./ParentTranscript";
import ParentSidebar from "../components/ParentSidebar";
import ParentHeader from "../components/ParentHeader";
import Announcement from "./Announcement";

// Main application component
export default function ParentDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    // Get parent ID from user data
    const getParentId = () => {
      try {
        const raw = localStorage.getItem("user_data") ||
                    sessionStorage.getItem("user_data");
        const user = raw ? JSON.parse(raw) : null;
        return user?.id;
      } catch {
        return null;
      }
    };

    const id = getParentId();
    setParentId(id);

    async function fetchDashboard() {
      if (!id) return;

      setLoading(true);
      try {
        const response = await getEnhancedParentDashboard(id);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch enhanced parent dashboard:", error);
        // Fallback to basic dashboard
        try {
          const basicResponse = await getParentDashboard(id);
          setDashboardData(basicResponse.data);
        } catch (basicError) {
          console.error("Failed to fetch basic parent dashboard:", basicError);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // Check if navigated from attendance page with activeTab state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ParentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 md:ml-64">
        <ParentHeader
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          dashboardData={dashboardData}
        />

        {/* Main Content Area */}
        <div className="m-4 md:m-6 mt-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Welcome back, {dashboardData?.user?.first_name || 'Parent'}!
                    </h2>
                    <p className="text-blue-100 text-lg">
                      Here's an overview of your children's academic progress and activities.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Stats and Activity */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Overview</h3>
                    <QuickStatsCard />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <RecentActivityFeed />
                  </div>
                </div>

                {/* Right Column - Alerts and Actions */}
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Alerts & Notifications</h3>
                    <StudentAlertsPanel />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <QuickActionsGrid />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "announcement" && <Announcement />}
          {activeTab === "attendance" && <ParentAttendance />}
          {activeTab === "grades" && <ParentResult />}
          {activeTab === "messages" && <ParentMessages />}
          {activeTab === "fees" && <ParentPayment />}
          {activeTab === "timetable" && <ParentTimetable />}
          {activeTab === "reports" && <ParentTranscript />}
        </div>

      </div>
    </div>
  );
}

// Children component with list of children
function ChildrenComponent() {
  const children = [
    {
      id: 1,
      name: "Priscilla Daniel",
      age: 10,
      classLevel: "Primary 5",
      institution: "Primary",
      school: "Sunshine Primary School"
    },
    {
      id: 2,
      name: "John Doe",
      age: 15,
      classLevel: "SS2",
      institution: "Secondary",
      school: "Bright Future Secondary School"
    },
    {
      id: 3,
      name: "Mary Johnson",
      age: 19,
      classLevel: "ND2",
      institution: "Polytechnic",
      school: "Federal Polytechnic, Lagos"
    },
    {
      id: 4,
      name: "Samuel Lee",
      age: 22,
      classLevel: "300 Level",
      institution: "University",
      school: "University of Ibadan"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Children</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div key={child.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{child.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{child.name}</h3>
                <p className="text-gray-600">{child.classLevel}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{child.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Institution:</span>
                <span className="font-medium">{child.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">School:</span>
                <span className="font-medium">{child.school}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
