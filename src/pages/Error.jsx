import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";

export default function Error() {
  const location = useLocation();
  const navigate = useNavigate();
  const darkMode = usePrefersDarkMode();

  return (
    <div
      className={`min-h-screen w-full transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 py-16">
        <div className="max-w-3xl mx-auto">
          <div
            className={`rounded-3xl p-10 text-center ${
              darkMode
                ? "bg-black/40 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                : "bg-white shadow-2xl border border-slate-100"
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold">
                Error 404
              </div>
            </div>

            <h1
              className={`text-4xl sm:text-5xl font-extrabold mb-4 ${
                darkMode
                  ? "text-white"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              }`}
            >
              Page not found
            </h1>

            <p
              className={`mb-6 text-base sm:text-lg ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              The requested path{" "}
              <code
                className={`px-2 py-1 rounded-md ${
                  darkMode ? "bg-white/10 text-gray-100" : "bg-slate-100 text-slate-800"
                }`}
              >
                {location.pathname}
              </code>{" "}
              does not exist or has been moved.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-5 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Go Back
              </button>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                Go Home
              </Link>
            </div>

            <div className={`mt-8 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              If you believe this is an error, please contact support or try again later.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
