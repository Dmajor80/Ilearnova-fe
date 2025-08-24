import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Building2, Check, X } from "lucide-react";
import { http } from "../api/baseClient";

export default function SelectUserType() {
  const navigate = useNavigate();

  const [darkMode] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const getToken = () =>
    localStorage.getItem("auth_access") || sessionStorage.getItem("auth_access");

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification((n) => ({ ...n, show: false })), 4000);
  };

  useEffect(() => {
    // Guard: must be logged in to reach onboarding
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  const postUserType = async (body) => {
    const token = getToken();
    if (!token) {
      showNotification("Authentication required. Please log in again.", "error");
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    try {
      await http.post("/api/user-type/", {
        body,
      });

      // Persist selection
      try {
        sessionStorage.setItem("selected_user_type", body["account_type"]);
        localStorage.setItem("selected_user_type", body["account_type"]);
      } catch {}

      showNotification("Onboarding completed. Redirecting...", "success");
      setTimeout(() => navigate("/home", { replace: true }), 600);
    } catch (e) {
      showNotification(e.message || "Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSelectIndividual = async () => {
    await postUserType({ "account_type": "individual" });
  };

  const onSelectOrganization = () => {
    try {
      sessionStorage.setItem("selected_user_type", "organization");
      localStorage.setItem("selected_user_type", "organization");
    } catch {}
    navigate("/organization-details");
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
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl transform transition-all duration-500 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <Check className="w-6 h-6 mt-0.5" />
              ) : notification.type === "error" ? (
                <X className="w-6 h-6 mt-0.5" />
              ) : (
                <Check className="w-6 h-6 mt-0.5" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <span className="font-semibold text-sm leading-relaxed">
                {notification.message}
              </span>
            </div>
            <button
              onClick={() => setNotification((n) => ({ ...n, show: false }))}
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
          <div className="text-center mb-10">
            <h1
              className={`text-4xl sm:text-5xl font-extrabold ${
                darkMode
                  ? "text-white"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              }`}
            >
              Select Account Type
            </h1>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-3`}>
              Choose how you want to use Ilearnova.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <button
              type="button"
              disabled={loading}
              onClick={onSelectIndividual}
              className={`group text-left p-6 rounded-3xl border-2 transition-all duration-300 ${
                darkMode
                  ? "bg-gray-900/60 border-gray-700 hover:border-cyan-500 hover:shadow-cyan-500/20"
                  : "bg-white border-gray-200 hover:border-cyan-500 hover:shadow-cyan-500/20"
              } shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Solo Learner</h3>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-1 text-sm`}>
                    Learn as an individual and track your personal progress.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <span className="inline-block text-sm font-medium text-cyan-600">
                  Select
                </span>
              </div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onSelectOrganization}
              className={`group text-left p-6 rounded-3xl border-2 transition-all duration-300 ${
                darkMode
                  ? "bg-gray-900/60 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20"
                  : "bg-white border-gray-200 hover:border-blue-500 hover:shadow-blue-500/20"
              } shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Organization</h3>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-1 text-sm`}>
                    Set up an organization account for your school or company.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <span className="inline-block text-sm font-medium text-blue-600">
                  Continue
                </span>
              </div>
            </button>
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
