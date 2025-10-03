import React from "react";
import { Mail, Lock, Check, BookOpen, GraduationCap } from "lucide-react";
import InputField from "@/components/ui/InputField";
import NotificationBar from "@/components/ui/NotificationBar";
import { useNavigate } from "react-router-dom";
import useLogin from "@/hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();

  // Role-based redirection logic
  const getRoleBasedRedirect = (user) => {
    if (!user) return "/home";

    // Support multiple possible backend flags for first-time login
    const isFirstTime = user.first_time_user === true;
    if (isFirstTime) {
      return "/select-user-type";
    }

    // Normalize roles: allow either user.role (string) or user.roles (array)
    let roles = [];
    if (Array.isArray(user.roles)) {
      roles = user.roles.map((r) => String(r.role?.code || r || "").toLowerCase());
    } else if (typeof user.role === "string") {
      roles = [String(user.role).toLowerCase()];
    }

    // Role precedence: super_admin > org_admin > teacher > student > parent > individual_learner
    const has = (r) => roles.includes(r);
    if (has("super_admin")) {
      return "/admin-dashboard/dashboard";
    }
    if (has("org_admin") || has("admin")) {
      return "/dashboard";
    }
    if (has("teacher")) {
      return "/teacher-dashboard";
    }
    if (has("student")) {
      return "/student-dashboard";
    }
    if (has("parent")) {
      return "/parent-dashboard";
    }
    if (has("individual_learner")) {
      return "/individual-learner-dashboard";
    }

    // Default fallback
    return "/home";
  };

  const {
    formData,
    rememberMe,
    loading,
    errors,
    loginAttempts,
    darkMode,
    isBlocked,
    blockTimeRemaining,
    inputRefs,
    handleInputChange,
    setRememberMe,
    handleSubmit,
    notification,
  } = useLogin({
    onSuccess: (response) => {
      const redirectPath = getRoleBasedRedirect(response.user);
      navigate(redirectPath, { replace: true });
    },
  });

  const handleToSignUp = () => {
    navigate("/signup");
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
      <NotificationBar
  show={notification.show}
  type={notification.type}
  message={notification.message}
  onClose={() => notification.setShow(false)}
/>

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
                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading || isBlocked}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                >
                  {loading ? <LoadingSpinner /> : isBlocked ? "Account Locked" : "Sign In"}
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
            {/* Security Status Display */}
            {isBlocked && blockTimeRemaining > 0 && (
              <div className={`mt-6 p-4 rounded-2xl border ${
                darkMode
                  ? "bg-red-900/20 border-red-800/50 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <span className="font-semibold">Account Temporarily Locked</span>
                </div>
                <p className="text-sm">
                  Too many failed login attempts. Please wait {Math.ceil(blockTimeRemaining / 60)} minutes before trying again.
                </p>
                <div className="mt-2 text-xs opacity-75">
                  Time remaining: {Math.floor(blockTimeRemaining / 60)}:{(blockTimeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )}

            {loginAttempts > 0 && !isBlocked && (
              <div className={`mt-4 p-3 rounded-xl border ${
                darkMode
                  ? "bg-yellow-900/20 border-yellow-800/50 text-yellow-300"
                  : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}>
                <p className="text-sm">
                  {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. 
                  {5 - loginAttempts} attempt{5 - loginAttempts !== 1 ? 's' : ''} remaining before temporary lockout.
                </p>
              </div>
            )}

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
