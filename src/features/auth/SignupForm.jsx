/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Mail, User, Lock, CheckCircle, Building, Users, GraduationCap, UserCheck, Heart, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useRegister from "@/hooks/useRegister";
import InputField from "@/components/ui/InputField";
import NotificationBar from "@/components/ui/NotificationBar";
import { getOrganizations } from "@/api/authApi";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      <div
        className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-blue-200 rounded-full animate-spin"
        style={{ animationDelay: "0.15s" }}
      ></div>
    </div>
    <span className="ml-3 font-medium">Creating Account...</span>
  </div>
);


const roleOptions = [
  { value: "super_admin", label: "Super Admin", icon: Building, description: "Full system access" },
  { value: "org_admin", label: "Organization Admin", icon: Users, description: "Manage your organization" },
  { value: "teacher", label: "Teacher", icon: GraduationCap, description: "Teach and manage students" },
  { value: "student", label: "Student", icon: UserCheck, description: "Learn and participate" },
  { value: "parent", label: "Parent", icon: Heart, description: "Monitor your child's progress" },
  { value: "individual_learner", label: "Individual Learner", icon: BookOpen, description: "Self-paced learning" },
];

export default function SignupForm() {
  const navigate = useNavigate();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(false);

  const {
    formData,
    loading,
    errors,
    darkMode,
    handleInputChange,
    handleSubmit,
    notification,
  } = useRegister({
    onSuccess: (response) => {
      setUserEmail(response.user?.email || formData.email);
      setShowEmailVerification(true);

      // If email verification is not required, redirect to post-login immediately
      if (!response.email_verification_required) {
        // Delay a bit to show success notification
        setTimeout(() => {
          window.location.href = "/post-login";
        }, 1000);
      }
    },
  });

  const handleConfirmEmail = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      setOrganizationsLoading(true);
      try {
        const response = await getOrganizations();
        setOrganizations(response.data || []);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setOrganizationsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (showEmailVerification) {
    return (
      <div
        className={`min-h-screen w-full transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Registration Successful!
                </h1>
                <p
                  className={`text-lg sm:text-xl mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Please check your email to verify your account.
                </p>
              </div>

              <div
                className={`p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 mb-8 ${
                  darkMode
                    ? "bg-gray-800/30 border border-gray-700/50"
                    : "bg-white/70 border border-white/50 shadow-xl"
                }`}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">
                  Verify Your Email Address
                </h2>

                <p
                  className={`text-base mb-4 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  We've sent a verification email to:
                </p>

                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-6 break-all">
                  {userEmail}
                </p>

                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } mb-8 space-y-2`}
                >
                  <p>
                    Please check your email and click the verification link to
                    activate your account.
                  </p>
                  <p>
                    Don't forget to check your spam/junk folder if you don't see
                    the email in your inbox.
                  </p>
                </div>

                <button
                  onClick={handleConfirmEmail}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
                >
                  I've Confirmed - Go to Login
                </button>
              </div>

              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Didn't receive the email?{" "}
                <button
                  onClick={() =>
                    notification.notify("Verification email resent!", "success", 4000)
                  }
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1 transition-all duration-200"
                >
                  Resend verification email
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          <div className="w-full">
            <div className="text-center lg:text-left mb-10">
              <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"}`}>
                Join Our School
              </h1>
              <p
                className={`text-lg sm:text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Create your account and start your learning journey
              </p>
            </div>

            <div
              className={`p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 ${
                darkMode
                  ? "bg-gray-800/30 border border-gray-700/50"
                  : "bg-white/70 border border-white/50 shadow-xl"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roleOptions.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => handleInputChange("role", role.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            formData.role === role.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className={`w-5 h-5 ${formData.role === role.value ? "text-blue-600" : "text-gray-500"}`} />
                            <div>
                              <div className={`font-medium ${formData.role === role.value ? "text-blue-600" : ""}`}>
                                {role.label}
                              </div>
                              <div className="text-xs text-gray-500">{role.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    name="first_name"
                    placeholder="Enter your first name"
                    required
                    icon={User}
                    darkMode={darkMode}
                    errors={errors}
                    formData={formData}
                    handleChange={handleInputChange}
                  />
                  <InputField
                    label="Last Name"
                    name="last_name"
                    placeholder="Enter your last name"
                    required
                    icon={User}
                    darkMode={darkMode}
                    errors={errors}
                    formData={formData}
                    handleChange={handleInputChange}
                  />
                </div>

                <InputField
                  label="Username"
                  name="username"
                  placeholder="Choose a username"
                  required
                  icon={User}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  handleChange={handleInputChange}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  icon={Mail}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  handleChange={handleInputChange}
                />

                {/* Organization Name for Super Admin and Org Admin */}
                {["super_admin", "org_admin"].includes(formData.role) && (
                  <InputField
                    label="Organization Name"
                    name="organization_name"
                    placeholder="Enter organization name"
                    required
                    icon={Building}
                    darkMode={darkMode}
                    errors={errors}
                    formData={formData}
                    handleChange={handleInputChange}
                  />
                )}

                {/* Organization Selection for Teacher, Student, Parent */}
                {["teacher", "student", "parent"].includes(formData.role) && (
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Select Organization
                    </label>
                    <div className="relative">
                      <select
                        name="organization_id"
                        value={formData.organization_id || ""}
                        onChange={(e) => handleInputChange("organization_id", e.target.value)}
                        required
                        disabled={organizationsLoading}
                        className={`w-full px-4 py-3 pl-12 pr-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } ${errors.organization_id ? "border-red-500" : "focus:border-blue-500"}`}
                      >
                        <option value="">
                          {organizationsLoading ? "Loading organizations..." : "Select an organization"}
                        </option>
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name} {org.city && `(${org.city})`}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      </div>
                    </div>
                    {errors.organization_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.organization_id}</p>
                    )}
                  </div>
                )}

                {/* Phone for roles that require it */}
                {["teacher", "student", "parent", "individual_learner"].includes(formData.role) && (
                  <InputField
                    label="Phone Number"
                    name="phone"
                    placeholder="Enter your phone number"
                    icon={User}
                    darkMode={darkMode}
                    errors={errors}
                    formData={formData}
                    handleChange={handleInputChange}
                  />
                )}

                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                  icon={Lock}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  handleChange={handleInputChange}
                />

                <InputField
                  label="Confirm Password"
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  icon={Lock}
                  darkMode={darkMode}
                  errors={errors}
                  formData={formData}
                  handleChange={handleInputChange}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
                >
                  {loading ? <LoadingSpinner /> : "Create Account"}
                </button>
              </form>
            </div>

            <p
              className={`text-center mt-8 text-base ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
              <Link to="/login">
                <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-all duration-200">
                  Login here
                </button>
              </Link>
            </p>
          </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
