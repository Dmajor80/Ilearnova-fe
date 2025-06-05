import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
const IlearnovaHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const slides = [
    {
      title: "WELCOME BACK TO SCHOOL",
      subtitle: "Students",
      description:
        "Dive into a world of interactive learning with personalized courses, engaging projects, and collaborative study groups. Your academic journey starts here!",
      icon: <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "from-purple-500 via-purple-600 to-blue-600",
      bgColor: "bg-gradient-to-br from-purple-500/20 to-blue-500/20",
      goto: "/login",
    },
    {
      title: "EMPOWER YOUR TEACHING",
      subtitle: "Teachers",
      description:
        "Transform your classroom with innovative tools, student analytics, and seamless curriculum management. Make every lesson count!",
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "from-emerald-500 via-green-600 to-teal-600",
      bgColor: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
      goto: "/teacher-login",
    },
    {
      title: "TRACK THEIR PROGRESS",
      subtitle: "Parents",
      description:
        "Stay connected with your child's educational journey through real-time updates, progress reports, and direct communication with teachers.",
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "from-orange-500 via-red-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-orange-500/20 to-pink-500/20",
      goto: "/parent-login",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const FloatingShape = ({ delay, duration, className, children }) => (
    <div
      className={`absolute opacity-30 transition-all duration-1000 ${className}`}
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: `translate(${mousePosition.x * 0.02}px, ${
          mousePosition.y * 0.02
        }px)`,
      }}
    >
      {children}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes grid-move {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(50px) translateX(50px); }
        }
      `}</style>

      <div
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full"
      >
        {/* Interactive Background */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              animation: "grid-move 20s linear infinite",
            }}
          />
        </div>

        {/* Enhanced Floating Elements */}
        <FloatingShape
          delay={0}
          duration={8}
          className="w-16 h-16 sm:w-20 sm:h-20 top-10 sm:top-20 left-5 sm:left-10"
        >
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </FloatingShape>

        <FloatingShape
          delay={1}
          duration={10}
          className="w-14 h-14 sm:w-16 sm:h-16 top-32 sm:top-40 right-10 sm:right-20"
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center rotate-12">
            <Star className="w-6 h-6 text-white" />
          </div>
        </FloatingShape>

        <FloatingShape
          delay={2}
          duration={12}
          className="w-18 h-18 sm:w-24 sm:h-24 bottom-32 sm:bottom-40 left-10 sm:left-20"
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center -rotate-12">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </FloatingShape>

        <FloatingShape
          delay={3}
          duration={9}
          className="w-10 h-10 sm:w-12 sm:h-12 bottom-16 sm:bottom-20 right-32 sm:right-40"
        >
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </FloatingShape>

        <FloatingShape
          delay={4}
          duration={7}
          className="w-6 h-6 sm:w-8 sm:h-8 top-48 sm:top-60 left-1/3 sm:left-1/2"
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-xl rotate-45" />
        </FloatingShape>

        {/* Enhanced Parallax Background */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ${slides[currentSlide].bgColor}`}
          style={{
            transform: `translateY(${scrollY * 0.3}px) scale(${
              1 + scrollY * 0.0002
            })`,
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
            {/* Text Content */}
            <div
              className={`space-y-6 sm:space-y-8 text-center lg:text-left transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {/* Brand */}
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 sm:p-3 rounded-xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-wider">
                  ILEARNOVA
                </h1>
              </div>

              {/* Dynamic Content */}
              <div
                className={`space-y-4 sm:space-y-6 transition-all duration-700 ease-in-out transform ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
                style={{ transitionDelay: "0.2s" }}
              >
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div
                    className={`bg-gradient-to-r ${slides[currentSlide].color} p-2 rounded-lg text-white transition-all duration-500 shadow-xl transform hover:scale-110`}
                  >
                    {slides[currentSlide].icon}
                  </div>
                  <span className="text-yellow-400 font-semibold text-base sm:text-lg">
                    For {slides[currentSlide].subtitle}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                  {slides[currentSlide].title}
                  {/* <span className="ml-2 sm:ml-3 text-xl sm:text-2xl">🎒📚</span> */}
                </h2>

                <p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {slides[currentSlide].description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform transition-all duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "0.4s" }}
              >
                <Link to={slides[currentSlide].goto}>
                  <button className="group bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </Link>
                <button className="group bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span>Watch Demo</span>
                  </span>
                </button>
              </div>

              {/* Slide Indicators */}
              <div
                className={`flex justify-center lg:justify-start space-x-2 pt-4 transition-all duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
                style={{ transitionDelay: "0.6s" }}
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      index === currentSlide
                        ? "bg-yellow-400 w-6 sm:w-8 shadow-lg"
                        : "bg-white/30 w-2 sm:w-3 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Image/Visual Content */}
            <div
              className={`relative mt-8 lg:mt-0 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700 ease-out">
                {/* Main Image Container */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
                  <img
                    src="https://dimatech-lsm-frontend.vercel.app/group1.png"
                    alt="Students learning together"
                    className="w-full h-auto object-contain rounded-xl sm:rounded-2xl"
                  />

                  {/* Enhanced Floating Stats */}
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-gradient-to-r from-emerald-400 via-green-500 to-blue-500 text-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
                      <div className="text-center">
                        <div className="text-xs sm:text-sm font-bold">98%</div>
                        <div className="text-xs">Success</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                      <div className="text-center">
                        <div className="text-xs sm:text-sm font-bold">50K+</div>
                        <div className="text-xs">Users</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 -right-2 sm:-right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 sm:p-3 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-110 animate-bounce">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>

              {/* Enhanced Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl -z-10 animate-pulse"></div>
              <div
                className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-xl -z-10 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            className="w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
              className="text-white/10"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
              className="text-white/20"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
              className="text-white/30"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default IlearnovaHero;
