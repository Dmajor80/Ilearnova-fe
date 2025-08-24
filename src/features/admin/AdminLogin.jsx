import React, { useState } from "react";
import logo from "../../assets/image 1.png";
import teacherIllustration from "../../assets/girl-studying-university-library 1.png";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Left side - login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8 lg:py-0 bg-white lg:shadow-2xl relative z-10">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo with enhanced styling */}
          <div className="mb-8 flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <img
                src={logo}
                alt="iLearnova Logo"
                className="h-8 sm:h-10 filter brightness-0 invert"
              />
            </div>
          </div>

          {/* Login text with enhanced typography */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Admin{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-2 text-center font-medium">
              Secure administrative access
            </p>
          </div>

          {/* Form with enhanced styling */}
          <form className="w-full space-y-6">
            {/* Email input with modern design */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@ilearnova.com"
                  className="w-full h-12 sm:h-14 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 text-sm sm:text-base placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password input with enhanced design */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  className="w-full h-12 sm:h-14 px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 text-sm sm:text-base placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember password and Forgot password with enhanced styling */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 text-blue-600"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm font-medium text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Enhanced Login button */}
            <Link to="/dashboard">
              <button
                type="submit"
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Access Admin Portal
              </button>
            </Link>

            {/* Sign up link with enhanced styling */}
            <div className="text-center text-sm pt-4 border-t border-gray-200">
              <span className="text-gray-600">Need admin access? </span>
              <a
                href="/admin-signup"
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Request Access
              </a>
            </div>

            {/* Enhanced switch buttons */}
            <div className="pt-6">
              <p className="text-xs text-gray-500 text-center mb-3 font-medium">
                Switch Portal
              </p>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 justify-center">
                <Link to="/login">
                  <button className="w-full sm:w-20 h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs font-semibold text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    Teacher
                  </button>
                </Link>
                <Link to="/student-login">
                  <button className="w-full sm:w-20 h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs font-semibold text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    Student
                  </button>
                </Link>
                <Link to="/parent-login">
                  <button className="w-full sm:w-20 h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs font-semibold text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    Parent
                  </button>
                </Link>
                <Link to="/Admin-login">
                  <button className="w-full sm:w-20 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-semibold text-white rounded-lg shadow-md ring-2 ring-blue-200">
                    Admin
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - enhanced illustration */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative min-h-64 lg:min-h-screen order-first lg:order-last overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-400 rounded-full opacity-10 animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10 text-center max-w-md px-6">
          <img
            src={teacherIllustration}
            alt="Admin workspace illustration"
            className="h-48 sm:h-64 lg:h-80 object-contain mx-auto mb-6 drop-shadow-2xl"
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Administrative
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Control Center
            </span>
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Manage your educational platform with comprehensive administrative
            tools and analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
