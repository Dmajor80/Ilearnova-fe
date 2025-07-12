/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    code: "",
    password: "",
    passwordConfirm: "",
  });

  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Loading state can be added if needed for UX improvements
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("https://api.ilearnova.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(alert("Signup successful! You can now log in."));
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError(alert("Network error. Please try again later."));
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const formStepVariants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      className={`relative flex min-h-screen w-full transition-colors duration-300 ${
        darkMode ? "bg-navy-900 text-white" : "bg-white text-navy-700"
      }`}
    >
      {/* Floating Button with Animation */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6a53ff] to-[#4680ff] p-0 shadow-lg"
        onClick={toggleDarkMode}

      >
        {darkMode ? (
          <Sun className="h-6 w-6 text-white" />
        ) : (
          <Moon className="h-6 w-6 text-white" />
        )}
      </motion.button>

      <main className="mx-auto min-h-screen w-full">
        <div className="relative flex">
          <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-6 md:pt-12 px-4 sm:px-6 md:max-w-3/4 lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:max-w-[1383px] xl:px-0 xl:pl-16">
            <div className="mb-auto flex flex-col pl-2 pr-2 md:pr-0 md:pl-6 lg:max-w-[90%] xl:max-w-[48%] lg:pl-0">
              {/* Back Button with Animation */}
              <motion.a
                className="mt-0 w-max lg:pt-10"
                href="/"
                whileHover={{ x: -5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto flex h-fit w-fit items-center hover:cursor-pointer">
                  <ArrowLeft
                    className={`h-4 w-4 ${
                      darkMode ? "text-gray-300" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`ml-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Back to Home
                  </p>
                </div>
              </motion.a>

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
                    className={`mb-6 md:mb-9 ml-1 text-sm md:text-base ${
                      darkMode ? "text-gray-300" : "text-gray-600"
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
                                className={`ml-1.5 text-sm font-medium ${
                                  darkMode ? "text-white" : "text-navy-700"
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
                                className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${
                                  darkMode
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
                                className={`ml-1.5 text-sm font-medium ${
                                  darkMode ? "text-white" : "text-navy-700"
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
                                className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${
                                  darkMode
                                    ? "bg-navy-800 border-gray-600 text-white"
                                    : "bg-white border-gray-200 text-navy-700"
                                } focus:border-[#6a53ff] transition-all duration-200`}
                              />
                            </motion.div>
                          </div>
                          <motion.div variants={itemVariants} className="mb-3">
                            <label
                              htmlFor="username"
                              className={`ml-1.5 text-sm font-medium ${
                                darkMode ? "text-white" : "text-navy-700"
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
                              className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${
                                darkMode
                                  ? "bg-navy-800 border-gray-600 text-white"
                                  : "bg-white text-navy-700 border-[#d0d0d0]"
                              } focus:border-[#6a53ff] transition-all duration-200`}
                            />
                          </motion.div>

                          <motion.div variants={itemVariants} className="mb-3">
                            <label
                              htmlFor="email"
                              className={`ml-1.5 text-sm font-medium ${
                                darkMode ? "text-white" : "text-navy-700"
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
                              className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${
                                darkMode
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
                              className={`ml-1.5 text-sm font-medium ${
                                darkMode ? "text-white" : "text-navy-700"
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
                              className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${
                                darkMode
                                  ? "bg-navy-800 border-gray-600 text-white"
                                  : "bg-white text-navy-700 border-[#d0d0d0]"
                              } focus:border-[#6a53ff] transition-all duration-200`}
                            />
                          </motion.div>

                          <motion.div variants={itemVariants} className="mb-3">
                            <label
                              htmlFor="passwordConfirm"
                              className={`ml-1.5 text-sm font-medium ${
                                darkMode ? "text-white" : "text-navy-700"
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
                              className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none ${
                                darkMode
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
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-navy-700"
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
              className={`z-[5] mx-auto flex w-full max-w-screen-sm flex-col items-center justify-between px-5 pb-4 lg:mb-6 lg:max-w-full lg:flex-row xl:mb-2 xl:w-[1310px] xl:pb-6 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="mb-6 text-center text-xs sm:text-sm md:text-base lg:mb-0">
                ©2025 Ilearnova. All Rights Reserved.
              </p>
              <ul className="flex flex-wrap items-center justify-center sm:flex-nowrap">
                <li className="mr-6 md:mr-12 mb-2 sm:mb-0">
                  <a
                    target="blank"
                    href="mailto:hello@ilearnova.com"
                    className={`text-xs sm:text-sm md:text-base hover:text-[#6a53ff] transition-colors duration-300 ${
                      darkMode
                        ? "lg:text-gray-300 lg:hover:text-white"
                        : "lg:text-gray-600 lg:hover:text-gray-800"
                    }`}
                  >
                    Support
                  </a>
                </li>
                <li className="mr-6 md:mr-12 mb-2 sm:mb-0">
                  <a
                    target="blank"
                    href="/licenses"
                    className={`text-xs sm:text-sm md:text-base hover:text-[#6a53ff] transition-colors duration-300 ${
                      darkMode
                        ? "lg:text-gray-300 lg:hover:text-white"
                        : "lg:text-gray-600 lg:hover:text-gray-800"
                    }`}
                  >
                    License
                  </a>
                </li>
                <li className="mr-6 md:mr-12 mb-2 sm:mb-0">
                  <a
                    target="blank"
                    href="/terms-of-service"
                    className={`text-xs sm:text-sm md:text-base hover:text-[#6a53ff] transition-colors duration-300 ${
                      darkMode
                        ? "lg:text-gray-300 lg:hover:text-white"
                        : "lg:text-gray-600 lg:hover:text-gray-800"
                    }`}
                  >
                    Terms of Use
                  </a>
                </li>
                <li className="mb-2 sm:mb-0">
                  <a
                    target="blank"
                    href="/blog"
                    className={`text-xs sm:text-sm md:text-base hover:text-[#6a53ff] transition-colors duration-300 ${
                      darkMode
                        ? "lg:text-gray-300 lg:hover:text-white"
                        : "lg:text-gray-600 lg:hover:text-gray-800"
                    }`}
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
