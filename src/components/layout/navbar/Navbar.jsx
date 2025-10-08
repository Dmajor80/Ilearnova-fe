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


  // Check authentication status using centralized http client
  useEffect(() => {
    const ac = new AbortController();
    const checkAuthStatus = async () => {
      try {
        const userData = await http.get("/api/auth/me", { signal: ac.signal });
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
    return () => ac.abort();
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  // Handle click outside to close menus
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserMenuOpen]);

  // Close mobile menu when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  // Handle logout using centralized http client
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
    console.log("Navigating to login page...");
    window.location.href = '/login';
  };

  const handleSignup = () => {
    console.log("Navigating to signup page...");
    window.location.href = '/signup';
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
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

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg ${
        scrolled ? "shadow-2xl border-b border-white/10" : ""
      } transition-all duration-300`}
    >
      <div className="mx-auto w-full px-4 sm:px-8 lg:px-12">
        <div className="relative flex h-16 items-center justify-between sm:h-20">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              className="relative inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
              type="button"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Toggle main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-10 w-10 rounded-full object-cover drop-shadow-lg"
                src={LOGO_URL}
                alt="School Portal"
              />
              {user?.organization?.name && (
                <span className="ml-3 text-lg font-semibold text-white hidden sm:block">
                  {user.organization.name}
                </span>
              )}
            </div>


            {/* Desktop navigation links */}
            <div className="hidden sm:ml-8 sm:block">
              <div className="flex items-center space-x-2">
                {!isAuthenticated && (
                  <>
                    {/* Modern Signup Button */}
                    <button
                      className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
                      onClick={handleSignup}
                    >
                      <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                      <span>Get Started</span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>

                    {/* Modern Login Button */}
                    <button
                      className="group relative inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
                      onClick={handleLogin}
                    >
                      <GraduationCap className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Sign In</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <a
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl cursor-pointer mr-2"
              href={`${CDN_BASE_URL}/1app/app-release.apk`}
            >
              <span>📱</span>
              Download App
            </a>
            {isAuthenticated && (
              <div className="relative ml-3 user-menu-container">
                <div>
                  <button
                    className="relative flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-800 p-1 transition-all duration-200 hover:scale-105"
                    type="button"
                    aria-expanded={isUserMenuOpen}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <ProfileAvatar user={user} />
                  </button>
                </div>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 focus:outline-none">
                    {/* User Info Header */}
                    <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-t-2xl">
                      <div className="flex items-center space-x-4">
                        <ProfileAvatar user={user} size="w-16 h-16" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {user?.first_name} {user?.last_name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            @{user?.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.email}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            {user?.is_verified ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                ⚠ Unverified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="px-6 py-4 max-h-64 overflow-y-auto">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Profile Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        {user?.phone_number && (
                          <div>
                            <span className="font-medium text-gray-600">Phone:</span>
                            <p className="text-gray-800">{user.phone_number}</p>
                          </div>
                        )}

                        {user?.address && (
                          <div>
                            <span className="font-medium text-gray-600">Address:</span>
                            <p className="text-gray-800">{user.address}</p>
                          </div>
                        )}

                        {user?.date_of_birth && (
                          <div>
                            <span className="font-medium text-gray-600">Date of Birth:</span>
                            <p className="text-gray-800">
                              {new Date(user.date_of_birth).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {user?.bio && (
                          <div>
                            <span className="font-medium text-gray-600">Bio:</span>
                            <p className="text-gray-800">{user.bio}</p>
                          </div>
                        )}

                        {user?.date_joined && (
                          <div>
                            <span className="font-medium text-gray-600">Member Since:</span>
                            <p className="text-gray-800">
                              {new Date(user.date_joined).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {user?.roles && user.roles.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600">Roles:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.roles.map((role, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="font-medium text-gray-600">User ID:</span>
                          <p className="text-xs text-gray-500 font-mono break-all">
                            {user?.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="border-t border-gray-200/50 py-2">
                      <button
                        className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/profile');
                        }}
                      >
                        <UserCircle className="mr-3 h-4 w-4" />
                        Edit Profile
                      </button>
                      <button
                        className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </button>
                      <button
                        className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-b-2xl"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[2147483647] transform overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity">
          <div
            className="mobile-menu-container fixed inset-y-0 left-0 z-[2147483646] flex w-80 transform flex-col bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl shadow-2xl transition-transform border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full object-cover drop-shadow-lg"
                  src={LOGO_URL}
                  alt="School Portal"
                />
              </div>
              <button
                className="rounded-xl p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-3 px-4 py-6">
              {!isAuthenticated ? (
                <>
                  {/* Mobile Modern Signup Button */}
                  <button
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 cursor-pointer"
                    onClick={() => {
                      handleSignup();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                    Get Started
                  </button>

                  {/* Mobile Modern Login Button */}
                  <button
                    className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 cursor-pointer"
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <GraduationCap className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    Sign In
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>

            {/* Mobile User Section */}
            {isAuthenticated && (
              <div className="border-t border-white/10 px-6 py-6">
                <div className="flex items-center space-x-4 mb-6">
                  <ProfileAvatar user={user} size="w-14 h-14" />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-white truncate">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-sm font-medium text-gray-300 truncate">
                      @{user?.username}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>

                {/* Mobile Profile Details */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 text-sm border border-white/10">
                  <h4 className="text-white font-semibold mb-3">Profile Info</h4>
                  <div className="space-y-2 text-gray-300">
                    {user?.phone_number && (
                      <div>
                        <span className="text-gray-400">Phone:</span> {user.phone_number}
                      </div>
                    )}
                    {user?.address && (
                      <div>
                        <span className="text-gray-400">Address:</span> {user.address}
                      </div>
                    )}
                    {user?.date_of_birth && (
                      <div>
                        <span className="text-gray-400">DOB:</span>{" "}
                        {new Date(user.date_of_birth).toLocaleDateString()}
                      </div>
                    )}
                    {user?.date_joined && (
                      <div>
                        <span className="text-gray-400">Joined:</span>{" "}
                        {new Date(user.date_joined).toLocaleDateString()}
                      </div>
                    )}
                    <div className="mt-3">
                      {user?.is_verified ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⚠ Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/profile');
                    }}
                  >
                    <UserCircle className="mr-3 h-5 w-5" />
                    Edit Profile
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
            <div className="px-4 py-4 mt-auto border-t border-white/10">
              <a
                className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer w-full"
                href={`${CDN_BASE_URL}/1app/app-release.apk`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-lg">📱</span>
                Download App
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
