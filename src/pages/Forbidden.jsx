import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";

export default function Forbidden() {
  const navigate = useNavigate();
  const location = useLocation();

  const darkMode =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-6 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl p-8 shadow-2xl ${
          darkMode ? "bg-gray-900/70 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">403 — Forbidden</h1>
        </div>

        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
          You don't have permission to access this page. If you believe this is an error,
          contact your administrator or try switching to a permitted area.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/post-login", { replace: true, state: { from: location } })}
            className={`px-5 py-2.5 rounded-xl ${
              darkMode ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            } transition-all`}
          >
            Re-evaluate Access
          </button>
        </div>
      </div>
    </div>
  );
}
