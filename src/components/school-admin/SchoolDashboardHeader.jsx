import React from "react";
import { RefreshCw, BarChart3, ChevronDown, Bell } from "lucide-react";

/**
 * School dashboard header component with user info, notifications, and actions.
 * Provides consistent header layout for school admin dashboard.
 */
const SchoolDashboardHeader = React.memo(function SchoolDashboardHeader({
  user,
  schoolName = "Akademi School",
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
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
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

  const handleNotificationKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && onNotificationClick) {
      e.preventDefault();
      onNotificationClick();
    }
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Welcome Message */}
          <div className="flex-1">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                {welcomeMessage}
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-[#303972]">
                {user?.displayName || "School Admin"}
              </h1>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{schoolName}</span>
                {lastUpdated && (
                  <>
                    <span>•</span>
                    <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Actions and User Info */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              onKeyDown={handleNotificationKeyDown}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              onKeyDown={handleRefreshKeyDown}
              disabled={refreshLoading}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4D44B5] 
                transition-all duration-200 ease-in-out text-sm font-medium
                ${refreshLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4D44B5] hover:text-white"}
                text-[#4D44B5]
                focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2
              `}
              aria-label={refreshLoading ? "Refreshing data..." : "Refresh dashboard data"}
            >
              <RefreshCw 
                className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
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
                flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4D44B5] 
                transition-all duration-200 ease-in-out text-sm font-medium
                ${actionLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4D44B5] hover:text-white"}
                text-[#4D44B5]
                focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2
              `}
              aria-label="View reports"
            >
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reports</span>
            </button>

            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={onToggleQuickActions}
                disabled={actionLoading}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4D44B5] 
                  transition-all duration-200 ease-in-out text-sm font-medium
                  ${actionLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4D44B5] hover:text-white"}
                  text-[#4D44B5]
                  focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2
                `}
                aria-expanded={quickActionsOpen}
                aria-haspopup="true"
                aria-label="Quick actions menu"
              >
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${quickActionsOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Quick Actions</span>
              </button>

              {/* Quick Actions Dropdown Menu */}
              {quickActionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Quick Actions
                    </h3>
                    
                    <div className="space-y-1">
                      {quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            action.action();
                            onCloseQuickActions();
                          }}
                          disabled={actionLoading}
                          className={`
                            w-full flex items-center gap-3 p-2 rounded-md text-left text-sm
                            transition-all duration-200 ease-in-out
                            ${actionLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
                            focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-inset
                          `}
                          role="menuitem"
                        >
                          <div className="w-8 h-8 bg-[#4D44B5] text-white rounded-full flex items-center justify-center text-xs">
                            {action.icon === "plus" && "+"}
                            {action.icon === "download" && "↓"}
                            {action.icon === "userPlus" && "👤"}
                            {action.icon === "utensils" && "🍽"}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">
                              {action.label}
                            </div>
                            {action.description && (
                              <div className="text-xs text-gray-500 truncate">
                                {action.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {quickActions.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No quick actions available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center">
              <button
                onClick={onProfileClick}
                className="w-8 h-8 bg-[#4D44B5] rounded-full flex items-center justify-center hover:bg-[#3D34A5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D44B5] focus:ring-offset-2"
                aria-label="User profile - click to view or update"
                title="Click to view/update profile"
              >
                {user?.avatarUrl || user?.profile_picture ? (
                  <img
                    src={user.avatarUrl || user.profile_picture}
                    alt={`${user?.displayName || 'User'} profile`}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span
                  className={`text-white text-sm font-medium ${(user?.avatarUrl || user?.profile_picture) ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                  style={{ display: (user?.avatarUrl || user?.profile_picture) ? 'none' : 'flex' }}
                >
                  {user?.initials || "SA"}
                </span>
              </button>
            </div>
          </div>
        </div>
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

export default SchoolDashboardHeader;
