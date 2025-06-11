import React, { useState } from "react";
import { Check, Upload, Edit, ChevronDown } from "lucide-react";
import check from "../student/checkout.png";
const IdCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "Priscilla",
    lastName: "Daniel",
    dateOfBirth: "2000/04/27",
    sex: "Female",
    guardianDetails: "Mr & Mrs Priscilla Daniel",
    academicHistory: "",
    admissionLevel: "Primary",
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

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`w-3 h-3 rounded-full ${
                step <= currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            {step < 3 && (
              <div
                className={`w-24 h-0.5 ${
                  step < currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const Step1PersonalInfo = () => (
    <div className="  w-full">
      {/* Header with decorative elements */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg p-8 mb-8">
        <div className="absolute top-4 left-4 w-8 h-8 bg-green-400 rounded-full"></div>
        <div className="absolute top-2 right-8 w-6 h-6 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 bg-gray-200 rounded-full"></div>

        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl font-bold text-gray-800">+</div>
          </div>
          <h2 className="text-white font-semibold">
            Step 1: Personal Information
          </h2>
        </div>
      </div>

      <div className="space-y-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First name*
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Priscilla"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last name*
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Daniel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth*
            </label>
            <input
              type="text"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2000/04/27"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sex*
            </label>
            <input
              type="text"
              value={formData.sex}
              onChange={(e) => updateFormData("sex", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Female"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guardian Details*
            </label>
            <input
              type="text"
              value={formData.guardianDetails}
              onChange={(e) =>
                updateFormData("guardianDetails", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mr & Mrs Priscilla Daniel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Level*
            </label>
            <div className="relative">
              <select
                value={formData.admissionLevel}
                onChange={(e) =>
                  updateFormData("admissionLevel", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option>Primary</option>
                <option>Secondary</option>
                <option>Tertiary</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic History*
              <span className="text-xs text-gray-500 block">
                Any previous school or background
              </span>
            </label>
            <textarea
              value={formData.academicHistory}
              onChange={(e) =>
                updateFormData("academicHistory", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document*
            </label>
            <div className="w-full px-4 py-12 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Upload documents</p>
            </div>
          </div>
        </div>

        <button
          onClick={nextStep}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition duration-200"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );

  const Step2Payment = () => (
    <div className="w-full mx-auto">
      <h2 className="text-xl font-semibold text-center mb-8">
        Step 2: Make Payment
      </h2>
      <div className="flex items-center gap-[2rem] flex-col lg:flex-row">
        <div>
          {/* instruction */}
          <div className="bg-white rounded-lg p-6 mb-6 max-w-[488px] h-[236px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tuition Fee</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                $100
                <span className="text-sm font-normal text-gray-500">
                  /session
                </span>
              </div>
              <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] text-[#333333]">
                Empower your child’s learning journey for just $300 per session
                – quality education, personalized attention, and a brighter
                future.
              </p>
            </div>
          </div>
          <button
            onClick={nextStep}
            className="w-full bg-[#0D1D75] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-6"
          >
            Proceed to payment
          </button>
        </div>
        {/* end of intruction */}
        {/* Payment illustration */}

        {/* <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 text-center">
        <div className="relative">
          <div className="w-32 h-20 bg-gray-800 rounded-lg mx-auto mb-4 relative">
            <div className="absolute top-2 left-2 w-8 h-6 bg-gray-200 rounded"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="absolute top-0 left-4 w-6 h-6 bg-orange-400 rounded-full opacity-80"></div>
          <div className="absolute top-8 right-8 w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 left-8 w-8 h-8 bg-red-400 rounded-full opacity-70"></div>
          <div className="absolute bottom-0 right-4 w-6 h-6 bg-purple-400 rounded-full opacity-80"></div>
        </div>     
     </div> */}

        <div>
          <img src={check} alt="" />
        </div>
      </div>
    </div>
  );

  const Step3Review = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-8">
        Step 3: Application Review & Submit
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Full name:</span>
                  <p className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Date of birth:</span>
                  <p className="font-medium">12 December, 2024</p>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Guardian Details:</span>
                <p className="font-medium">Mr Daniel</p>
                <p className="text-gray-500">+234 - 7056 7842</p>
              </div>
            </div>
          </div>

          {/* Academic History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Academic History</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">School Name:</span>
                <p className="font-medium">St Michael International School</p>
              </div>
              <div>
                <span className="text-gray-600">Grade:</span>
                <p className="font-medium">Grade 6</p>
              </div>
            </div>
          </div>

          {/* Upload Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📄</span>
                </div>
                <span className="text-sm">Report Card</span>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📋</span>
                </div>
                <span className="text-sm">Recommendation Letter</span>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-700 text-sm font-medium">
                Status: Uploaded
              </span>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">$100.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">RN104504072</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date:</span>
                <span className="font-medium">3 December, 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Image Section */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4">
            <img
              src="/api/placeholder/300/300"
              alt="Student Profile"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  I confirm that the above information is accurate to the best
                  of my knowledge.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  I acknowledge receiving academic & financial information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Back to Edit
        </button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
          Submit Application
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 ">
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
