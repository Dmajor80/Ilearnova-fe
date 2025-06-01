// import React, { useState } from "react";
import logo from "../assets/image 1.png";
import teacherIllustration from "../assets/78537603_9842877 1.png";
import { Link } from "react-router-dom";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Sparkles,
} from "lucide-react";


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Left side - login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8 lg:py-0 bg-white/80 backdrop-blur-sm">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <img
                src={logo}
                alt="iLearnova Logo"
                className="h-12 sm:h-16 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg"></div>
            </div>
          </div>

          {/* Login text */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h1>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
              Login to <span className="text-orange-600">Teacher Portal</span>
            </h2>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <GraduationCap className="w-4 h-4 text-orange-500" />
              Empowering minds, shaping futures
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
                      ? "border-orange-500 shadow-lg shadow-orange-500/25 bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "email" ? "ring-2 ring-orange-500/20" : ""
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
                      ? "border-orange-500 shadow-lg shadow-orange-500/25 bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-orange-600 transition-colors duration-200"
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
                    focusedField === "password"
                      ? "ring-2 ring-orange-500/20"
                      : ""
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
                  className="w-4 h-4 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
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
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                Access Teacher Portal
              </span>
            </button>

            {/* Sign up link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/signup"
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
              >
                Sign up here
              </Link>
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
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-amber-200 via-orange-200 to-red-200 flex items-center justify-center relative min-h-64 lg:min-h-screen order-first lg:order-last overflow-hidden">
        {/* Mathematical/Educational elements background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-400/30 to-teal-600/50">
          {/* Floating educational icons */}
          <div className="absolute top-16 left-12 animate-float">
            <BookOpen className="w-8 h-8 text-white/40" />
          </div>
          <div className="absolute top-32 right-20 animate-float-delayed">
            <GraduationCap className="w-10 h-10 text-white/30" />
          </div>
          <div className="absolute bottom-32 left-16 animate-float-slow">
            <Users className="w-6 h-6 text-white/50" />
          </div>
          <div className="absolute bottom-48 right-16 animate-bounce">
            <Award className="w-7 h-7 text-white/40" />
          </div>

          {/* Mathematical symbols */}
          <div className="absolute top-24 left-1/3 text-2xl text-white/20 font-bold animate-pulse">
            π
          </div>
          <div className="absolute bottom-40 left-1/4 text-3xl text-white/15 font-bold animate-pulse delay-1000">
            ∑
          </div>
          <div className="absolute top-40 right-1/3 text-xl text-white/25 font-bold animate-pulse delay-500">
            ∆
          </div>
          <div className="absolute bottom-24 right-1/4 text-2xl text-white/20 font-bold animate-pulse delay-1500">
            ∞
          </div>

          {/* Geometric shapes */}
          <div className="absolute top-20 left-20 w-12 h-12 border-2 border-white/20 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-20 right-24 w-8 h-8 bg-white/15 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-16 w-6 h-6 bg-white/20 transform rotate-12 animate-pulse delay-700"></div>
        </div>

        {/* Main illustration */}
        <div className="relative z-10 text-center">
          <img
            src={teacherIllustration}
            alt="Teacher illustration"
            className="h-48 sm:h-64 lg:h-96 object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
          <div className="mt-6 px-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Inspire & Educate
            </h3>
            <p className="text-sm text-gray-700 max-w-xs mx-auto">
              Access your teaching dashboard to manage classes, track student
              progress, and create engaging learning experiences.
            </p>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/30 to-transparent"></div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
