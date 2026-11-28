import React, { useState, useEffect, useCallback, useRef } from "react";
import { Mail, User, Lock, CheckCircle, Building, GraduationCap, UserCheck, Heart, BookOpen, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useRegister from "@/hooks/useRegister";
import InputField from "@/components/ui/InputField";
import NotificationBar from "@/components/ui/NotificationBar";
import { lookupSchool } from "@/api/joinApi";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { resendOtp } from "@/api/authApi";

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
  { value: "teacher", label: "Teacher", icon: GraduationCap, description: "Teach and manage students" },
  { value: "student", label: "Student", icon: UserCheck, description: "Learn and participate" },
  { value: "parent", label: "Parent", icon: Heart, description: "Monitor your child's progress" },
  { value: "individual_learner", label: "Individual Learner", icon: BookOpen, description: "Self-paced learning" },
];

const SCHOOL_ROLES = ["teacher", "student", "parent"];
const MIN_CODE_LENGTH = 4;
const normalizeCode = (value) => String(value || "").trim().toUpperCase();

export default function SignupForm() {
  const navigate = useNavigate();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [pendingApproval, setPendingApproval] = useState(null);
  // Which school the typed code belongs to:
  // { code, status: "checking" | "found" | "missing", school, message }.
  const [lookup, setLookup] = useState(null);
  const lookupRef = useRef(null);
  lookupRef.current = lookup;

  // The code must belong to a school before the form can be sent.
  const validateSchoolCode = useCallback((data) => {
    if (!SCHOOL_ROLES.includes(data.role)) return {};
    const code = normalizeCode(data.organization_code);
    if (!code) return {};
    const current = lookupRef.current;
    if (current?.code === code && current.status === "found") return {};
    if (current?.code === code && current.status === "missing") return { organization_code: current.message };
    if (code.length < MIN_CODE_LENGTH) return { organization_code: "Check your school's code." };
    return { organization_code: "Still checking your school's code. Try again in a moment." };
  }, []);

  const {
    formData,
    loading,
    errors,
    darkMode,
    handleInputChange,
    handleSubmit,
    notification,
  } = useRegister({
    validateExtra: validateSchoolCode,
    onSuccess: (response) => {
      const registeredUser = response?.data?.user || response?.user;
      setUserEmail(registeredUser?.email || formData.email);
      if (SCHOOL_ROLES.includes(formData.role)) {
        // School roles get no verification email: their school has to approve them.
        const found = lookupRef.current?.status === "found" ? lookupRef.current.school : null;
        setPendingApproval({ role: formData.role, schoolName: found?.name || "your school" });
        return;
      }
      setShowEmailVerification(true);
      if (registeredUser && registeredUser.is_verified === false) {
        setTimeout(() => {
          navigate("/login", {
            state :{
              info:"first_time_user"
            }
          })
        }, 1000);
      }
    },
  });

  const handleConfirmEmail = () => {
    navigate("/login");
  };

  const isSchoolRole = SCHOOL_ROLES.includes(formData.role);
  const typedCode = normalizeCode(formData.organization_code);
  const debouncedCode = useDebouncedValue(typedCode, 400);

  // Look the code up once they stop typing.
  useEffect(() => {
    if (!isSchoolRole || debouncedCode.length < MIN_CODE_LENGTH) {
      setLookup(null);
      return undefined;
    }
    let live = true;
    setLookup({ code: debouncedCode, status: "checking" });
    lookupSchool(debouncedCode)
      .then((school) => {
        if (live) setLookup({ code: debouncedCode, status: "found", school });
      })
      .catch((error) => {
        if (!live) return;
        const message =
          error?.status === 404
            ? error?.data?.error || error?.message || "No school has that code. Check it with your school."
            : "We couldn't check that code. Try again.";
        setLookup({ code: debouncedCode, status: "missing", message });
      });
    return () => {
      live = false;
    };
  }, [debouncedCode, isSchoolRole]);

  const codeLookup = lookup && lookup.code === typedCode ? lookup : null;

  if (pendingApproval) {
    const isParent = pendingApproval.role === "parent";
    return (
      <div
        className={`min-h-screen w-full transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100"
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Registration Successful!
            </h1>
            <p className={`text-lg sm:text-xl mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Your account is waiting for {pendingApproval.schoolName} to approve it.
            </p>

            <div
              className={`p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 mb-8 text-left ${
                darkMode ? "bg-gray-800/30 border border-gray-700/50" : "bg-white/70 border border-white/50 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold">What happens next</h2>
              </div>
              {isParent ? (
                <ol className={`list-decimal pl-5 space-y-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <li>Log in with the username and password you just created.</li>
                  <li>Open <strong>My Children</strong> and request a link to your child using their student email.</li>
                  <li>When {pendingApproval.schoolName} approves that link, your account is approved and you can follow your child's progress.</li>
                </ol>
              ) : (
                <ol className={`list-decimal pl-5 space-y-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <li>A school admin at {pendingApproval.schoolName} reviews and approves your account.</li>
                  <li>Once you're approved, log in and you'll see your classes.</li>
                  <li>You can log in before then; you'll see that you're still waiting for approval.</li>
                </ol>
              )}
              {userEmail && (
                <p className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Registered as <span className="font-semibold break-all">{userEmail}</span>
                </p>
              )}
            </div>

            <Link
              to="/login"
              className="inline-block w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
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
                  onClick={async () => {
                    try {
                      await resendOtp(userEmail);
                      notification.notify("Verification email resent!", "success", 4000);
                    } catch (error) {
                      notification.notify(error.message || "Unable to resend verification email.", "error", 5000);
                    }
                  }}
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

      <div className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          <div className="w-full">
            <div className="text-center lg:text-left mb-5 sm:mb-10">
              <h1 className={`text-3xl sm:text-5xl font-bold mb-2 sm:mb-4 ${darkMode ? "text-white" : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"}`}>
                Join Our School
              </h1>
              <p
                className={`text-base sm:text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Create your account and start your learning journey
              </p>
            </div>

            <div
              className={`p-4 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-lg transition-all duration-500 ${
                darkMode
                  ? "bg-gray-800/30 border border-gray-700/50"
                  : "bg-white/70 border border-white/50 shadow-xl"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Role Selection */}
                <div>
                  <p id="signup-role-label" className={`block text-sm font-medium mb-2 sm:mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Select Your Role
                  </p>
                  <div role="group" aria-labelledby="signup-role-label" className="grid grid-cols-2 gap-2 sm:gap-3">
                    {roleOptions.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => handleInputChange("role", role.value)}
                          aria-pressed={formData.role === role.value}
                          className={`min-h-14 px-3 py-2.5 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            formData.role === role.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <IconComponent className={`w-5 h-5 shrink-0 ${formData.role === role.value ? "text-blue-600" : "text-gray-500"}`} />
                            <div className="min-w-0">
                              <div className={`text-sm sm:text-base leading-tight sm:leading-normal font-medium ${formData.role === role.value ? "text-blue-600" : ""}`}>
                                {role.label}
                              </div>
                              <div className="hidden sm:block text-xs text-gray-500">{role.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className={`mt-2 sm:mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Setting up a new school?{" "}
                    <Link to="/register/school" className="py-3 font-medium text-blue-600 hover:underline">
                      Register your school
                    </Link>{" "}
                    instead.
                  </p>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                
                <div>
                  <label htmlFor="date_of_birth" className={`block text-sm font-medium mb-1.5 sm:mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Date of Birth <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formData.date_of_birth || ""}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      required
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full min-h-12 px-4 py-3 pl-12 pr-4 text-base rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } ${errors.date_of_birth ? "border-red-500" : "focus:border-blue-500"}`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    </div>
                  </div>
                  {errors.date_of_birth && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
                  )}
                </div>

                {/* Organization Name for Super Admin */}
                {formData.role === "super_admin" && (
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


                {/* School code for Teacher, Student, Parent */}
                {isSchoolRole && (
                  <div>
                    <label htmlFor="organization_code" className={`block text-sm font-medium mb-1.5 sm:mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      School code <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="organization_code"
                        name="organization_code"
                        type="text"
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        placeholder="e.g. SUN12345"
                        value={formData.organization_code || ""}
                        onChange={(e) => handleInputChange("organization_code", e.target.value.toUpperCase())}
                        required
                        aria-invalid={errors.organization_code || codeLookup?.status === "missing" ? "true" : undefined}
                        aria-describedby="organization_code_hint organization_code_status"
                        className={`w-full px-4 py-3 pl-12 pr-4 text-base rounded-xl border-2 uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } ${errors.organization_code ? "border-red-500" : "focus:border-blue-500"}`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      </div>
                    </div>
                    <p id="organization_code_hint" className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Ask your school for its code, or use the invite link they emailed you.
                    </p>
                    <div id="organization_code_status" role="status" aria-live="polite" className="mt-1 text-sm">
                      {errors.organization_code ? (
                        <p className="text-red-600">{errors.organization_code}</p>
                      ) : codeLookup?.status === "found" ? (
                        <p className="font-medium text-green-700">✓ {codeLookup.school?.name}</p>
                      ) : codeLookup?.status === "missing" ? (
                        <p className="text-red-600">{codeLookup.message}</p>
                      ) : codeLookup?.status === "checking" ? (
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Checking…</p>
                      ) : null}
                    </div>
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

                {formData.role === "student" && (
                  <>
                    <InputField
                      label="Student ID"
                      name="student_id"
                      placeholder="Enter student ID"
                      required
                      icon={UserCheck}
                      darkMode={darkMode}
                      errors={errors}
                      formData={formData}
                      handleChange={handleInputChange}
                    />
                    <InputField
                      label="Parent Email"
                      name="parent_email"
                      type="email"
                      placeholder="Enter parent email"
                      required
                      icon={Mail}
                      darkMode={darkMode}
                      errors={errors}
                      formData={formData}
                      handleChange={handleInputChange}
                    />
                  </>
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
                  className="w-full px-8 py-3.5 sm:py-4 bg-blue-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-blue-700 transition-all duration-300 transform sm:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                >
                  {loading ? <LoadingSpinner /> : "Create Account"}
                </button>
              </form>
            </div>

            <p
              className={`text-center mt-4 sm:mt-8 text-sm sm:text-base ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="inline-flex items-center min-h-10 sm:min-h-0 text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-all duration-200"
              >
                Login here
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
