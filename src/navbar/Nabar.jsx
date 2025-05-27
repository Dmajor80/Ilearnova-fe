import React, { useState, useEffect } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-gold ${
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
                <Link
                  className="text-white hover:bg-powderblue hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                  to="/signup"
                >
                  Signup
                </Link>
                <Link
                  className="text-white hover:bg-powderblue hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="text-white hover:bg-powderblue hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                  to="https://trenova.nyc3.cdn.digitaloceanspaces.com/1app/app-release.apk"
                >
                  Download App
                </Link>
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3 user-menu-container">
              <div>
                <button
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  type="button"
                  aria-expanded={isUserMenuOpen}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 transform overflow-hidden bg-black bg-opacity-50 transition-opacity">
          <div
            className="mobile-menu-container fixed inset-y-0 left-0 flex w-64 transform flex-col bg-gold shadow-xl transition-transform"
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
              <Link
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-powderblue hover:text-white"
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Signup
              </Link>
              <Link
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-powderblue hover:text-white"
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-powderblue hover:text-white"
                to="https://trenova.nyc3.cdn.digitaloceanspaces.com/1app/app-release.apk"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Download App
              </Link>
            </div>
            <div className="border-t border-white border-opacity-20 px-4 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    User Name
                  </div>
                  <div className="text-sm font-medium text-gray-300">
                    user@example.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
