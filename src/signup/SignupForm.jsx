/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
// import { ArrowLeft, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ArrowLeft, Moon, Sun, AlertCircle, Mail } from "lucide-react";


export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    dateOfBirth: "",
    bio: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
  });

  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  // const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef({});

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    const keys = Object.keys(formData);
    keys.forEach((key) => {
      if (!inputRefs.current[key]) {
        inputRefs.current[key] = React.createRef();
      }
    });
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      inputRefs.current.firstName?.current?.focus();
    } else if (currentStep === 2) {
      inputRefs.current.bio?.current?.focus();
    }
  }, [currentStep]);

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (!/^[\w.@+-]+$/.test(formData.username)) {
        newErrors.username =
          "Username can only contain letters, digits and @/./+/-/_";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.dateOfBirth.trim())
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }
    if (step === 2) {
      if (!formData.bio.trim()) newErrors.bio = "Bio is required";
      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = "Phone number is required";
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!formData.passwordConfirm) {
        newErrors.passwordConfirm = "Please confirm your password";
      } else if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "Passwords don't match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitSignup = async (userData) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const registerUrl = baseUrl
        ? `${baseUrl.replace(/\/$/, "")}/auth/register/`
        : "/auth/register/";
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMsg = "Registration failed";
        if (errorData) {
          if (typeof errorData === "string") {
            errorMsg = errorData;
          } else if (errorData.message) {
            errorMsg = errorData.message;
          } else if (typeof errorData === "object") {
            errorMsg = Object.values(errorData).flat().join(" ");
          }
        }
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setLoading(true);
    setErrors({});
    try {
      const apiData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        bio: formData.bio,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        password: formData.password,
        additional_data: {},
      };
      await submitSignup(apiData);
      setShowConfirmation(true);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        inputRefs.current[nextField]?.current?.focus();
      } else if (currentStep === 1) {
        nextStep();
      } else {
        handleSubmit(e);
      }
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    nextField,
  }) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-gray-700"
          }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        ref={inputRefs.current[name]}
        id={name}
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, nextField)}
        placeholder={placeholder}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        aria-invalid={errors[name] ? "true" : "false"}
        className={`w-full h-12 px-3 rounded-xl border text-sm outline-none transition-all duration-200 ${darkMode
          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
          } ${errors[name] ? "border-red-500" : "focus:border-blue-500"}`}
      />
      {errors[name] && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-xs mt-1 flex items-center"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // The rest of your component (UI rendering) stays unchanged

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
        }`}
    >
      {/* Floating Button with Animation */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6a53ff] to-[#4680ff] p-0 shadow-lg"
        onClick={toggleDarkMode}>

        {/* Dark Mode Toggle */}
        <button
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-white" />
          ) : (
            <Moon className="w-5 h-5 text-white" />
          )}
        </button>
      </motion.button>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => alert("Going back to home...")}
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        {/* Form Container */}
        <div className="mt-6 md:mt-8 mb-16 flex h-full w-full items-center justify-center px-1 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          <motion.div
            className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h4
              variants={itemVariants}
              className="mb-2.5 text-3xl md:text-4xl font-bold"
            >
              Sign Up
            </motion.h4>
            <motion.p
              variants={itemVariants}
              className={`mb-6 md:mb-9 ml-1 text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Enter Credentials to sign up! Code to be gotten from
              Ilearnova admin
            </motion.p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {error &&
                <div className="mb-4 text-red-600 bg-red-100 rounded px-3 py-2 text-sm">{error}</div>
              }
              {success &&
                <div className="mb-4 text-green-700 bg-green-100 rounded px-3 py-2 text-sm">{success}</div>
              }
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={formStepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="flex flex-col lg:flex-row gap-4">
                      <motion.div
                        variants={itemVariants}
                        className="mb-3"
                      >
                        <label
                          htmlFor="firstName"
                          className={`ml-1.5 text-sm font-medium ${darkMode ? "text-white" : "text-navy-700"
                            }`}
                        >
                          First Name*
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          id="firstName"
                          required
                          placeholder="Ayodele"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${darkMode
                            ? "bg-navy-800 border-gray-600 text-white"
                            : "bg-white  text-navy-700 border-[#d0d0d0]"
                            } focus:border-[#6a53ff] transition-all duration-200`}
                        />
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        className="mb-3"
                      >
                        <label
                          htmlFor="lastName"
                          className={`ml-1.5 text-sm font-medium ${darkMode ? "text-white" : "text-navy-700"
                            }`}
                        >
                          Last Name*
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          id="lastName"
                          required
                          placeholder="Kayode"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${darkMode
                            ? "bg-navy-800 border-gray-600 text-white"
                            : "bg-white border-gray-200 text-navy-700"
                            } focus:border-[#6a53ff] transition-all duration-200`}
                        />
                      </motion.div>
                    </div>
                    <motion.div variants={itemVariants} className="mb-3">
                      <label
                        htmlFor="username"
                        className={`ml-1.5 text-sm font-medium ${darkMode ? "text-white" : "text-navy-700"
                          }`}
                      >
                        Username*
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        id="username"
                        required
                        placeholder="Ilearnova123"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${darkMode
                          ? "bg-navy-800 border-gray-600 text-white"
                          : "bg-white text-navy-700 border-[#d0d0d0]"
                          } focus:border-[#6a53ff] transition-all duration-200`}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-3">
                      <label
                        htmlFor="email"
                        className={`ml-1.5 text-sm font-medium ${darkMode ? "text-white" : "text-navy-700"
                          }`}
                      >
                        Email*
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="email"
                        id="email"
                        required
                        placeholder="Ilearnova123@Ilearnova.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${darkMode
                          ? "bg-navy-800 border-gray-600 text-white"
                          : "bg-white text-navy-700 border-[#d0d0d0]"
                          } focus:border-[#6a53ff] transition-all duration-200`}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={formStepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <motion.div variants={itemVariants} className="mb-3">
                      <label
                        htmlFor="password"
                        className={`ml-1.5 text-sm font-medium ${darkMode ? "text-white" : "text-navy-700"
                          }`}
                      >
                        Password*
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        id="password"
                        required
                        placeholder="Min. 8 characters"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${darkMode
                          ? "bg-navy-800 border-gray-600 text-white"
                          : "bg-white text-navy-700 border-[#d0d0d0]"
                          } focus:border-[#6a53ff] transition-all duration-200`}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-3">
                      <label
                        htmlFor="passwordConfirm"
                        className={`ml-1.5 text-sm font-medium ${darkMode ? "text-white" : "text-navy-700"
                          }`}
                      >
                        Confirm password*
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        id="passwordConfirm"
                        required
                        placeholder="Min. 8 characters"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${darkMode
                          ? "bg-navy-800 border-gray-600 text-white"
                          : "bg-white  text-navy-700 border-[#d0d0d0]"
                          } focus:border-[#6a53ff] transition-all duration-200`}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Navigation Buttons */}
              <div className="flex justify-between mt-6 mb-4">
                {currentStep > 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 rounded-lg border bg-transparent text-sm font-medium border-[#6a53ff] text-[#6a53ff]"
                  >
                    Previous
                  </motion.button>
                ) : (
                  <div></div>
                )}

                {currentStep < 2 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 rounded-lg bg-[#6a53ff] text-sm font-medium text-white"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#6a53ff] text-sm font-medium text-white"
                  >
                    Sign Up
                  </motion.button>
                )}
              </div>

              {/* Form Steps Indicator */}
              <div className="flex justify-center space-x-2 mt-2 mb-6">
                {[1, 2].map((step) => (
                  <motion.div
                    key={step}
                    initial={false}
                    animate={{
                      scale: currentStep === step ? 1.2 : 1,
                      backgroundColor:
                        currentStep === step
                          ? "#6a53ff"
                          : currentStep > step
                            ? "#9c8aff"
                            : "#e0e0e0",
                    }}
                    className="h-2 w-12 rounded-full"
                  />
                ))}
              </div>
            </form>

            <motion.div
              variants={itemVariants}
              className="mt-4 text-center"
            >
              <span
                className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-navy-700"
                  }`}
              >
                already registered?
              </span>
              <motion.a
                whileHover={{ scale: 1.05 }}
                className="ml-1 text-sm font-medium text-[#6a53ff] hover:text-[#5a46e6]"
                href="/login"
              >
                Login
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side background image with animation - responsive visibility */}
        <motion.div
          className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="absolute flex h-full w-full justify-center bg-cover bg-center lg:h-screen lg:rounded-bl-[120px] xl:h-[100vh] xl:rounded-bl-[200px]"
            style={{
              backgroundImage:
                "url('https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png')",
            }}
          ></div>
        </motion.div>
      </div>

      {/* Footer with responsive design */}
      <motion.div
        className={`z-[5] mx-auto flex w-full max-w-screen-sm flex-col items-center justify-between px-5 pb-4 lg:mb-6 lg:max-w-full lg:flex-row xl:mb-2 xl:w-[1310px] xl:pb-6 ${<div className="w-full grid lg:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Form Section */}
          <div className="w-full">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sign Up</h1>
            <p
              className={`mb-8 text-base sm:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Create your account to get started
            </p>

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="w-full">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="First Name"
                        name="firstName"
                        placeholder="John"
                        required
                        nextField="lastName"
                      />
                      <InputField
                        label="Last Name"
                        name="lastName"
                        placeholder="Doe"
                        required
                        nextField="username"
                      />
                    </div>
                    <InputField
                      label="Username"
                      name="username"
                      placeholder="johndoe123"
                      required
                      nextField="email"
                    />
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      nextField="dateOfBirth"
                    />
                    <InputField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      required
                      nextField="address"
                    />
                    <InputField
                      label="Address"
                      name="address"
                      placeholder="123 Main St, City"
                      required
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <label
                        htmlFor="bio"
                        className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-gray-700"
                          }`}
                      >
                        Bio <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        ref={inputRefs.bio}
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }));
                        }}
                        placeholder="Tell us about yourself"
                        rows={4}
                        aria-describedby={errors.bio ? "bio-error" : undefined}
                        aria-invalid={errors.bio ? "true" : "false"}
                        className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all duration-200 resize-none ${darkMode
                          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
                          } ${errors.bio
                            ? "border-red-500"
                            : "focus:border-blue-500"
                          }`}
                      />
                      {errors.bio && (
                        <p
                          id="bio-error"
                          className="text-red-500 text-xs mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.bio}
                        </p>
                      )}
                    </div>
                    <InputField
                      label="Phone Number"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+1234567890"
                      required
                      nextField="password"
                    />
                    <InputField
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      required
                      nextField="passwordConfirm"
                    />
                    <InputField
                      label="Confirm Password"
                      name="passwordConfirm"
                      type="password"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Previous
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  {currentStep < 2 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mt-6 space-x-2">
                  {[1, 2].map((step) => (
                    <div
                      key={step}
                      className={`h-2 w-8 rounded-full transition-colors ${currentStep >= step ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </form>

            {/* Footer Link */}
            <p
              className={`text-center mt-6 text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Already have an account?{" "}
              <button
                onClick={() => alert("Going to login...")}
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Login here
              </button>
            </p>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block w-full">
            <div
              className="w-full h-96 xl:h-[500px] bg-cover bg-center rounded-2xl shadow-lg"
              style={{
                backgroundImage:
                  "url('https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png')",
              }}
            />
          </div>
        </div>
          </motion.div>
          </div >
  );
}
