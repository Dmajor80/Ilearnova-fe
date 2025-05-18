import React, { useState } from "react";
import logo from "../assets/image 1.png";
import teacherIllustration from "../assets/78537603_9842877 1.png";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Left side - login form */}
      <div className="w-1/2 flex flex-col items-center justify-center px-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img src={logo} alt="iLearnova Logo" className="h-12" />
          </div>

          {/* Login text */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-center">
              Login to <span className="text-blue-600">Teacher Portal</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1 text-center">
              Enter account details
            </p>
          </div>

          {/* Form */}
          <form className="w-full">
            {/* Email input */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Enter email address</label>
              <input
                type="email"
                placeholder="priscilladaniel@gmail.com"
                className="w-full h-12 px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-500"
              />
            </div>

            {/* Password input */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Enter Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Priscilla Daniel"
                  className="w-full h-12 px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border border-gray-300 rounded mr-2"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember password
                </label>
              </div>
              <a href="#" className="text-sm text-red-500">
                Forgotten Password?
              </a>
            </div>

            {/* Login button */}
            <Link to="/teacher-dashboard">
              <button
                type="submit"
                className="w-full h-12 bg-gray-400 text-white rounded font-medium mb-4"
              >
                Login
              </button>
            </Link>

            {/* Sign up link */}
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600">
                Sign up
              </a>
            </div>
            {/* switch button */}
            <div className="flex items-center gap-[1rem] justify-center mt-[1rem]">
              <Link to="/login">
                <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
                  Teacher
                </button>
              </Link>
              <Link to="/student-login">
                <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
                  Student
                </button>
              </Link>
              <Link to="/parent-login">
                <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
                  Parent
                </button>
              </Link>
              <Link to="/Admin-login">
                <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
                  Admin
                </button>
              </Link>
            </div>
            {/* switch button */}
          </form>
        </div>
      </div>

      {/* Right side - illustration */}
      <div className="w-1/2 bg-yellow-100 flex items-center justify-center relative">
        <div className="bg-teal-500 absolute top-0 left-0 right-0 bottom-0 z-0">
          {/* Mathematical elements background would be here */}
        </div>
        <img
          src={teacherIllustration}
          alt="Teacher illustration"
          className="h-5/6 object-contain relative z-10"
        />
      </div>
    </div>
  );
};

export default LoginPage;
