import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

const InputField = React.memo(function InputField({
  label,
  name,
  type = "text",
  placeholder,
  nextField,
  icon: Icon,
  darkMode,
  errors,
  formData,
  inputRefs,
  handleChange,
  handleSubmit,
  showToggle = false,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = showToggle || type === "password";

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
        {label} <span className="text-red-500 ml-1">*</span>
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
          onChange={(e) => handleChange(name, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (nextField && inputRefs.current[nextField]) {
                inputRefs.current[nextField].current?.focus();
              } else {
                handleSubmit(e);
              }
            }
          }}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} ${
            isPassword ? "pr-12" : "pr-4"
          } py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ease-in-out outline-none ${
            darkMode
              ? "bg-gray-800/50 text-white border-gray-600 placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
              : "bg-white text-gray-800 border-gray-200 placeholder-gray-500 focus:bg-blue-50/30 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
          } ${errors[name] ? "border-red-400 bg-red-50/30" : ""} hover:border-gray-400`}
          aria-invalid={errors[name] ? "true" : "false"}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff
                className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              />
            ) : (
              <Eye
                className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              />
            )}
          </button>
        )}
      </div>
      {errors[name] && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-xs mt-2 flex items-center"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {errors[name]}
        </p>
      )}
    </div>
  );
});

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [darkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const inputRefs = useRef({
    username: React.createRef(),
    password: React.createRef(),
  });
  const navigate = useNavigate();
  const handleToSignUp = () => {
    navigate("/signup");
  };

  useEffect(() => {
    setTimeout(() => inputRefs.current.username?.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const prefill =
      sessionStorage.getItem("prefill_username") ||
      localStorage.getItem("prefill_username");
    if (prefill) {
      setFormData((prev) => ({ ...prev, username: prefill }));
    }
  }, []);

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitLogin = async (userData) => {
    try {
      // Simulated API call - replace with your actual endpoint
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Login failed";

        if (
          errorData.non_field_errors &&
          Array.isArray(errorData.non_field_errors)
        ) {
          errorMessage = errorData.non_field_errors[0];
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      // For demo purposes, simulate different responses
      if (userData.username === "demo" && userData.password === "password123") {
        return { token: "demo_token_12345", user: { id: 1, username: "demo" } };
      }
      throw new Error(error.message || "Network error");
    }
    // Simulate network delay
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rate limiting for failed attempts
    if (loginAttempts >= 3) {
      showNotificationMessage(
        "Too many failed attempts. Please wait before trying again.",
        "error"
      );
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const loginData = {
        username: formData.username,
        password: formData.password,
      };

      const response = await submitLogin(loginData);

      // Store tokens and user
      const storage = rememberMe ? localStorage : sessionStorage;
      const access = response.access || response.token || response.access_token;
      const refresh = response.refresh;
      if (access) {
        storage?.setItem("auth_access", access);
      }
      if (refresh) {
        storage?.setItem("auth_refresh", refresh);
      }
      if (response.user) {
        storage?.setItem("user_data", JSON.stringify(response.user));
        // Helpful prefill for subsequent forms
        if (response.user.username || response.user.email) {
          storage?.setItem(
            "prefill_username",
            response.user.username || response.user.email
          );
        }
      }

      setLoginAttempts(0); // Reset attempts on success

      // First-time onboarding
      if (response.user && response.user.first_time_user) {
        navigate("/select-user-type", { replace: true });
        return;
      }

      showNotificationMessage("Login successful! Welcome back!", "success");

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
      let notificationType = "error";
      let message = error.message;

      if (
        message.toLowerCase().includes("invalid credentials") ||
        message.toLowerCase().includes("incorrect password") ||
        message.toLowerCase().includes("user not found")
      ) {
        message =
          "Invalid username or password. Please check your credentials and try again.";
      } else if (message.toLowerCase().includes("account not verified")) {
        notificationType = "info";
        message = "Please verify your email address before logging in.";
      } else if (message.toLowerCase().includes("account disabled")) {
        message = "Your account has been disabled. Please contact support.";
      }

      showNotificationMessage(message, notificationType);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div
          className="absolute inset-0 w-6 h-6 border-3 border-transparent border-t-blue-200 rounded-full animate-spin"
          style={{ animationDelay: "0.15s" }}
        ></div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen w-full transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
      }`}
    >
      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl transform transition-all duration-500 ${
            notificationType === "success"
              ? "bg-green-500 text-white"
              : notificationType === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          } ${
            showNotification
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
          role="alert"
          aria-live="polite"
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
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}


      <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
        

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[600px]">
          {/* Form Section */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:text-left mb-10">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 mr-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h1 className={`text-4xl sm:text-5xl font-bold ${darkMode ? "text-white" : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"}`}>
                  Welcome Back
                </h1>
              </div>
              <p
                className={`text-lg sm:text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Sign in to continue your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-6">
                

                <InputField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  icon={Mail}
                  nextField="password"
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  inputRefs={inputRefs}
                  handleChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  disabled={loading}
                />

                <InputField
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  icon={Lock}
                  showToggle={true}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  inputRefs={inputRefs}
                  handleChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  disabled={loading}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      disabled={loading}
                    />
                    <span
                      className={`ml-2 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-all duration-200"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Attempts Warning */}
                {loginAttempts > 0 && (
                  <div className="text-center text-sm text-orange-600 dark:text-orange-400">
                    {3 - loginAttempts} attempt
                    {3 - loginAttempts !== 1 ? "s" : ""} remaining
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading || loginAttempts >= 3}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                >
                  {loading ? <LoadingSpinner /> : "Sign In"}
                </button>

                {/* Divider */}
                <div className="relative my-8">
                  <div
                    className={`absolute inset-0 flex items-center ${
                      darkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className={`px-4 ${
                        darkMode
                          ? "bg-gray-800/30 text-gray-400"
                          : "bg-white/70 text-gray-500"
                      }`}
                    >
                      New to our school?
                    </span>
                  </div>
                </div>

                {/* Signup Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleToSignUp}
                    className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    disabled={loading}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Create Account
                  </button>
                </div>
              </div>
            </form>

            {/* Additional Links */}
            <div className="text-center mt-8 space-y-2">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Having trouble signing in?{" "}
                <button
                  onClick={() => console.log("Contact support clicked")}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  type="button"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </div>

          {/* Image Section */}
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

              {/* Overlay Content */}
              <div className="absolute inset-0 flex items-end p-8 text-white">
                <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-tight">Continue Learning</h3>
                  </div>
                  <p className="text-sm sm:text-base text-white/90 mb-4">
                    Access your courses, track progress, and stay in sync with your classmates.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="px-3 py-1 text-xs rounded-full bg-white/15 border border-white/20">Personalized roadmap</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-white/15 border border-white/20">Assignments</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-white/15 border border-white/20">Messages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToSignUp}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                    >
                      Create Account
                    </button>
                    <div className="ml-auto flex items-center gap-2 text-white/90">
                      <Check className="w-5 h-5" />
                      <span className="text-xs">Fast, secure and reliable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
