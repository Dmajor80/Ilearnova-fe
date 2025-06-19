import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // <-- Add this import
import SideMenu from "../components/SideMenu";



const students = [
  { id: 1, name: "Priscilla Daniel" },
  { id: 2, name: "John Doe" },
];
const paymentPatterns = [
  { value: "full", label: "Full Payment" },
  { value: "installment", label: "Installment" },
];
const steps = [
  "Select Fee & Student",
  "Payment Details",
  "Review",
  "Double Review",
  "Complete",
];



const paymentMethods = [
  {
    value: "card",
    label: "Credit Card/Debit Card",
    icon: "/mastercard.png",
  },
  {
    value: "bank",
    label: "Bank Transfer",
    icon: "/Yandex.png",
  },
];

const bankAccounts = [
  {
    bank: "UBA",
    logo: "/uba.png",
    account: "1027791939",
    name: "DIMATECH IT CONSULTANCY AND GENERAL SERVICES",
  },
  {
    bank: "FIRSTBANK PLC",
    logo: "/firstbank.png",
    account: "2045750591",
    name: "DIMATECH IT CONSULTANCY AND GENERAL SERVICES",
  },
  {
    bank: "ZENITH BANK PLC",
    logo: "/zenith.png",
    account: "1228756225",
    name: "DIMATECH IT CONSULTANCY AND GENERAL SERVICES",
  },
];


