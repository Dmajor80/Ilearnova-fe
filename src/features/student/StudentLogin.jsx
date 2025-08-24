import logo from "../../assets/image 1.png";
import teacherIllustration from "../../assets/image 2.png";

import React, { useState, useEffect } from "react";

const StudentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left side - login form */}
      <div
        className={`w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-8 lg:px-10 py-8 lg:py-0 transition-all duration-1000 ease-out transform ${
          isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div
            className={`mb-6 flex justify-center transition-all duration-800 delay-200 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "-translate-y-8 opacity-0"
            }`}
          >
            <img src={logo} alt="" />
          </div>

          {/* Login text */}
          <div
            className={`mb-6 transition-all duration-800 delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-xl sm:text-2xl font-medium text-center">
              Login to{" "}
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Student Portal
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1 text-center">
              Enter account details
            </p>
          </div>

          {/* Form */}
          <div
            className={`w-full transition-all duration-800 delay-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Email input */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700 font-medium">
                Enter email address
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedInput === "email" ? "transform scale-105" : ""
                }`}
              >
                <input
                  type="email"
                  placeholder="priscilladaniel@gmail.com"
                  className={`w-full h-12 px-3 py-2 bg-gray-50 border-2 rounded-lg text-gray-700 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-100 ${
                    focusedInput === "email"
                      ? "border-blue-500 bg-white shadow-lg"
                      : "border-gray-300"
                  }`}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700 font-medium">
                Enter Password
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedInput === "password" ? "transform scale-105" : ""
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Priscilla Daniel"
                  className={`w-full h-12 px-3 py-2 pr-12 bg-gray-50 border-2 rounded-lg text-gray-700 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-100 ${
                    focusedInput === "password"
                      ? "border-blue-500 bg-white shadow-lg"
                      : "border-gray-300"
                  }`}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-all duration-200 hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember password and Forgot password */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border border-gray-300 rounded cursor-pointer mr-2 transition-transform duration-200 hover:scale-110 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 select-none"
                >
                  Remember password
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200 hover:underline"
              >
                Forgotten Password?
              </a>
            </div>

            {/* Login button */}
            <button
              onClick={() => (window.location.href = "/student-dashboard")}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-medium mb-4 transition-all duration-300 hover:from-blue-700 hover:to-teal-600 hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Login
            </button>

            {/* Sign up link */}
            <div className="text-center text-sm mb-6">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline font-medium"
              >
                Sign up
              </a>
            </div>

            {/* Switch buttons */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-2 sm:gap-4">
              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full sm:w-20 h-8 bg-green-600 text-xs text-white rounded transition-all duration-300 hover:bg-green-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Teacher
              </button>
              <button
                onClick={() => (window.location.href = "/student-login")}
                className="w-full sm:w-20 h-8 bg-green-600 text-xs text-white rounded transition-all duration-300 hover:bg-green-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Student
              </button>
              <button
                onClick={() => (window.location.href = "/parent-login")}
                className="w-full sm:w-20 h-8 bg-green-600 text-xs text-white rounded transition-all duration-300 hover:bg-green-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Parent
              </button>
              <button
                onClick={() => (window.location.href = "/Admin-login")}
                className="w-full sm:w-20 h-8 bg-green-600 text-xs text-white rounded transition-all duration-300 hover:bg-green-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - illustration */}
      <div
        className={`w-full lg:w-1/2 min-h-64 lg:min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center relative overflow-hidden transition-all duration-1000 ease-out transform ${
          isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600">
          {/* Floating mathematical elements */}
          <div
            className="absolute top-10 left-10 text-white text-2xl opacity-20 animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          >
            π
          </div>
          <div
            className="absolute top-20 right-16 text-white text-xl opacity-20 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          >
            ∑
          </div>
          <div
            className="absolute bottom-20 left-20 text-white text-lg opacity-20 animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "3.5s" }}
          >
            √
          </div>
          <div
            className="absolute bottom-32 right-12 text-white text-2xl opacity-20 animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "2.8s" }}
          >
            ∆
          </div>
          <div
            className="absolute top-1/2 left-8 text-white text-xl opacity-20 animate-bounce"
            style={{ animationDelay: "1.5s", animationDuration: "3.2s" }}
          >
            ∞
          </div>
          <div
            className="absolute top-1/3 right-20 text-white text-lg opacity-20 animate-bounce"
            style={{ animationDelay: "2.5s", animationDuration: "4.2s" }}
          >
            α
          </div>
        </div>

        {/* Teacher illustration placeholder */}
        <div
          className={`relative z-10 transition-all duration-1000 delay-600 ${
            isLoaded ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <div className="w-64 h-80 sm:w-80 sm:h-96 bg-gradient-to-b from-blue-200 to-blue-300 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* Teacher figure */}
            <div className="relative">
              {/* Head */}
              <img src={teacherIllustration} alt="" />
            </div>

            {/* Floating books animation */}
            <div
              className="absolute top-4 right-4 w-8 h-6 bg-red-400 rounded animate-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute top-12 right-8 w-6 h-4 bg-green-400 rounded animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-16 left-4 w-7 h-5 bg-yellow-400 rounded animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
