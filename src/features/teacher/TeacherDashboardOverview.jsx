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

