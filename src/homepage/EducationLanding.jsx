import React, { useState, useEffect } from "react";
import junior from "../homepage/junior.png";
import secondary from "../homepage/secondary.png";
import senior from "../homepage/senior.png";
const EducationLanding = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Header Section */}
      <div className="text-center py-16 px-8">
        <h1
          className={`text-5xl md:text-6xl font-bold text-purple-900 mb-8 tracking-tight transform transition-all duration-1000 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          No one is left behind!
        </h1>
        <p
          className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Our lessons are designed to match the needs of students
          <br />
          across various grades, including Primary, Junior Secondary,
          <br />
          and Senior Secondary levels.
        </p>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-8 pb-16">
        <div className="grid md:grid-cols-4 gap-8  mx-auto">
          {/* Primary Card */}
          <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="">
              <img src={junior} alt="" className="w-full" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                Primary
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Immersive lessons covering Mathematics, English and Science for
                the perfect academic head-start.
              </p>
            </div>
          </div>

          {/* Junior Secondary Card */}
          <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="h-64 ">
              <img src={secondary} alt="" className="w-full" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                Junior Secondary
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Easy-to-understand lessons in Maths, English and Basic Science
                and Technology to help your child solve problems like a pro.
              </p>
            </div>
          </div>

          {/* Senior Secondary Card */}
          <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="h-64 ">
              <img src={senior} alt="" className="w-full" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                Senior Secondary
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Master difficult concepts with simplified lessons covering
                Mathematics, English, Sciences, Arts & Commercials.
              </p>
            </div>
          </div>
          {/* tertiary Card */}
          <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="h-64 ">
              <img
                src="https://plus.unsplash.com/premium_photo-1661375359328-bc2a7948a7fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHRlcnRpYXJ5JTIwZWR1Y2F0aW9ufGVufDB8fDB8fHww"
                alt=""
                className="w-full"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                Tertiary Education
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Master difficult concepts with simplified lessons covering
                Mathematics, English, Sciences, Arts & Commercials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      {/* <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 bg-opacity-30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-blue-200 bg-opacity-20 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200 bg-opacity-25 rounded-full blur-xl animate-float-reverse"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-purple-300 bg-opacity-30 rounded-full blur-lg animate-float"></div>
      </div> */}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(90deg);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(20px) rotate(-180deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EducationLanding;
