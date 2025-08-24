import React, { useState } from "react";
import {
  Play,
  Pause,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import StudentDashboard from "./StudentDashboard";

export default function CoursePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);

  const lessons = [
    {
      id: 1,
      title: "Introduction to Physics",
      duration: "7:00",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      // id: 2,
      title: "Definition of Physics",
      duration: "5:30",
      thumbnail: "/api/placeholder/300/200",
    },
  ];

  const courseInfo = {
    title: "Introduction to Physics",
    instructor: "Dr. Johnson",
    totalStudents: 1250,
    description:
      "Step into the World of Physics Unravel the Secrets of Motion, Matter, and Energy!",
    objectives: [
      "Understand the fundamental principles of motion, energy, and matter. Dive deep into concepts, their properties, and relevance to scientific fields. Master equations that describe natural phenomena. By the end, every great scientist started with a question—so never stop asking!",
    ],
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentLesson > 1) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleNext = () => {
    if (currentLesson < lessons.length) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const currentLessonData = lessons.find(
    (lesson) => lesson.id === currentLesson
  );

  return (
    <>
      <StudentDashboard />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  My Courses
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Priscilla"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden mb-6">
                <div className="relative aspect-video">
                  <img
                    src="/api/placeholder/800/450"
                    alt="Physics lesson"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white ml-1" />
                      )}
                    </button>
                  </div>
                  {/* Video overlay with physics equations */}
                  <div className="absolute top-4 left-4 text-white text-sm">
                    <div className="space-y-1">
                      <div>F = ma</div>
                      <div>v = v₀ + at</div>
                      <div>E = mc²</div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white text-sm">
                    7:00 +3:6
                  </div>
                </div>
              </div>

              {/* Lesson Info */}
              <div className="flex   items-center justify-between mb-6">
                <div>
                  <p className="text-[8px] lg:text-[14px] text-gray-500 mb-1">
                    Lesson {currentLesson}
                  </p>
                  <h2 className="text-[10px] sm:text-[12px] lg:text-[24px] font-bold text-gray-900">
                    {currentLessonData?.title}
                  </h2>
                </div>
                <div className="flex  items-center space-x-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentLesson === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentLesson === lessons.length}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button className="border-b-2 border-blue-600 py-2 px-1 text-sm font-medium text-blue-600">
                    Teacher's Note
                  </button>
                  <button className="py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Exercises
                  </button>
                  <button className="py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Video Transcript
                  </button>
                </nav>
              </div>

              {/* Teacher's Note Content */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Need to know more?
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>Have a question about the introduction?</p>
                  <p>Get a discussion with your teacher on your staff</p>
                </div>
                <button className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Ask Questions
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Next Lesson Preview */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <p className="text-sm text-gray-500 mb-2">Lesson 2</p>
                <h3 className="text-lg font-semibold mb-4">
                  Definition of Physics
                </h3>
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/api/placeholder/300/200"
                    alt="Next lesson preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  In this lesson we will explore the fundamental principles of
                  motion, energy, and matter. Dive deep into concepts, their
                  properties, and relevance to scientific fields. Master
                  equations that describe natural phenomena. By the end, every
                  great scientist started with a question—so never stop asking!
                </p>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">
                  Course started by your friends
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Start Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
