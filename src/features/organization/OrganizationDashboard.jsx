import React, { useState, useEffect } from "react";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import ClassPerformanceOverview from "@/components/dashboard/ClassPerformanceOverview";
import ClassRosters from "@/components/dashboard/ClassRosters";
import { getAdminMetrics, getAdminActivities, getAdminCharts } from "@/api/dashboardApi";

export default function OrganizationDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        // Try to fetch organization dashboard data
        // Note: These endpoints might need to be updated for organization-specific data
        const metricsResponse = await getAdminMetrics();
        const activitiesResponse = await getAdminActivities();
        const chartsResponse = await getAdminCharts();

        setDashboardData({
          metrics: metricsResponse.data,
          activities: activitiesResponse.data,
          charts: chartsResponse.data,
        });
      } catch (error) {
        console.error("Failed to fetch organization dashboard data:", error);
        // Set fallback data for development
        setDashboardData({
          metrics: {
            total_users: 0,
            active_sessions: 0,
            system_alerts: 0,
            alerts: [],
            quick_actions: []
          },
          activities: [],
          charts: {
            class_performance: [],
            class_rosters: []
          }
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {loading && <p>Loading organization dashboard...</p>}
      {!loading && dashboardData && activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <QuickStatsCard
              title="Total Users"
              value={dashboardData.metrics.total_users || 0}
              icon="users"
              color="blue"
            />
            <QuickStatsCard
              title="Active Sessions"
              value={dashboardData.metrics.active_sessions || 0}
              icon="calendar"
              color="green"
            />
            <QuickStatsCard
              title="System Alerts"
              value={dashboardData.metrics.system_alerts || 0}
              icon="alert"
              color="red"
            />
          </div>

          <ClassPerformanceOverview classPerformance={dashboardData.charts.class_performance} />
          <ClassRosters classRosters={dashboardData.charts.class_rosters} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <RecentActivityFeed activities={dashboardData.activities} />
            <StudentAlertsPanel alerts={dashboardData.metrics.alerts} />
          </div>

          <div className="mt-6">
            <QuickActionsGrid actions={dashboardData.metrics.quick_actions} />
          </div>
        </>
      )}
    </div>
  );
}
