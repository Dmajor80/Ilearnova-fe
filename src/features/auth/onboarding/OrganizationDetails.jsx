import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, User as UserIcon, Check, X } from "lucide-react";
import { http } from "../../../api/baseClient";

// Memoized, focus-stable input similar to login/signup InputField
const InputField = React.memo(function InputField({
  label,
  name,
  type = "text",
  placeholder,
  nextField,
  icon: Icon,
  darkMode,
  errors,
  formData,
  inputRefs,
  handleChange,
  handleSubmit,
  disabled = false,
}) {
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
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon
              className={`w-5 h-5 transition-colors ${
                darkMode
                  ? "text-gray-400 group-focus-within:text-blue-400"
                  : "text-gray-500 group-focus-within:text-blue-600"
              }`}
            />
          </div>
        )}
        <input
          ref={inputRefs.current[name]}
          id={name}
          name={name}
          type={type}
          value={formData[name]}
          placeholder={placeholder}
          onChange={(e) => handleChange(name, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (nextField && inputRefs.current[nextField]) {
                inputRefs.current[nextField].current?.focus();
              } else {
                handleSubmit(e);
              }
            }
          }}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-4 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ease-in-out outline-none ${
            darkMode
              ? "bg-gray-800/50 text-white border-gray-600 placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
              : "bg-white text-gray-800 border-gray-200 placeholder-gray-500 focus:bg-blue-50/30 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
          } ${errors[name] ? "border-red-400 bg-red-50/30" : ""} hover:border-gray-400`}
          aria-invalid={errors[name] ? "true" : "false"}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          disabled={disabled}
          autoComplete="off"
        />
      </div>
      {errors[name] && (
        <p id={`${name}-error`} className="text-red-500 text-xs mt-2 flex items-center" role="alert">
          <X className="w-4 h-4 mr-2 flex-shrink-0" />
          {errors[name]}
        </p>
      )}
    </div>
  );
});

export default function OrganizationDetails() {
  const navigate = useNavigate();

  const [darkMode] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Stable refs for focus control
  const inputRefs = useRef({
    name: React.createRef(),
    address: React.createRef(),
    email: React.createRef(),
    phone_number: React.createRef(),
  });

  const getToken = () =>
    localStorage.getItem("auth_access") || sessionStorage.getItem("auth_access");

  const storedUser = useMemo(() => {
    try {
      const s = localStorage.getItem("user_data") || sessionStorage.getItem("user_data");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }, []);

  const prefillUsername =
    sessionStorage.getItem("prefill_username") || localStorage.getItem("prefill_username") || "";

  useEffect(() => {
    // Guards
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    // Prefill email from user data or prefill_username
    const email = storedUser?.email || prefillUsername || "";
    setForm((f) => ({ ...f, email }));
  }, [navigate, storedUser, prefillUsername]);

  // Initial focus on "name" field
  useEffect(() => {
    const t = setTimeout(() => {
      inputRefs.current.name?.current?.focus();
    }, 120);
    return () => clearTimeout(t);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification((n) => ({ ...n, show: false })), 4000);
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Organization name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone_number.trim()) e.phone_number = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const token = getToken();
    if (!token) {
      showNotification("Authentication required. Please log in again.", "error");
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const body = {
        "account_type": "organization",
        name: form.name.trim(),
        address: form.address.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
      };

      await http.post("/api/user-type/", {
        body,
      });

      // Persist details
      try {
        sessionStorage.setItem("selected_user_type", "organization");
        localStorage.setItem("selected_user_type", "organization");
        sessionStorage.setItem("organization_details", JSON.stringify(body));
        localStorage.setItem("organization_details", JSON.stringify(body));
      } catch {}

      showNotification("Organization profile saved. Redirecting...", "success");
      setTimeout(() => navigate("/home", { replace: true }), 700);
    } catch (e) {
      showNotification(e.message || "Network error", "error");
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <Building2 className="w-7 h-7" />
              </div>
              <h1
                className={`text-4xl sm:text-5xl font-extrabold ${
                  darkMode
                    ? "text-white"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                }`}
              >
                Organization Details
              </h1>
            </div>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-2`}>
              Provide your organization information to complete setup.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <InputField
              label="Organization Name"
              name="name"
              placeholder="Enter organization name"
              icon={UserIcon}
              nextField="address"
              darkMode={darkMode}
              errors={errors}
              formData={form}
              inputRefs={inputRefs}
              handleChange={handleChange}
              handleSubmit={onSubmit}
              disabled={loading}
            />
            <InputField
              label="Address"
              name="address"
              placeholder="Enter organization address"
              icon={MapPin}
              nextField="email"
              darkMode={darkMode}
              errors={errors}
              formData={form}
              inputRefs={inputRefs}
              handleChange={handleChange}
              handleSubmit={onSubmit}
              disabled={loading}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Contact email"
              icon={Mail}
              nextField="phone_number"
              darkMode={darkMode}
              errors={errors}
              formData={form}
              inputRefs={inputRefs}
              handleChange={handleChange}
              handleSubmit={onSubmit}
              disabled={loading}
            />
            <InputField
              label="Phone Number"
              name="phone_number"
              type="tel"
              placeholder="Contact phone number"
              icon={Phone}
              darkMode={darkMode}
              errors={errors}
              formData={form}
              inputRefs={inputRefs}
              handleChange={handleChange}
              handleSubmit={onSubmit}
              disabled={loading}
            />

            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate("/select-user-type")}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save and Continue"}
              </button>
            </div>
          </form>
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
