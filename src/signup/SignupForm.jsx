import React from "react";
import { useState, useRef, useEffect } from "react";
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

  const inputRefs = useRef({});

  useEffect(() => {
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
        throw new Error(errorData.message || "Registration failed");
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
        className={`block text-sm font-medium mb-2 ${
          darkMode ? "text-white" : "text-gray-700"
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
        className={`w-full h-12 px-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
          darkMode
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
      className={`min-h-screen w-full transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
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

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => alert("Going back to home...")}
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="w-full grid lg:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Form Section */}
          <div className="w-full">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sign Up</h1>
            <p
              className={`mb-8 text-base sm:text-lg ${
                darkMode ? "text-gray-300" : "text-gray-600"
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
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-white" : "text-gray-700"
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
                        className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all duration-200 resize-none ${
                          darkMode
                            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
                        } ${
                          errors.bio
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
                      className={`h-2 w-8 rounded-full transition-colors ${
                        currentStep >= step ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </form>

            {/* Footer Link */}
            <p
              className={`text-center mt-6 text-sm sm:text-base ${
                darkMode ? "text-gray-300" : "text-gray-600"
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
      </div>
    </div>
  );
}
