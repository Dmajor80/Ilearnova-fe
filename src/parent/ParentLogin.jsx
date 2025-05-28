// import React, { useState } from "react";
import logo from "../assets/image 1.png";
import teacherIllustration from "../assets/mother-son-spending-time-together 1.png";

import React, { useState } from "react";
import { Eye, EyeOff, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
const ParentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  // Using placeholder images since we can't access the actual files
  // const logo = "/api/placeholder/120/40";
  // const teacherIllustration = "/api/placeholder/400/500";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Left side - login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8 lg:py-0 bg-white/70 backdrop-blur-sm">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <img
                src={logo}
                alt="iLearnova Logo"
                className="h-12 sm:h-16 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg"></div>
            </div>
          </div>

          {/* Login text */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h1>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
              Login to <span className="text-blue-600">Parent Portal</span>
            </h2>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              Supporting your child's learning journey
            </p>
          </div>

          {/* Form */}
          <div className="w-full space-y-6">
            {/* Email input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  placeholder="priscilladaniel@gmail.com"
                  className={`w-full h-12 sm:h-14 px-4 py-3 bg-white border-2 rounded-xl text-gray-700 text-sm sm:text-base transition-all duration-300 focus:outline-none ${
                    focusedField === "email"
                      ? "border-blue-500 shadow-lg shadow-blue-500/25 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "email" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Password input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Enter your password"
                  className={`w-full h-12 sm:h-14 px-4 py-3 bg-white border-2 rounded-xl text-gray-700 text-sm sm:text-base pr-12 transition-all duration-300 focus:outline-none ${
                    focusedField === "password"
                      ? "border-blue-500 shadow-lg shadow-blue-500/25 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "password" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Remember password and Forgot password */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600 cursor-pointer"
                >
                  Remember password
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                Forgotten Password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Login to Portal
              </span>
            </button>

            {/* Sign up link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Sign up here
              </a>
            </div>

            {/* Switch buttons */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Or login as:
              </p>
              <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
                <Link to="/teacher-login">
                  <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-xs text-white hover:from-orange-600 hover:to-red-600 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ring-2 ring-orange-300">
                    Teacher
                  </button>
                </Link>
                <Link to="/student-login">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-xs text-white hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Student
                  </button>
                </Link>
                <Link to="/parent-login">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-xs text-white hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Parent
                  </button>
                </Link>
                <Link to="/admin-login">
                  <button className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-xs text-white hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Admin
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - illustration */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center relative min-h-64 lg:min-h-screen order-first lg:order-last overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-purple-400/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-24 left-20 w-12 h-12 bg-pink-400/20 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-8 w-8 h-8 bg-yellow-400/30 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-32 right-12 w-6 h-6 bg-green-400/30 rounded-full animate-bounce delay-1500"></div>
        </div>

        {/* Main illustration */}
        <div className="relative z-10 text-center">
          <img
            src={teacherIllustration}
            alt="Parent and child illustration"
            className="h-48 sm:h-64 lg:h-96 object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
          <div className="mt-6 px-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Track Your Child's Progress
            </h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              Stay connected with your child's educational journey and celebrate
              their achievements together.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default ParentLogin;
