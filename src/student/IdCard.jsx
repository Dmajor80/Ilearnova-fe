import React, { useState } from "react";
import { Calendar, Upload, X, Check, ArrowLeft } from "lucide-react";

export default function IdCard() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    bio: "",
    Sex: "",
    Academic: "",
    Session: "",
    IssueDate: "",
    ExpiryDate: "",
    IdNumber: "",
    Grade: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [uploadStep, setUploadStep] = useState("select");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleAddPicture = () => {
    setShowModal(true);
    setUploadStep("select");
    setUploadProgress(0);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadStep("uploading");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadStep("success");
        }, 500);
      }
    }, 200);
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadStep("select");
    setUploadProgress(0);
    setSelectedImage(null);
  };

  const handleContinue = () => {
    closeModal();
  };

  const handlePreviewId = () => {
    setShowPreview(true);
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  const downloadIdCard = () => {
    // In a real implementation, this would generate and download a PDF or image
    alert("ID Card download functionality would be implemented here");
  };

  // ID Card Preview Component
  const IdCardPreview = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToForm}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Form
        </button>
      </div>

      <p className="text-[25px] p-[2rem] font-semibold">ID Card Preview</p>

      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-0 max-w-[400px] overflow-hidden">
          {/* Header with colorful design */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-green-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gray-200 rounded-full opacity-40"></div>
              <div className="absolute bottom-0 left-4 w-8 h-8 bg-orange-400 rounded-full opacity-70"></div>
            </div>

            {/* Profile Image */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-16 pb-6 px-6">
            {/* Logo */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-6 bg-gradient-to-r from-red-500 to-blue-500 rounded mr-2"></div>
                <span className="font-bold text-lg">Ilearnova</span>
              </div>
            </div>

            {/* Student Name */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-sm text-gray-600">{formData.IdNumber}</p>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Sex</span>
                <span className="text-gray-600">
                  {formData.Sex || "Not specified"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Academic Year Session
                </span>
                <span className="text-gray-600">
                  {formData.Academic || "Not specified"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Grade</span>
                <span className="text-gray-600">
                  {formData.Grade || "Not specified"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Academic Session
                </span>
                <span className="text-gray-600">
                  {formData.Session || "Not specified"}
                </span>
              </div>
            </div>

            {/* Authorization Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="bg-blue-600 text-white p-3 rounded text-center">
                <p className="text-xs font-medium mb-1">
                  Authorized for use by 'Ilearnova' students/staff only
                </p>
                <p className="text-xs opacity-90">
                  This card must not be transferred or surrendered to any school
                  for book Unauthorized use strictly prohibited.
                </p>
              </div>

              <div className="mt-3 text-center">
                <button
                  onClick={downloadIdCard}
                  className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Download ID Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show preview if requested
  if (showPreview) {
    return <IdCardPreview />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <p className="text-[25px] p-[2rem] font-semibold">E-Identity Card</p>
      <div className="">
        {/* Header with colorful design */}
        <div className="relative mb-8">
          <div className="rounded-t-lg flex items-center justify-center relative overflow-hidden">
            <div className="h-[189px] w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden rounded-lg">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-4 right-8 w-16 h-16 bg-green-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-200 rounded-full opacity-40"></div>
              <div className="absolute bottom-4 left-8 w-12 h-12 bg-orange-400 rounded-full opacity-70"></div>
            </div>
            <div
              className="absolute mt-[5rem] bg-white w-[200px] h-[200px] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-4 border-white shadow-lg overflow-hidden"
              onClick={handleAddPicture}
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-[54px] font-light text-gray-600">+</span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                style={{
                  color: "rgba(174, 174, 174, 1)",
                  border: " 1px solid rgba(174, 174, 174, 1)",
                }}
                placeholder="First name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                style={{
                  color: "rgba(174, 174, 174, 1)",
                  border: " 1px solid rgba(174, 174, 174, 1)",
                }}
                placeholder="Last name"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Date of birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  style={{
                    color: "rgba(174, 174, 174, 1)",
                    border: " 1px solid rgba(174, 174, 174, 1)",
                  }}
                />
              </div>
            </div>

            {/* Sex */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Sex
              </label>
              <input
                type="text"
                name="Sex"
                value={formData.Sex}
                onChange={handleInputChange}
                className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                style={{
                  color: "rgba(174, 174, 174, 1)",
                  border: " 1px solid rgba(174, 174, 174, 1)",
                }}
                placeholder="Female"
              />
            </div>

            {/* Academic Year Session */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Academic Year Session
              </label>
              <input
                type="text"
                name="Academic"
                value={formData.Academic}
                onChange={handleInputChange}
                className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                style={{
                  color: "rgba(174, 174, 174, 1)",
                  border: " 1px solid rgba(174, 174, 174, 1)",
                }}
                placeholder="2024/2025"
              />
            </div>

            {/* Session */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Academic Session
              </label>
              <input
                type="text"
                name="Session"
                value={formData.Session}
                onChange={handleInputChange}
                className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                style={{
                  color: "rgba(174, 174, 174, 1)",
                  border: " 1px solid rgba(174, 174, 174, 1)",
                }}
                placeholder="1st Session"
              />
            </div>

            {/* Issue date */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Issue date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="IssueDate"
                  value={formData.IssueDate}
                  onChange={handleInputChange}
                  className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  style={{
                    color: "rgba(174, 174, 174, 1)",
                    border: " 1px solid rgba(174, 174, 174, 1)",
                  }}
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Expiry date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="ExpiryDate"
                  value={formData.ExpiryDate}
                  onChange={handleInputChange}
                  className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  style={{
                    color: "rgba(174, 174, 174, 1)",
                    border: " 1px solid rgba(174, 174, 174, 1)",
                  }}
                />
              </div>
            </div>

            {/* ID Number */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                ID number
              </label>
              <input
                type="text"
                name="IdNumber"
                value={formData.IdNumber}
                onChange={handleInputChange}
                className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                style={{
                  color: "rgba(174, 174, 174, 1)",
                  border: " 1px solid rgba(174, 174, 174, 1)",
                }}
                placeholder="Ilearnova/Stu/001"
              />
            </div>

            {/* Grade */}
            <div>
              <label
                className="block lg:text-\[18px\] font-medium mb-2"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                Grade
              </label>
              <input
                type="text"
                name="Grade"
                value={formData.Grade}
                onChange={handleInputChange}
                className="w-full lg:text-\[20px\] lg:h-\[64px\] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                style={{
                  color: "rgba(174, 174, 174, 1)",
                  border: " 1px solid rgba(174, 174, 174, 1)",
                }}
                placeholder="Grade 3"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 mt-7">
        <button
          type="button"
          onClick={handlePreviewId}
          className="px-8 py-3 rounded-md lg:text-[20px] transition-colors duration-200 font-medium cursor-pointer"
          style={{
            color: "rgba(18, 40, 164, 1)",
            border: "1px solid rgba(18, 40, 164, 1)",
          }}
        >
          Preview ID
        </button>
        <button
          type="button"
          onClick={() => console.log("Form data:", formData)}
          className="px-8 py-3 bg-gray-400 text-[20px] rounded-md hover:bg-gray-500 transition-colors duration-200 font-medium text-white cursor-pointer"
        >
          Save
        </button>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white bg-blue-600 px-4 py-2 rounded -mx-6 -mt-6 mb-4">
                Upload Picture
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 absolute top-4 right-4 bg-white rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Step */}
            {uploadStep === "select" && (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  <p>Please upload your picture like following guidelines:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Clear face without sunglasses</li>
                    <li>Face lighting and background</li>
                    <li>File size below 5 MB</li>
                    <li>JPG, PNG, or PDF acceptable</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Drag Picture or Browse
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Browse
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Uploading Step */}
            {uploadStep === "uploading" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Uploading in progress... {uploadProgress}%
                  </p>
                </div>

                <div className="mb-6">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Success Step */}
            {uploadStep === "success" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-800 font-medium">
                    Image successfully uploaded
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleContinue}
                    className="bg-blue-600 text-white py-2 px-8 rounded hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
