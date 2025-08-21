/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  AlertCircle,
  Mail,
  Check,
  X,
  User,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      <div
        className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-blue-200 rounded-full animate-spin"
        style={{ animationDelay: "0.15s" }}
      ></div>
    </div>
    <span className="ml-3 font-medium">Creating Account...</span>
  </div>
);

const InputField = React.memo(function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  nextField,
  icon: Icon,
  darkMode,
  errors,
  formData,
  inputRefs,
  handleChange,
  handleSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="mb-6 group">
      <label
        htmlFor={name}
        className={`block text-sm font-semibold mb-3 transition-colors ${
          darkMode
            ? "text-gray-200 group-focus-within:text-blue-400"
            : "text-gray-700 group-focus-within:text-blue-600"
        }`}
      >
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon
              className={`w-5 h-5 transition-colors ${
                darkMode
                  ? "text-gray-400 group-focus-within:text-blue-400"
                  : "text-gray-500 group-focus-within:text-blue-600"
              }`}
            />
          </div>
        )}
        <input
          ref={inputRefs.current[name]}
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={formData[name]}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (nextField && inputRefs.current[nextField]) {
                inputRefs.current[nextField].current.focus();
              } else {
                handleSubmit(e);
              }
            }
          }}
          className={`w-full ${
            Icon ? "pl-12" : "pl-4"
          } ${isPassword ? "pr-12" : "pr-4"} py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ease-in-out outline-none ${
            darkMode
              ? "bg-gray-800/50 text-white border-gray-600 placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
              : "bg-white text-gray-800 border-gray-200 placeholder-gray-500 focus:bg-blue-50/30 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
          } ${
            errors[name] ? "border-red-400 bg-red-50/30" : ""
          } hover:border-gray-400`}
          aria-invalid={errors[name] ? "true" : "false"}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff
                className={`w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              />
            ) : (
              <Eye
                className={`w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              />
            )}
          </button>
        )}
      </div>
      {errors[name] && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-xs mt-2 flex items-center animate-pulse"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          {errors[name]}
        </p>
      )}
    </div>
  );
});

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [darkMode] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const inputRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    Object.keys(formData).forEach((key) => {
      if (!inputRefs.current[key]) {
        inputRefs.current[key] = React.createRef();
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 6000);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.username || !formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Confirm your password";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitSignup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Network error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const apiData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      await submitSignup(apiData);

      // Store user email and show verification screen
      setUserEmail(formData.email);
      setShowEmailVerification(true);
    } catch (error) {
      let notificationType = "error";
      let message = error.message;

      // Check for specific error patterns and customize notifications
      if (
        message.toLowerCase().includes("user with this email already exists")
      ) {
        notificationType = "info";
        message =
          "An account with this email already exists. Please try logging in instead.";
      } else if (
        message.toLowerCase().includes("already exists") ||
        message.toLowerCase().includes("already registered")
      ) {
        notificationType = "info";
        message = "You are already registered! Please login instead.";
      }

      showNotificationMessage(message, notificationType);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmail = () => {
    // Redirect to login page
    navigate("/login");
  };

  if (showEmailVerification) {
    return (
      <div
        className={`min-h-screen w-full transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Registration Successful!
                </h1>
                <p
                  className={`text-lg sm:text-xl mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Please check your email to verify your account.
                </p>
              </div>

              <div
                className={`p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 mb-8 ${
                  darkMode
                    ? "bg-gray-800/30 border border-gray-700/50"
                    : "bg-white/70 border border-white/50 shadow-xl"
                }`}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">
                  Verify Your Email Address
                </h2>

                <p
                  className={`text-base mb-4 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  We've sent a verification email to:
                </p>

                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-6 break-all">
                  {userEmail}
                </p>

                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } mb-8 space-y-2`}
                >
                  <p>
                    Please check your email and click the verification link to
                    activate your account.
                  </p>
                  <p>
                    Don't forget to check your spam/junk folder if you don't see
                    the email in your inbox.
                  </p>
                </div>

                <button
                  onClick={handleConfirmEmail}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
                >
                  I've Confirmed - Go to Login
                </button>
              </div>

              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Didn't receive the email?{" "}
                <button
                  onClick={() =>
                    showNotificationMessage(
                      "Verification email resent!",
                      "success"
                    )
                  }
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1 transition-all duration-200"
                >
                  Resend verification email
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
      }`}
    >
      {showNotification && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl transform transition-all duration-500 ${
            notificationType === "success"
              ? "bg-green-500 text-white"
              : notificationType === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          } animate-bounce`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notificationType === "success" ? (
                <Check className="w-6 h-6 mt-0.5" />
              ) : notificationType === "error" ? (
                <X className="w-6 h-6 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 mt-0.5" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <span className="font-semibold text-sm leading-relaxed">
                {notificationMessage}
              </span>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-2 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          <div className="w-full">
            <div className="text-center lg:text-left mb-10">
              <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"}`}>
                Join Our School
              </h1>
              <p
                className={`text-lg sm:text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Create your account and start your learning journey
              </p>
            </div>

            <div
              className={`p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 ${
                darkMode
                  ? "bg-gray-800/30 border border-gray-700/50"
                  : "bg-white/70 border border-white/50 shadow-xl"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="Enter your first name"
                    required
                    nextField="lastName"
                    icon={User}
                    darkMode={darkMode}
                    errors={errors}
                    formData={formData}
                    inputRefs={inputRefs}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter your last name"
                    required
                    nextField="username"
                    icon={User}
                    darkMode={darkMode}
                    errors={errors}
                    formData={formData}
                    inputRefs={inputRefs}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
                
                <InputField
                  label="Username"
                  name="username"
                  placeholder="Choose a username"
                  required
                  nextField="email"
                  icon={User}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  inputRefs={inputRefs}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
                
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  nextField="password"
                  icon={Mail}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  inputRefs={inputRefs}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
                
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                  nextField="passwordConfirm"
                  icon={Lock}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  inputRefs={inputRefs}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
                
                <InputField
                  label="Confirm Password"
                  name="passwordConfirm"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  icon={Lock}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  inputRefs={inputRefs}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
                >
                  {loading ? <LoadingSpinner /> : "Create Account"}
                </button>
              </form>
            </div>

            <p
              className={`text-center mt-8 text-base ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
              <Link to="/login">
                <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-all duration-200">
                  Login here
                </button>
              </Link>
            </p>
          </div>

          <div className="hidden lg:block w-full">
            <div className="relative">
              <div
                className="w-full h-[600px] bg-cover bg-center rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
