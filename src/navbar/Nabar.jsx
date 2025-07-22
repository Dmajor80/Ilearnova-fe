import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings, UserCircle } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status using your API
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Fetch user profile data from your API
          const response = await fetch(
            "https://api.ilearnova.com/api/auth/profile/",
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("authToken");
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Clear invalid token on error
        localStorage.removeItem("authToken");
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add scroll listener for shadow effect
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

  // Handle logout using your API
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Call logout API endpoint
        await fetch("https://api.ilearnova.com/api/auth/logout/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local state regardless of API call result
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
      setIsUserMenuOpen(false);
      // Redirect to login page or home
      window.location.href = "/login";
    }
  };

  // Handle navigation to login page
  const handleLogin = () => {
    // Navigate to login page - replace with your actual navigation logic
    console.log("Navigating to login page...");
    // window.location.href = '/login';
    // or if using React Router: navigate('/login');
  };

  // Handle navigation to signup page
  const handleSignup = () => {
    // Navigate to signup page - replace with your actual navigation logic
    console.log("Navigating to signup page...");
    // window.location.href = '/signup';
    // or if using React Router: navigate('/signup');
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
          className={`${size} rounded-full object-cover`}
          src={user.profile_pic}
          alt={`${user.first_name} ${user.last_name}`}
        />
      );
    }

    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm`}
      >
        {getInitials(user?.first_name, user?.last_name)}
      </div>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${
        scrolled ? "shadow-xl" : ""
      } transition-shadow duration-300`}
    >
      <div className="mx-auto w-full px-2 sm:px-10 lg:px-20">
        <div className="relative flex h-16 items-center justify-between sm:h-20">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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

          {/* Logo - centered on mobile, left-aligned on desktop */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-10 w-16"
                src="https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png"
                alt="Your Company"
              />
            </div>

            {/* Desktop navigation links */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {!isAuthenticated ? (
                  <>
                    <button
                      className="text-white hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                      onClick={handleSignup}
                    >
                      Signup
                    </button>
                    <button
                      className="text-white hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <a
                    className="text-white hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                    href="https://trenova.nyc3.cdn.digitaloceanspaces.com/1app/app-release.apk"
                  >
                    Download App
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isAuthenticated && (
              <div className="relative ml-3 user-menu-container">
                <div>
                  <button
                    className="relative flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 p-1"
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
                  <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* User Info Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
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
                          <div className="flex items-center space-x-2 mt-1">
                            {user?.is_verified ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
                            <span className="font-medium text-gray-600">
                              Phone:
                            </span>
                            <p className="text-gray-800">{user.phone_number}</p>
                          </div>
                        )}

                        {user?.address && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Address:
                            </span>
                            <p className="text-gray-800">{user.address}</p>
                          </div>
                        )}

                        {user?.date_of_birth && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Date of Birth:
                            </span>
                            <p className="text-gray-800">
                              {new Date(
                                user.date_of_birth
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {user?.bio && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Bio:
                            </span>
                            <p className="text-gray-800">{user.bio}</p>
                          </div>
                        )}

                        {user?.date_joined && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Member Since:
                            </span>
                            <p className="text-gray-800">
                              {new Date(user.date_joined).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {user?.roles && user.roles.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Roles:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.roles.map((role, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="font-medium text-gray-600">
                            User ID:
                          </span>
                          <p className="text-xs text-gray-500 font-mono break-all">
                            {user?.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="border-t border-gray-200 py-2">
                      <button
                        className="flex items-center w-full px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircle className="mr-3 h-4 w-4" />
                        Edit Profile
                      </button>
                      <button
                        className="flex items-center w-full px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </button>
                      <button
                        className="flex items-center w-full px-6 py-2 text-sm text-red-700 hover:bg-red-50"
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

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 transform overflow-hidden bg-black bg-opacity-50 transition-opacity">
          <div
            className="mobile-menu-container fixed inset-y-0 left-0 flex w-64 transform flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-auto"
                  src="https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png"
                  alt="Your Company"
                />
              </div>
              <button
                className="rounded-md p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-1 px-2 py-3">
              {!isAuthenticated ? (
                <>
                  <button
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-600"
                    onClick={() => {
                      handleSignup();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Signup
                  </button>
                  <button
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-600"
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                </>
              ) : (
                <a
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-600"
                  href="https://trenova.nyc3.cdn.digitaloceanspaces.com/1app/app-release.apk"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Download App
                </a>
              )}
            </div>

            {/* Mobile User Section */}
            {isAuthenticated && (
              <div className="border-t border-white border-opacity-20 px-4 py-4">
                <div className="flex items-center space-x-3 mb-4">
                  <ProfileAvatar user={user} size="w-12 h-12" />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium text-white truncate">
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
                <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4 text-sm">
                  <h4 className="text-white font-semibold mb-2">
                    Profile Info
                  </h4>
                  <div className="space-y-2 text-gray-300">
                    {user?.phone_number && (
                      <div>
                        <span className="text-gray-400">Phone:</span>{" "}
                        {user.phone_number}
                      </div>
                    )}
                    {user?.address && (
                      <div>
                        <span className="text-gray-400">Address:</span>{" "}
                        {user.address}
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
                    <div className="mt-2">
                      {user?.is_verified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                          ⚠ Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircle className="mr-3 h-4 w-4" />
                    Edit Profile
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-md"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
