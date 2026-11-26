import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/api/authApi";
import { clearAuth, getStoredUser } from "@/api/auth";
import { InitialsAvatar } from "@/components/ui/Avatar";
import Toaster from "@/components/ui/Toast";
import AdminFooter from "@/components/admin/AdminFooter";
import { getManagedSchool, stopManagingSchool } from "@/lib/manageSchool";

export const ADMIN_NAV = [
  { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "organizations", label: "Organizations", icon: Building2 },
  { to: "users", label: "Users", icon: Users },
  { to: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "emails", label: "Email Logs", icon: Mail },
  { to: "reports", label: "Reports", icon: FileBarChart },
  { to: "settings", label: "Settings", icon: Settings },
];

/** Header title (and breadcrumb) for the current admin path. */
export function adminPageTitle(pathname) {
  const rest = pathname.replace(/^\/admin-dashboard\/?/, "");
  const [section, sub] = rest.split("/");
  if (section === "users" && sub === "new-user") return { title: "Add user", parent: "Users" };
  if (section === "organizations" && sub) return { title: "School details", parent: "Organizations" };
  const item = ADMIN_NAV.find((n) => n.to === section);
  return { title: item?.label || "Dashboard", parent: null };
}

function displayName(user) {
  if (!user) return "Admin";
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || user.email || "Admin";
}

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const user = getStoredUser();
  const name = displayName(user);
  const { title, parent } = adminPageTitle(location.pathname);

  // Back in the platform area: stop acting as a school.
  useEffect(() => {
    if (getManagedSchool()) stopManagingSchool();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.title = `${title} · iLearnova admin`;
  }, [title]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setProfileOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {menuOpen && <div className="fixed inset-0 z-40 bg-slate-900/40 md:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          menuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white">I</span>
            <div>
              <p className="text-lg font-bold leading-tight text-blue-900">iLearnova</p>
              <p className="text-xs text-gray-500">Platform admin</p>
            </div>
          </div>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {ADMIN_NAV.map(({ to, label, icon: NavIcon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              {NavIcon && <NavIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />}
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-xs text-gray-500">Platform admin{parent ? ` / ${parent}` : ""}</p>
              <h1 className="truncate text-lg font-semibold text-gray-900 md:text-xl">{title}</h1>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-label="Account menu"
            >
              <InitialsAvatar name={name} size="h-9 w-9" />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight text-gray-900">{name}</span>
                <span className="block text-xs text-gray-500">Platform admin</span>
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
            </button>
            {profileOpen && (
              <div role="menu" className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
                <button role="menuitem" type="button" onClick={() => navigate("/admin-dashboard/settings")} className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="h-4 w-4" aria-hidden="true" /> Account settings
                </button>
                <button role="menuitem" type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-8">
          <AdminFooter />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
