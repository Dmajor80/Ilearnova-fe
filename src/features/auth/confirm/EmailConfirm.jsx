import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const EmailConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const email = params.get("email") || "";
  const role = (params.get("role") || "").toLowerCase();
  const statusParam = (params.get("status") || "").toLowerCase();
  const errorParam = params.get("error");

  // If the server already verified the email before redirecting here,
  // default to success unless an explicit error is provided.
  const isSuccess = useMemo(() => {
    if (errorParam) return false;
    if (!statusParam) return true;
    return statusParam === "success" || statusParam === "verified" || statusParam === "ok";
  }, [errorParam, statusParam]);

  const redirectPath = useMemo(() => {
    switch (role) {
      case "student":
        return "/student-login";
      case "parent":
        return "/parent-login";
      case "teacher":
        return "/login";
      case "admin":
        return "/Admin-login";
      default:
        return "/new-login";
    }
  }, [role]);

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          navigate(redirectPath, { replace: true });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSuccess, navigate, redirectPath]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                isSuccess ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-red-600" />
              )}
            </div>

            <h1
              className={`text-4xl sm:text-5xl font-bold mb-4 ${
                isSuccess
                  ? "bg-gradient-to-r from-green-600 to-blue-600"
                  : "bg-gradient-to-r from-red-600 to-orange-600"
              } bg-clip-text text-transparent`}
            >
              {isSuccess ? "Email Verified" : "Verification Failed"}
            </h1>

            <p className="text-lg sm:text-xl mb-6 text-gray-600">
              {isSuccess
                ? "Your email has been successfully verified."
                : "We couldn't verify your email. Please try again or contact support."}
            </p>

            {email && (
              <p className="text-base mb-6">
                Verified address:
                <span className="ml-2 font-semibold text-blue-600 break-all">{email}</span>
              </p>
            )}
          </div>

          <div className="p-8 rounded-3xl bg-white/70 border border-white/50 shadow-xl backdrop-blur-lg">
            {isSuccess ? (
              <>
                <div className="flex items-center justify-center gap-3 text-gray-600 mb-6">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span>Redirecting to the login page in {seconds}s...</span>
                </div>
                <button
                  onClick={() => navigate(redirectPath)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
                >
                  Continue to Login Now
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  If this issue persists, you can request a new verification email from the
                  signup page or try logging in if you're already verified.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-gray-100 text-gray-800 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow"
                  >
                    Go to Signup
                  </Link>
                  <button
                    onClick={() => navigate(redirectPath)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            )}
          </div>

          {isSuccess && (
            <p className="text-sm text-gray-500 mt-6">
              Not redirected?{" "}
              <button
                onClick={() => navigate(redirectPath)}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none rounded px-1 py-1"
              >
                Click here
              </button>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirm;
