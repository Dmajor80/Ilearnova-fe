import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";

const VerifySuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const statusParam = (params.get("status") || "").toLowerCase();
  const reason = (params.get("reason") || "").toLowerCase();
  const email = params.get("email") || "";

  const isAlreadyVerified = reason === "already_verified";

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          navigate("/new-login", { replace: true });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-green-100">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Email Verified
            </h1>

            <p className="text-lg sm:text-xl mb-4 text-gray-600">
              {isAlreadyVerified
                ? "Your email was already verified. You can log in now."
                : "Your email has been successfully verified. You can now log in."}
            </p>

            {email && (
              <p className="text-base mb-6">
                Verified address:
                <span className="ml-2 font-semibold text-blue-600 break-all">{email}</span>
              </p>
            )}
          </div>

          <div className="p-8 rounded-3xl bg-white/70 border border-white/50 shadow-xl backdrop-blur-lg">
            <div className="flex items-center justify-center gap-3 text-gray-600 mb-6">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Redirecting to the login page in {seconds}s...</span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
            >
              Continue to Login Now
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Not redirected?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none rounded px-1 py-1"
            >
              Click here
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccess;
