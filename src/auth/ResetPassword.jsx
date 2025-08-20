import React, { useEffect, useRef, useState } from "react";
import { Lock, AlertCircle, Check, X, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PasswordField = React.memo(function PasswordField({
  label,
  name,
  placeholder,
  darkMode,
  value,
  onChange,
  error,
  onEnter,
  inputRef,
  disabled = false,
}) {
  const [show, setShow] = useState(false);
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
          <Lock
            className={`w-5 h-5 transition-colors ${
              darkMode
                ? "text-gray-400 group-focus-within:text-blue-400"
                : "text-gray-500 group-focus-within:text-blue-600"
            }`}
          />
        </div>
        <input
          ref={inputRef}
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) {
              e.preventDefault();
              onEnter();
            }
          }}
          className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ease-in-out outline-none ${
            darkMode
              ? "bg-gray-800/50 text-white border-gray-600 placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
              : "bg-white text-gray-800 border-gray-200 placeholder-gray-500 focus:bg-blue-50/30 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
          } ${error ? "border-red-400 bg-red-50/30" : ""} hover:border-gray-400`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          ) : (
            <Eye className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          )}
        </button>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-xs mt-2 flex items-center" role="alert">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

export default function ResetPassword() {
  const [darkMode] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const passRef = useRef(null);
  const confirmRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("reset_token");
    if (!token) {
      navigate("/verify-otp", { replace: true });
      return;
    }
    setTimeout(() => passRef.current?.focus(), 100);
  }, [navigate]);

  const notify = (message, type = "success", timeout = 5000) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), timeout);
  };

  const validate = () => {
    const errs = {};
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!passwordConfirm) {
      errs.passwordConfirm = "Confirm your new password";
    } else if (password !== passwordConfirm) {
      errs.passwordConfirm = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitReset = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    const resetToken = sessionStorage.getItem("reset_token");

    try {
      const payload = {
        reset_token: resetToken,
        new_password: password,
        confirm_password: passwordConfirm,
      };

      const res = await fetch(`${API_BASE_URL}/api/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data.detail || data.message || data.error || "Failed to reset password. Please try again.";
        throw new Error(msg);
      }

      // Cleanup and redirect to login with prefilled username
      const prefill =
        sessionStorage.getItem("prefill_username") ||
        sessionStorage.getItem("otp_email") ||
        "";
      if (prefill) {
        localStorage.setItem("prefill_username", prefill);
        sessionStorage.setItem("prefill_username", prefill);
      }
      sessionStorage.removeItem("otp_code");
      sessionStorage.removeItem("reset_token");

      notify("Password reset successful. Redirecting to login...", "success", 2000);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (e) {
      notify(e.message || "Network error", "error");
    } finally {
      setLoading(false);
    }
  };

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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 mb-8 ${
            darkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          } focus:outline-none focus:ring-4 focus:ring-blue-300`}
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Back
        </button>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[560px]">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:text-left mb-10">
              <h1
                className={`text-4xl sm:text-5xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                }`}
              >
                Set New Password
              </h1>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-3`}>
                Choose a strong password to secure your account.
              </p>
            </div>

            <div
              className={`p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 ${
                darkMode
                  ? "bg-gray-800/30 border border-gray-700/50"
                  : "bg-white/70 border border-white/50 shadow-xl"
              }`}
            >
              <PasswordField
                label="New Password"
                name="password"
                placeholder="Minimum 8 characters"
                darkMode={darkMode}
                value={password}
                onChange={setPassword}
                error={errors.password}
                onEnter={() => confirmRef.current?.focus()}
                inputRef={passRef}
                disabled={loading}
              />

              <PasswordField
                label="Confirm New Password"
                name="passwordConfirm"
                placeholder="Re-enter your password"
                darkMode={darkMode}
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                error={errors.passwordConfirm}
                onEnter={submitReset}
                inputRef={confirmRef}
                disabled={loading}
              />

              <button
                type="button"
                onClick={submitReset}
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Updating password...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-full">
            <div className="relative">
              <div
                className="w-full h-[560px] bg-cover bg-center rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl"></div>
              <div className="absolute inset-0 flex items-end p-8 text-white">
                <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 shadow-2xl">
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    Keep your account secure
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 mt-2">
                    Use a unique password with a mix of letters, numbers and symbols. Avoid reusing old passwords.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
}
