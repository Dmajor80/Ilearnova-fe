import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, X, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/baseClient";

const OtpInput = ({ value, onChange, onComplete, disabled, darkMode }) => {
  const inputsRef = useRef([]);
  const length = 6;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, val) => {
    const sanitized = val.replace(/\D/g, "");
    if (!sanitized) {
      onChange((prev) => {
        const arr = prev.split("");
        arr[index] = "";
        return arr.join("");
      });
      return;
    }

    onChange((prev) => {
      const arr = prev.split("");
      sanitized.split("").forEach((digit, i) => {
        if (index + i < length) {
          arr[index + i] = digit;
        }
      });
      const joined = arr.join("");
      // Auto focus next
      const nextIndex = Math.min(index + sanitized.length, length - 1);
      inputsRef.current[nextIndex]?.focus();

      if (joined.length === length && !joined.includes("")) {
        onComplete && onComplete(joined);
      }
      return joined;
    });
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (index, e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange((prev) => {
      const arr = prev.split("");
      for (let i = 0; i < text.length; i++) {
        if (index + i < length) arr[index + i] = text[i];
      }
      const joined = arr.join("");
      const nextIndex = Math.min(index + text.length, length - 1);
      inputsRef.current[nextIndex]?.focus();
      if (joined.length === length && !joined.includes("")) {
        onComplete && onComplete(joined);
      }
      return joined;
    });
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 mt-2 mb-4">
      {new Array(length).fill(0).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          disabled={disabled}
          className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-xl border-2 outline-none transition-all ${
            darkMode
              ? "bg-gray-800/50 text-white border-gray-600 focus:border-blue-500"
              : "bg-white text-gray-800 border-gray-200 focus:border-blue-600"
          }`}
        />
      ))}
    </div>
  );
};

export default function VerifyOtp() {
  const [darkMode] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [otp, setOtp] = useState(new Array(6).fill("").join(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const navigate = useNavigate();

  const email = useMemo(
    () => sessionStorage.getItem("otp_email") || "",
    []
  );

  useEffect(() => {
    if (!email) {
      // If no email in session, return to forgot
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const notify = (message, type = "success", timeout = 5000) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), timeout);
  };

  const validate = () => {
    const errs = {};
    if (!otp || otp.length !== 6 || /\D/.test(otp)) {
      errs.otp = "Enter the 6-digit code sent to your email";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitVerify = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const data = await http.post("/api/verify-otp/", {
        body: { email, otp },
        auth: false,
      });

      const prefillEmail = data?.prefill?.email || email;
      const prefillUsername = data?.prefill?.username || email;

      if (prefillEmail) {
        sessionStorage.setItem("otp_email", prefillEmail);
      }
      if (prefillUsername) {
        sessionStorage.setItem("prefill_username", prefillUsername);
        localStorage.setItem("prefill_username", prefillUsername);
      }
      if (data?.reset_token) {
        sessionStorage.setItem("reset_token", data.reset_token);
      }

      const redirect = data?.redirect || "/reset-password";
      notify("Verification successful. Please set a new password.", "success", 1500);
      setTimeout(() => {
        navigate(redirect, { replace: true });
      }, 600);
    } catch (e) {
      notify(e.message || "Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return;
    setResending(true);
    try {
      await http.post("/api/resend-otp/", {
        body: { email },
        auth: false,
      });
      notify("OTP resent. Please check your email.", "success", 3000);
    } catch (e) {
      notify(e.message || "Network error", "error");
    } finally {
      setResending(false);
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1
              className={`text-4xl sm:text-5xl font-bold ${
                darkMode
                  ? "text-white"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              }`}
            >
              Enter Verification Code
            </h1>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-3`}>
              We sent a 6-digit code to
              <span className="font-semibold ml-2">{email}</span>
            </p>
          </div>

          <div
            className={`p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 max-w-xl mx-auto ${
              darkMode
                ? "bg-gray-800/30 border border-gray-700/50"
                : "bg-white/70 border border-white/50 shadow-xl"
            }`}
          >
            <label className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              6-digit code
            </label>

            <OtpInput
              value={otp}
              onChange={(v) => setOtp(v)}
              onComplete={() => {}}
              disabled={loading}
              darkMode={darkMode}
            />

            {errors.otp && (
              <p className="text-red-500 text-xs -mt-1 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.otp}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 mb-6">
              <button
                type="button"
                onClick={submitVerify}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                  </span>
                ) : (
                  "Verify Code"
                )}
              </button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={resending}
                className={`px-6 py-3 rounded-2xl font-semibold border-2 transition-all ${
                  darkMode
                    ? "border-gray-600 text-gray-200 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="inline-flex items-center gap-2">
                  {resending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                  Resend OTP
                </span>
              </button>
            </div>

            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Wrong email?{" "}
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none rounded px-1 py-1"
              >
                Change email
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