export default function PaymentProcess() {
  const location = useLocation(); // <-- Add this line
  const fee = location.state?.fee; // <-- Get the fee object from navigation state
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [paymentPattern, setPaymentPattern] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [saveMethod, setSaveMethod] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Format card number as "1234 5678 9012 3456"
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  // Format expiry as "MM / YY"
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) value = value.replace(/^(\d{2})(\d{1,2})/, "$1 / $2");
    setExpiry(value);
  };

  // Format CVV as "123" or "1234" with space after 2 or 3 digits
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 4);
    if (value.length > 2) value = value.replace(/^(\d{3})(\d{1})/, "$1 $2");
    setCvv(value);
  };

  const handleProceed = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handleReturn = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-[#f5f8fe] flex flex-col md:flex-row">
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-gray-400">Page/Parent Portal</div>
            <div className="text-2xl font-bold text-[#1736a4]">Parent Portal</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Priscilla"
                className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-36 md:w-56"
                aria-label="Search"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <img
              src="/profile.png"
              alt="Profile"
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center text-xs font-bold
                      ${idx <= currentStep ? "bg-[#1736a4] text-white" : "bg-gray-200 text-gray-400"}
                    `}
                  >
                    {/* {idx + 1} */}
                  </div>
                  <span className={`mt-2 text-xs font-semibold ${idx === currentStep ? "text-[#1736a4]" : "text-gray-400"}`}>
                    {/* {step} */}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 md:mx-2 rounded ${idx < currentStep ? "bg-[#1736a4]" : "bg-gray-200"}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Select Fee & Student */}
        {currentStep === 0 && (
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            <div className="w-full max-w-xs">
              <select
                className="w-full mb-4 focus:outline-none border border-gray-300 rounded px-4 py-2"
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <select
                className="w-full focus:outline-none mb-6 border border-gray-300 rounded px-4 py-2"
                value={paymentPattern}
                onChange={e => setPaymentPattern(e.target.value)}
              >
                <option value="">Select payment pattern</option>
                {paymentPatterns.map((pattern) => (
                  <option key={pattern.value} value={pattern.value}>{pattern.label}</option>
                ))}
              </select>
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="font-bold text-lg text-[#1736a4] mb-2">
                  {fee ? fee.title : "Tuition Fee"}
                </div>
                <div className="text-3xl font-bold text-[#1736a4] mb-1">
                  ${fee ? fee.price : 100}
                  <span className="text-base font-normal text-gray-500">/ session</span>
                </div>
                <div className="text-gray-600 text-sm mb-4">
                  {fee
                    ? fee.desc
                    : "Empower your child’s learning journey for just $300 per session – quality education, personalized attention, and a brighter future."}
                </div>
              </div>
              <button
                className="w-full bg-[#1736a4] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                onClick={handleProceed}
                disabled={!selectedStudent || !paymentPattern}
              >
                Proceed to payment
              </button>
            </div>
            <div className="w-full hidden lg:block max-w-md justify-center">
              <img
                src="/payicon.png"
                alt="Payment Illustration"
                loading="lazy"
                className="rounded-2xl w-full max-w-xs"
              />
            </div>
          </div>
        )}

        {/* Step 2: Payment Method Selection */}
        {currentStep === 1 && (
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="text-xl font-semibold mb-2 text-center lg:text-left">Step 2: Payment Method Selection</div>
              <div className="text-sm text-gray-500 mb-4 text-center lg:text-left">
                Choose Your Preferred Payment Method for a Seamless Transaction
              </div>
              <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    className={`flex items-center justify-between w-full border rounded-lg px-4 py-3 mb-1 transition
                      ${selectedMethod === method.value
                        ? "border-[#1736a4] bg-blue-50"
                        : "border-gray-200 bg-white"
                      }
                    `}
                    onClick={() => setSelectedMethod(method.value)}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <img src={method.icon} alt={method.label} loading='lazy' className="w-7 h-7 object-contain" />
                      <span className="font-medium text-gray-700">{method.label}</span>
                    </div>
                    <span
                      className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selectedMethod === method.value
                        ? "border-[#1736a4] bg-[#1736a4]"
                        : "border-gray-300 bg-white"
                        }`}
                    >
                      {selectedMethod === method.value && (
                        <span className="block w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={saveMethod}
                  onChange={e => setSaveMethod(e.target.checked)}
                  className="form-checkbox rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Save payment method</span>
              </label>
              <button
                className="w-full bg-[#1736a4] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                onClick={handleProceed}
                disabled={!selectedMethod}
              >
                Continue
              </button>
            </div>
            <div className="w-full hidden lg:block max-w-md  justify-center">
              <img
                src="/methodicon.png"
                alt="Payment Illustration"
                loading="lazy"
                className="rounded-2xl w-full max-w-xs"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <>
            {/* Bank Transfer UI */}
            {selectedMethod === "bank" && (
              <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-6 flex flex-col gap-6 items-center">
                {/* Show alert when copied */}
                {copied && (
                  <div className="mb-2 px-4 py-2 bg-green-100 text-green-700 rounded transition">
                    Account number copied!
                  </div>
                )}
                <div className="text-center text-sm text-gray-700 mb-2">
                  Kindly pay into any bank of your choice via bank transfer
                </div>
                <div className="w-full flex flex-col gap-3">
                  {bankAccounts.map((acc) => (
                    <div key={acc.account} className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={acc.logo} loading='lazy' alt={acc.bank} className="w-10 h-10 object-contain" />
                        <div>
                          <div className="font-semibold text-[#1736a4] text-base">
                            <span className="text-[#1736a4] hover:underline cursor-pointer">{acc.account}</span> {acc.bank}
                          </div>
                          <div className="text-xs text-gray-600">{acc.name}</div>
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1 text-[#1736a4] text-sm font-medium lg:cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(acc.account);
                          setCopied(true);
                        }}
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" />
                          <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full bg-[#1736a4] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition mt-4"
                  onClick={() => setCurrentStep(4)}
                  type="button"
                >
                  I've Sent the Money
                </button>
                <button
                  className="w-full bg-gray-200 text-[#1736a4] py-3 rounded-lg font-semibold hover:bg-gray-300 transition mt-2"
                  onClick={handleReturn}
                  type="button"
                >
                  Previous
                </button>
              </div>
            )}

            {/* Card UI */}
            {selectedMethod === "card" && (
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-center min-h-[400px]">
                {/* Payment Details Form */}
                <div className="w-full max-w-md">
                  <div className="text-xl font-semibold mb-2 text-center lg:text-left">
                    Step 3: Payment Details Entry
                  </div>
                  <div className="text-sm text-gray-500 mb-4 text-center lg:text-left">
                    Use the dummy card below to test payment.<br />
                    <span className="font-semibold">Card Number:</span> 4242 4242 4242 4242<br />
                    <span className="font-semibold">Expiry:</span> 12 / 34<br />
                    <span className="font-semibold">CVV:</span> 123
                  </div>
                  <form
                    className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col gap-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      // Card validation (keep as in your code)
                      if (
                        cardName.trim().length > 0 &&
                        cardNumber.replace(/\s/g, "").length === 16 &&
                        /^\d{2} \/ \d{2}$/.test(expiry) &&
                        cvv.replace(/\s/g, "").length >= 3
                      ) {
                        // Dummy validation for the default card
                        if (
                          cardNumber.replace(/\s/g, "") === "4242424242424242" &&
                          expiry === "12 / 34" &&
                          cvv.replace(/\s/g, "") === "123"
                        ) {
                          // Simulate sending email (replace with real API/email logic)
                          await new Promise((res) => setTimeout(res, 1000));
                          alert("Payment successful! A receipt has been sent to your email.");
                          setCurrentStep(4);
                        } else {
                          alert("Invalid card details. Use the dummy card provided above.");
                        }
                      } else {
                        alert("Please fill all card details correctly and agree to the consent.");
                      }
                    }}
                  >
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name on Card</label>
                      <input
                        type="text"
                        className="w-full border focus:outline-none border-gray-300 rounded px-3 py-2"
                        placeholder="Priscilla Daniel"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Card Number</label>
                      <input
                        className="w-full border focus:outline-none border-gray-300 rounded px-3 py-2"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        autoComplete="cc-number"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Expiration Date</label>
                        <input
                          type="text"
                          className="w-full border focus:outline-none border-gray-300 rounded px-3 py-2"
                          placeholder="12 / 34"
                          maxLength={7}
                          inputMode="numeric"
                          value={expiry}
                          onChange={handleExpiryChange}
                          autoComplete="cc-exp"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">CVV</label>
                        <input
                          type="password"
                          className="w-full border focus:outline-none border-gray-300 rounded px-3 py-2"
                          placeholder="123"
                          maxLength={5}
                          inputMode="numeric"
                          value={cvv}
                          onChange={handleCvvChange}
                          autoComplete="cc-csc"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={saveMethod}
                          onChange={e => setSaveMethod(e.target.checked)}
                          className="form-checkbox rounded border-gray-300"
                        />
                        <span className="text-xs text-gray-600">Save payment method</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked
                          readOnly
                          className="form-radio rounded border-gray-300"
                        />
                        <span className="text-xs text-gray-600">Add New Card</span>
                      </label>
                    </div>
                    {/* Payment Summary */}
                    <div className="bg-white rounded-xl shadow p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Subtotal</span>
                        <span>${fee ? fee.price : "100.00"}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Discount/ Scholarship</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Service Charge</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold mt-2">
                        <span className="text-[#1736a4]">Total Amount Due</span>
                        <span className="text-[#1736a4]">${fee ? fee.price : "100.00"}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                      <button
                        className="w-full bg-[#1736a4] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                        onClick={handleReturn}
                        type="button"
                      >
                        Previous
                      </button>
                      <button
                        className={`w-full bg-[#1736a4] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition`}
                        type="submit"
                      >
                        Pay Now
                      </button>
                    </div>
                  </form>
                </div>
                {/* Card Illustration */}
                <div className="w-full hidden lg:block max-w-md justify-center">
                  <img
                    src="/bankcard.png"
                    alt="Cards Illustration"
                    loading="lazy"
                    className="rounded-2xl w-full max-w-xs"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 5: Complete */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-xl font-semibold mb-6 text-center">
              Step 5: Confirmation
            </div>
            <div className="">
              <img
                src="/success.png"
                alt="Cards Illustration"
                loading="lazy"
                className="w-full max-w-xs"
              />
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="text-2xl font-bold text-green-600 mb-2">Payment Successful</div>
              <div className="text-gray-600 text-center">
                Your payment was successful! Thank you. Send a screenshot of the payment reciept to <a href="tel:+2349050119078" className='text-blue-500 font-bold underline-none'>+2349050119078</a>.
              </div>
            </div>
            <button
              className="w-full max-w-md bg-[#1736a4] cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
              onClick={() => window.location.href = "/parent-payments"}
              type="button"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}