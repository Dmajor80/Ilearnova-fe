import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "@/api/authApi";
import { clearAuth } from "@/api/auth";
import useOrganizationAlerts from "@/hooks/organization/useNotificationsData";
import { useOrganizationPendingStaff } from "@/hooks/organization";
import { Bell, ChevronDown, Settings, LogOut, Menu, X, User, Lock } from "lucide-react";
import useSubscriptionStatus from "@/features/billing/useSubscriptionStatus";
import { BILLING_PATH, MODES } from "@/features/billing/subscriptionUtils";
import SectionTabs from "@/components/navigation/SectionTabs";
import { groupOf, tabOf } from "@/components/navigation/navGroups";
import { ADMIN_BASE as BASE, ADMIN_GROUPS as GROUPS } from "./adminNav";
import { StatCardsSkeleton } from "@/components/ui/Skeleton";
import ManagingSchoolBanner from "@/components/admin/ManagingSchoolBanner";
import Toaster from "@/components/ui/Toast";
import { useManagedSchool } from "@/lib/manageSchool";

const PROFILE_PATH = "/organization-dashboard/profile";

/** The school this dashboard is for: the managed one, else the admin's own. */
function schoolNameFor(managed) {
  if (managed) return managed.name;
  let user = null;
  try {
    const raw = window.sessionStorage.getItem("user_data") || window.localStorage.getItem("user_data");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  const orgs = Array.isArray(user?.organizations) ? user.organizations : [];
  const selected = user?.selectedOrgId;
  const match = orgs.find((o) => String(o?.organization?.id ?? o?.id) === String(selected)) || orgs[0];
  return match?.organization?.name || match?.name || "";
}

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const managed = useManagedSchool();
  const schoolName = schoolNameFor(managed);
  const { status: subscription, loaded: subscriptionLoaded } = useSubscriptionStatus(location.pathname);
  const schoolLocked = subscription?.mode === MODES.BILLING_ONLY;
  // Locked school: admins may only use billing (and their profile).
  const locked = schoolLocked && location.pathname !== BILLING_PATH && location.pathname !== PROFILE_PATH;
  // Wait for the subscription answer, and load nothing a locked school
  // would refuse (the alert bell and pending badges).
  const canLoad = subscriptionLoaded && !schoolLocked;
  const alertsApi = useOrganizationAlerts({ enabled: canLoad });
  const pendingStaffApi = useOrganizationPendingStaff("teacher", { enabled: canLoad });
  const pendingStudentsApi = useOrganizationPendingStaff("student", { enabled: canLoad });
  const { totalNotifications, loading: alertsLoading } = alertsApi;

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

  const activeTab = location.pathname.slice(BASE.length).split("/")[0] || "overview";
  const activeGroup = groupOf(GROUPS, activeTab);
  const pendingCounts = {
    teachers: pendingStaffApi.totalPendingStaff,
    students: pendingStudentsApi.totalPendingStaff,
  };
  const pathOf = (tabId) => `${BASE}${tabId}`;

  return (
    <>
    <ManagingSchoolBanner />
    <Toaster />
    <div className={`flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${managed ? "pt-11" : ""}`}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white/10 z-40 md:hidden backdrop-blur-[2px]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed ${managed ? "top-11 bottom-0" : "inset-y-0"} left-0 z-50 w-64 bg-white shadow-2xl transform transition-all duration-300 ease-in-out md:translate-x-0 border-r border-slate-200 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto overscroll-contain [scrollbar-gutter:stable] [scrollbar-width:thin] p-4 md:p-6 pb-8 bg-gradient-to-b from-white via-slate-50 to-blue-50">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <h2 className={`
                font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300
                ${isSidebarOpen ? "block" : "hidden md:block"}
              `}>LEARNOVA</h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-slate-50 border border-slate-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <nav className="space-y-1">
            {GROUPS.map((item) => {
              const Icon = item.icon;
              const isActive = activeGroup?.id === item.id;
              const pending = pendingCounts[item.id];
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      navigate(pathOf(item.tabs[0].id));
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 min-h-[48px] group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02] border border-blue-500"
                        : "text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md border border-transparent hover:border-blue-200"
                    }`}
                    title={item.label}
                  >
                    <span className={`mr-4 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                    }`}>{<Icon className="w-5 h-5" />}</span>
                    <span className={`
                      flex w-full items-center gap-2 transition-all duration-300 font-medium
                      ${isSidebarOpen ? "" : "hidden md:flex"}
                    `}>
                      {item.label}
                      {pending > 0 && (
                        <span
                          title={`${pending} waiting for verification`}
                          className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                            isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {pending > 99 ? "99+" : pending}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* Tooltip for collapsed state */}
                  <div
                    className={`
                    absolute left-full top-1/2 transform -translate-y-1/2 ml-3
                    bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg
                    opacity-0 pointer-events-none transition-opacity duration-200 z-50
                    group-hover:opacity-100
                    ${isSidebarOpen ? "hidden" : "block md:hidden"}
                  `}
                  >
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-900"></div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 m-4 md:m-6 mb-0 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 md:hidden border border-slate-200"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <p className="text-slate-500 text-sm mb-2 font-medium">{schoolName || "Organization"} / Dashboard</p>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent capitalize">
                  {tabOf(GROUPS, activeTab)?.label || "Organization"}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => navigate("/organization-dashboard/alerts")}
                aria-label={alertsLoading ? "Open alerts" : `Open alerts (${totalNotifications} notifications)`}
                className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-slate-200 group relative"
              >
                <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                {totalNotifications > 0 && <span className="absolute -top-1 -right-1 min-w-5 rounded-full border border-white bg-red-500 px-1 text-center text-xs text-white">{totalNotifications > 99 ? "99+" : totalNotifications}</span>}
              </button>
              <button className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-slate-200 group">
                <Settings className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-slate-200"
                  aria-haspopup="true"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-50 text-blue-600 shadow-md" aria-label="Profile">
                    <User className="h-5 w-5" />
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>
                {/* Dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-3 z-20 border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        navigate(PROFILE_PATH);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg mx-2"
                    >
                      <User className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="font-medium">Edit Profile</span>
                    </button>
                    <div className="border-t border-slate-200 my-2"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 m-4 md:m-6 mt-0 p-6 md:p-8">
          <SectionTabs group={activeGroup} activeId={activeTab} onSelect={(id) => navigate(pathOf(id))} className="mb-6" />
          {!subscriptionLoaded ? (
            // Pages wait for the subscription answer: a locked school's page
            // would otherwise load data the API refuses.
            <StatCardsSkeleton label="Loading your school" />
          ) : locked ? (
            <section className="mx-auto max-w-lg space-y-4 rounded-xl bg-white p-8 text-center shadow-sm">
              <Lock className="mx-auto h-10 w-10 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Your subscription has expired</h2>
              <p className="text-gray-600">
                Renew to restore access. Teachers, students and parents can still view your school, but nobody can make changes.
              </p>
              <button type="button" onClick={() => navigate(BILLING_PATH)} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                Go to billing
              </button>
            </section>
          ) : (
            <Outlet context={{ alertsApi, pendingStaffApi, pendingStudentsApi }} />
          )}
        </main>
      </div>
    </div>
    </>
  );
};

export default OrganizationDashboard;
