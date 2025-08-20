import React, { useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const reasonMessage = (reason) => {
  switch (reason) {
    case "missing_token":
      return "Missing verification token. Please use the verification link sent to your email or request a new one.";
    case "invalid_or_expired":
      return "Your verification link is invalid or has expired. Please request a new verification email.";
    default:
      return "Email verification failed. Please try again or contact support.";
  }
};

const VerifyFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const statusParam = (params.get("status") || "").toLowerCase(); // typically "failed"
  const reason = (params.get("reason") || "").toLowerCase(); // "missing_token" | "invalid_or_expired"
  const email = params.get("email") || "";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-white to-orange-50 text-gray-800">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-red-100">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Verification Failed
            </h1>

            <p className="text-lg sm:text-xl mb-4 text-gray-600">
              {reasonMessage(reason)}
            </p>

            {email && (
              <p className="text-base mb-6">
                Email:
                <span className="ml-2 font-semibold text-blue-600 break-all">{email}</span>
              </p>
            )}
          </div>

          <div className="p-8 rounded-3xl bg-white/70 border border-white/50 shadow-xl backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gray-100 text-gray-800 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow"
              >
                Back to Signup
              </Link>
              <button
                onClick={() => navigate("/new-login")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow"
              >
                Go to Login
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              If you continue to experience issues, please request a new verification email from the signup page or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyFailure;
