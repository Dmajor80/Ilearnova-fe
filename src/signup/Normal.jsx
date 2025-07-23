import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
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

export default function Normal() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from user's system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    // In a real app, you'd use navigate from react-router-dom
    navigate("/signup");
  };

  useEffect(() => {
    setTimeout(() => inputRefs.current.username?.current?.focus(), 100);
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
        "https://api.ilearnova.com/api/auth/login/",
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

      // Store token if provided
      if (response.token || response.access_token) {
        const token = response.token || response.access_token;
        // Note: In Claude artifacts, localStorage isn't available, but this is the correct implementation
        const storage = rememberMe ? localStorage : sessionStorage;
        storage?.setItem("auth_token", token);

        if (response.user) {
          storage?.setItem("user_data", JSON.stringify(response.user));
        }
      }

      showNotificationMessage("Login successful! Welcome back!", "success");
      setLoginAttempts(0); // Reset attempts on success

      setTimeout(() => {
        // Redirect to dashboard
        navigate("/home");
      }, 2000);
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
  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
    showToggle = false,
  }) => {
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
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon
              className={`w-5 h-5 transition-colors ${
                darkMode
                  ? "text-gray-400 group-focus-within:text-blue-400"
                  : "text-gray-500 group-focus-within:text-blue-600"
              }`}
            />
          </div>
          <input
            ref={inputRefs.current[name]}
            id={name}
            name={name}
            type={showToggle ? (showPassword ? "text" : "password") : type}
            value={formData[name]}
            placeholder={placeholder}
            autoComplete={name === "username" ? "username" : "current-password"}
            onChange={(e) => handleInputChange(name, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (name === "username") {
                  inputRefs.current.password?.current?.focus();
                } else {
                  handleSubmit(e);
                }
              }
            }}
            className={`w-full pl-12 ${
              showToggle ? "pr-12" : "pr-4"
            } py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ease-in-out outline-none ${
              darkMode
                ? "bg-gray-800/50 text-white border-gray-600 placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
                : "bg-white text-gray-800 border-gray-200 placeholder-gray-500 focus:bg-blue-50/30 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
            } ${
              errors[name] ? "border-red-400 bg-red-50/30" : ""
            } hover:border-gray-400`}
            aria-invalid={errors[name] ? "true" : "false"}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
            disabled={loading}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff
                  className={`w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              ) : (
                <Eye
                  className={`w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
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
          ? "bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 text-white"
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

      {/* Dark Mode Toggle */}
      <button
        className="fixed top-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-white" />
        ) : (
          <Moon className="w-6 h-6 text-white" />
        )}
      </button>

      <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
        {/* Back Button */}
        <button
          onClick={() => console.log("Navigate to home")}
          className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 mb-8 ${
            darkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          } focus:outline-none focus:ring-4 focus:ring-blue-300`}
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Back to Home
        </button>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[600px]">
          {/* Form Section */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:text-left mb-10">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 mr-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                {/* Demo Credentials Helper */}
                <div
                  className={`p-4 rounded-xl ${
                    darkMode
                      ? "bg-blue-900/20 border border-blue-700/30"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    <strong>Demo credentials:</strong> username: demo, password:
                    password123
                  </p>
                </div>

                <InputField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  icon={Mail}
                />

                <InputField
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  icon={Lock}
                  showToggle={true}
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
                    onClick={() => console.log("Forgot password clicked")}
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
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>

              {/* Overlay Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Continue Learning</h3>
                <p className="text-lg opacity-90">
                  Access your courses, assignments, and connect with your
                  classmates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
