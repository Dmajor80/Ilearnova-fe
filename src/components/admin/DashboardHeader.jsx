import React from "react";
import { RefreshCw, BarChart3 } from "lucide-react";
import QuickActionsDropdown from "./QuickActionsDropdown";

/**
 * Dashboard header component with welcome message, user info, and action buttons.
 * Provides consistent header layout for admin dashboard.
 */
const DashboardHeader = React.memo(function DashboardHeader({
  user,
  welcomeMessage = "Welcome back",
  lastUpdated,
  onRefresh,
  onViewReports,
  quickActions = [],
  quickActionsOpen = false,
  onToggleQuickActions,
  onCloseQuickActions,
  refreshLoading = false,
  actionLoading = false,
  className = ""
}) {
  const handleRefresh = () => {
    if (!refreshLoading && onRefresh) {
      onRefresh();
    }
  };

  const handleViewReports = () => {
    if (!actionLoading && onViewReports) {
      onViewReports();
    }
  };

  const handleRefreshKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !refreshLoading) {
      e.preventDefault();
      onRefresh();
    }
  };

  const handleReportsKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !actionLoading) {
      e.preventDefault();
      onViewReports();
    }
  };

  return (
    <header className={`flex items-center justify-between mb-8 ${className}`}>
      {/* Left Side - Welcome Message */}
      <div className="flex-1">
        <div className="space-y-1">
          <p className="text-sm md:text-base text-gray-600">
            {welcomeMessage}
          </p>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-900">
            {user?.displayName || "Admin"}
          </h1>
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          onKeyDown={handleRefreshKeyDown}
          disabled={refreshLoading}
          className={`
            flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border-2 
            transition-all duration-200 ease-in-out font-semibold text-sm md:text-base
            ${refreshLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
            border-blue-600 text-blue-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          aria-label={refreshLoading ? "Refreshing data..." : "Refresh dashboard data"}
        >
          <div className="p-1 rounded-full border-2 border-blue-600">
            <RefreshCw 
              className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </div>
          <span className="hidden sm:inline">
            {refreshLoading ? "Refreshing..." : "Refresh"}
          </span>
        </button>

        {/* Reports Button */}
        <button
          onClick={handleViewReports}
          onKeyDown={handleReportsKeyDown}
          disabled={actionLoading}
          className={`
            flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border-2 
            transition-all duration-200 ease-in-out font-semibold text-sm md:text-base
            ${actionLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
            border-blue-600 text-blue-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          aria-label="View reports"
        >
          <div className="p-1 rounded-full border-2 border-blue-600">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="hidden sm:inline">Reports</span>
        </button>

        {/* Quick Actions Dropdown */}
        <QuickActionsDropdown
          isOpen={quickActionsOpen}
          onToggle={onToggleQuickActions}
          onClose={onCloseQuickActions}
          actions={quickActions}
          loading={actionLoading}
        />
      </div>
    </header>
  );
});

/**
 * Format the last updated timestamp for display
 */
function formatLastUpdated(timestamp) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch {
    return "Unknown";
  }
}

export default DashboardHeader;
