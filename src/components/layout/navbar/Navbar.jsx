import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings, UserCircle, Sparkles, GraduationCap } from "lucide-react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { CDN_BASE_URL, LOGO_URL } from "../../../api/config";
import { http } from "../../../api/baseClient";
import { clearAuth } from "../../../api/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    const checkAuthStatus = async () => {
      try {
        const res = await http.get("/api/auth/profile/", { signal: ac.signal });
        // handle both axios-style {data: ...} and direct return
        const userData = res?.data ?? res;
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };
    checkAuthStatus();
    return () => ac.abort();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
      if (isUserMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, isUserMenuOpen]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  const handleLogout = async () => {
    try {
      await http.post("/api/auth/logout/");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      setIsUserMenuOpen(false);
      window.location.href = "/login";
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleSignup = () => {
    window.location.href = '/signup';
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // Helpers to safely extract names from object structures
  const getOrganizationName = () => {
    return user?.primary_role?.organization?.name || user?.organizations?.[0]?.name || user?.organizations?.[0]?.organization?.name || null;
  };

  const getPrimaryRoleName = () => {
    const r = user?.primary_role?.role;
    if (!r) return null;
    if (typeof r === 'string') return r;
    return r.display_name || r.name || r.title || null;
  };

  const ProfileAvatar = ({ user, size = "w-8 h-8" }) => {
    if (user?.profile_pic) {
      return (
        <img
          className={`${size} rounded-full object-cover border-2 border-white/20`}
          src={user.profile_pic}
          alt={`${user.first_name} ${user.last_name}`}
        />
      );
    }
    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20 shadow-lg`}
      >
        {getInitials(user?.first_name, user?.last_name)}
      </div>
    );
  };

  const orgName = getOrganizationName();
  const primaryRoleName = getPrimaryRoleName();

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg ${
        scrolled ? "shadow-2xl border-b border-white/10" : ""
      } transition-all duration-300`}
    >
      <div className="mx-auto w-full px-4 sm:px-8 lg:px-12">
        <div className="relative flex h-16 items-center justify-between sm:h-20">
          <div className="flex items-center sm:hidden">
            <button
              className="relative inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
              type="button"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Toggle main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img className="h-10 w-10 rounded-full object-cover drop-shadow-lg" src={LOGO_URL} alt="School Portal" />
              {orgName && (
                <span className="ml-3 text-lg font-semibold text-white hidden sm:block truncate max-w-[200px]">
                  {orgName}
                </span>
              )}
            </div>

            <div className="hidden sm:ml-8 sm:block">
              <div className="flex items-center space-x-2">
                {!isAuthenticated && (
                  <>
                    <button
                      className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700"
                      onClick={handleSignup}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Get Started</span>
                    </button>
                    <button
                      className="group relative inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                      onClick={handleLogin}
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>Sign In</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <a
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 mr-2"
              href={`${CDN_BASE_URL}/1app/app-release.apk`}
            >
              <span>📱</span> Download App
            </a>
            {isAuthenticated && (
              <div className="relative ml-3 user-menu-container">
                <button
                  className="relative flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/20 p-1 transition-all duration-200 hover:scale-105"
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <ProfileAvatar user={user} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5">
                    <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-t-2xl">
                      <div className="flex items-center space-x-4">
                        <ProfileAvatar user={user} size="w-16 h-16" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {user?.first_name} {user?.last_name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">@{user?.username}</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                          <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
                            {user?.is_verified ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                ⚠ Unverified
                              </span>
                            )}
                            {primaryRoleName && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                                {primaryRoleName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 max-h-64 overflow-y-auto">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Profile Details</h4>
                      <div className="space-y-3 text-sm">
                        {user?.phone_number && (
                          <div><span className="font-medium text-gray-600">Phone:</span><p className="text-gray-800">{user.phone_number}</p></div>
                        )}
                        {user?.address && (
                          <div><span className="font-medium text-gray-600">Address:</span><p className="text-gray-800">{typeof user.address === 'string' ? user.address : JSON.stringify(user.address)}</p></div>
                        )}
                        {user?.date_of_birth && (
                          <div><span className="font-medium text-gray-600">Date of Birth:</span><p className="text-gray-800">{new Date(user.date_of_birth).toLocaleDateString()}</p></div>
                        )}
                        {user?.bio && (
                          <div><span className="font-medium text-gray-600">Bio:</span><p className="text-gray-800">{typeof user.bio === 'string' ? user.bio : ''}</p></div>
                        )}
                        {user?.date_joined && (
                          <div><span className="font-medium text-gray-600">Member Since:</span><p className="text-gray-800">{new Date(user.date_joined).toLocaleDateString()}</p></div>
                        )}

                        {/* FIXED: Roles rendering */}
                        {user?.roles && user.roles.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600">Roles:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {user.roles.map((item, index) => {
                                // item can be object like {role: {name, display_name}, organization: {name}}
                                const roleName = typeof item === 'string' ? item : (item?.role?.display_name || item?.role?.name || item?.role?.title || item?.name || 'Role');
                                const org = item?.organization?.name;
                                return (
                                  <span
                                    key={item?.id || index}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                    title={org ? `${roleName} @ ${org}` : roleName}
                                  >
                                    {roleName}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* FIXED: Organizations rendering */}
                        {user?.organizations && user.organizations.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600">Organizations:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {user.organizations.map((orgItem, idx) => {
                                const name = typeof orgItem === 'string' ? orgItem : (orgItem?.name || orgItem?.organization?.name || 'Org');
                                return (
                                  <span key={orgItem?.id || idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                    {name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="font-medium text-gray-600">User ID:</span>
                          <p className="text-xs text-gray-500 font-mono break-all">{user?.id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200/50 py-2">
                      <button className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsUserMenuOpen(false); navigate('/profile'); }}>
                        <UserCircle className="mr-3 h-4 w-4" /> Edit Profile
                      </button>
                      <button className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        <Settings className="mr-3 h-4 w-4" /> Settings
                      </button>
                      <button className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="mr-3 h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="mobile-menu-container relative flex w-80 max-w-[85vw] flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
              <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full" src={LOGO_URL} alt="Logo" />
                  {orgName && <span className="ml-3 text-white font-semibold truncate">{orgName}</span>}
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2"><X className="h-6 w-6" /></button>
              </div>

              <div className="flex-1 space-y-3 px-4 py-6">
                {!isAuthenticated ? (
                  <>
                    <button className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-base font-semibold text-white" onClick={() => { handleSignup(); setIsMobileMenuOpen(false); }}>
                      <Sparkles className="h-5 w-5" /> Get Started
                    </button>
                    <button className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-base font-medium text-white" onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}>
                      <GraduationCap className="h-5 w-5" /> Sign In
                    </button>
                  </>
                ) : null}
              </div>

              {isAuthenticated && (
                <div className="border-t border-white/10 px-6 py-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <ProfileAvatar user={user} size="w-14 h-14" />
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-white truncate">{user?.first_name} {user?.last_name}</div>
                      <div className="text-sm font-medium text-gray-300 truncate">@{user?.username}</div>
                      <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                      {primaryRoleName && <div className="text-xs text-indigo-300 mt-1">{primaryRoleName}{orgName ? ` @ ${orgName}` : ''}</div>}
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 text-sm border border-white/10">
                    <h4 className="text-white font-semibold mb-3">Profile Info</h4>
                    <div className="space-y-2 text-gray-300">
                      {user?.phone_number && <div><span className="text-gray-400">Phone:</span> {user.phone_number}</div>}
                      {user?.address && <div><span className="text-gray-400">Address:</span> {typeof user.address === 'string' ? user.address : ''}</div>}
                      {user?.date_of_birth && <div><span className="text-gray-400">DOB:</span> {new Date(user.date_of_birth).toLocaleDateString()}</div>}
                      {user?.date_joined && <div><span className="text-gray-400">Joined:</span> {new Date(user.date_joined).toLocaleDateString()}</div>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 rounded-xl" onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }}>
                      <UserCircle className="mr-3 h-5 w-5" /> Edit Profile
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                      <Settings className="mr-3 h-5 w-5" /> Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="mr-3 h-5 w-5" /> Sign out
                    </button>
                  </div>
                </div>
              )}
              <div className="px-4 py-4 mt-auto border-t border-white/10">
                <a className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-medium text-white w-full" href={`${CDN_BASE_URL}/1app/app-release.apk`} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-lg">📱</span> Download App
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
};

export default Navbar;
