import React, { useState } from "react";
import {
  Check,
  Upload,
  Edit,
  ChevronDown,
  User,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// Mock framer-motion functionality with CSS transitions
const motion = {
  div: ({
    children,
    className,
    initial,
    animate,
    transition,
    whileHover,
    ...props
  }) => (
    <div
      className={`${className} transition-all duration-500 ease-in-out`}
      {...props}
    >
      {children}
    </div>
  ),
  button: ({ children, className, whileHover, whileTap, ...props }) => (
    <button
      className={`${className} transition-all duration-200 hover:scale-105 active:scale-95`}
      {...props}
    >
      {children}
    </button>
  ),
};

const IdCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sex: "",
    guardianDetails: "",
    academicHistory: "",
    admissionLevel: "",
    documents: {
      reportCard: false,
      recommendationLetter: false,
    },
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Review", icon: CheckCircle },
  ];

  const StepIndicator = () => (
    <motion.div className="flex items-center justify-center mb-12 w-[200px] mx-auto sm:w-[200px] md:w-[500px] ">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number <= currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              <motion.div
                className="flex flex-col items-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`w-8 h-8  lg:w-16 lg:h-16rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    isActive
                      ? isCurrent
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                        : "bg-green-500 shadow-md"
                      : "bg-gray-200"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`max-w-20 h-1 rounded-full transition-all duration-500 ${
                    step.number < currentStep
                      ? "bg-gradient-to-r from-blue-500 to-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </motion.div>
  );

  const Step1PersonalInfo = () => (
    <motion.div
      className=" w-[260px] sm:w-[300px] md:w-[500px] lg:w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Professional Header */}
      <motion.div
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 rounded-2xl p-8 mb-8 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16"></div>
        <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full"></div>

        <div className="relative text-center">
          <motion.div
            className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Personal Information
          </h2>
          <p className="text-blue-100 text-lg">
            Let's start with your basic details
          </p>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-8">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Enter your first name"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Enter your last name"
              />
            </motion.div>
          </div>

          {/* Date and Sex Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.sex}
                  onChange={(e) => updateFormData("sex", e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          </div>

          {/* Guardian and Admission Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Guardian Details <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guardianDetails}
                onChange={(e) =>
                  updateFormData("guardianDetails", e.target.value)
                }
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Guardian's full name"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Admission Level <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.admissionLevel}
                  onChange={(e) =>
                    updateFormData("admissionLevel", e.target.value)
                  }
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="">Select Level</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Tertiary">Tertiary</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          </div>

          {/* Academic History and Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Academic History <span className="text-red-500">*</span>
                <span className="block text-xs text-gray-500 font-normal mt-1">
                  Previous school or educational background
                </span>
              </label>
              <textarea
                value={formData.academicHistory}
                onChange={(e) =>
                  updateFormData("academicHistory", e.target.value)
                }
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                rows="4"
                placeholder="Tell us about your academic background..."
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload Documents <span className="text-red-500">*</span>
              </label>
              <motion.div
                className="w-full px-6 py-12 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
                <p className="text-gray-600 group-hover:text-blue-600 font-medium mb-2">
                  Click to upload or drag files here
                </p>
                <p className="text-sm text-gray-400">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Continue Button */}
          <motion.div className="pt-6">
            <motion.button
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  const Step2Payment = () => (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Secure Payment
        </h2>
        <p className="text-gray-600 text-lg">
          Complete your application with our secure payment system
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Payment Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Tuition Fee
            </h3>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              $100
              <span className="text-lg font-normal text-gray-500">
                /session
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Invest in quality education with personalized attention and
              comprehensive learning support for your child's bright future.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Comprehensive curriculum</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Personalized attention</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Progress tracking</span>
            </div>
          </div>

          <motion.button
            onClick={nextStep}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Payment
          </motion.button>
        </motion.div>

        {/* Payment Illustration */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute top-8 right-8 w-8 h-8 bg-purple-200 rounded-full opacity-80"></div>
            <div className="absolute bottom-4 left-8 w-16 h-16 bg-green-200 rounded-full opacity-40"></div>
            <div className="absolute bottom-8 right-4 w-10 h-10 bg-yellow-200 rounded-full opacity-70"></div>

            {/* Credit card mockup */}
            <motion.div
              className="relative z-10 w-80 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mx-auto shadow-2xl"
              whileHover={{ rotateY: 10, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-6 left-6 w-12 h-8 bg-yellow-400 rounded-md"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-6 left-6 text-white text-sm font-mono">
                •••• •••• •••• 1234
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const Step3Review = () => (
    <motion.div
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Review & Submit
        </h2>
        <p className="text-gray-600 text-lg">
          Please review your information before submitting
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <motion.button
                onClick={() => setCurrentStep(1)}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Edit className="w-4 h-4" />
                Edit
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Full Name
                </span>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.firstName || "Priscilla"}{" "}
                  {formData.lastName || "Daniel"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Date of Birth
                </span>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.dateOfBirth || "2000-04-27"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Gender
                </span>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.sex || "Female"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Guardian
                </span>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.guardianDetails || "Mr & Mrs Daniel"}
                </p>
              </div>
            </div>
          </div>

          {/* Academic History Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Academic History
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Previous School
                </span>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.academicHistory ||
                    "St Michael International School"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Admission Level
                </span>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.admissionLevel || "Primary"}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Documents
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">Report Card</span>
                <div className="ml-auto">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">
                  Recommendation Letter
                </span>
                <div className="ml-auto">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Amount Paid
                </span>
                <p className="text-2xl font-bold text-green-600">$100.00</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  Transaction ID
                </span>
                <p className="text-lg font-semibold text-gray-800">
                  RN104504072
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-4">
            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
              <User className="w-24 h-24 text-gray-400" />
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 leading-relaxed">
                  I confirm that the above information is accurate to the best
                  of my knowledge.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 leading-relaxed">
                  I acknowledge receiving academic & financial information.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="mt-12 flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <motion.button
          onClick={prevStep}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Payment
        </motion.button>
        <motion.button
          className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CheckCircle className="w-5 h-5" />
          Submit Application
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 ">
      <div className="container mx-auto px-4 ">
        <StepIndicator />

        {currentStep === 1 && <Step1PersonalInfo />}
        {currentStep === 2 && <Step2Payment />}
        {currentStep === 3 && <Step3Review />}
      </div>
    </div>
  );
};

export default IdCard;
