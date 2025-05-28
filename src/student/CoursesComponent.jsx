import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Play,
  Pause,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

// Simple arrow icon component
function ArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// Student Dashboard Component (placeholder)
function StudentDashboard() {
  return (
    <div className="bg-blue-600 text-white p-4">
      <h2 className="text-xl font-semibold">Student Dashboard</h2>
    </div>
  );
}

// Course card component with navigation
// Course card component with navigation
function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    navigate(`/student-dashboard/courses/${course.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleCourseClick}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
        >
          <ArrowIcon />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-2">{course.title}</h3>
        <div className="flex items-center mb-2">
          <img
            src="/api/placeholder/32/32"
            alt={course.teacher}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium">{course.teacher}</p>
            <p className="text-xs text-gray-500">
              {course.lessons} Lessons - {course.themes} Key Themes
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs mt-2">
          <span>Date Started: {course.dateStarted}</span>
          <span className="font-medium text-blue-600">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
          <div
            className="bg-blue-600 h-1 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
// Main courses component
export function CoursesComponent({ courses }) {
  const coursesToDisplay =
    courses && courses.length > 0 ? courses : sampleCourses;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {coursesToDisplay.length > 0 ? (
          coursesToDisplay.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-3 text-center p-8">
            <p className="text-gray-500">No courses available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Course Page Component
// Fixed CoursePage Component with corrected navigation function
export function CoursePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const navigate = useNavigate();

  const lessons = [
    {
      id: 1,
      title: "Introduction to Physics",
      duration: "7:00",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 2,
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

  // Fixed navigation function - should navigate to the student dashboard courses route
  const handleBackToCourses = () => {
    navigate("/student-dashboard/courses");
  };

  const currentLessonData = lessons.find(
    (lesson) => lesson.id === currentLesson
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToCourses}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Course
              </button>
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Lesson {currentLesson}
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentLessonData?.title}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
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
              <h3 className="text-lg font-semibold mb-4">Need to know more?</h3>
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
                properties, and relevance to scientific fields.
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
                Continue Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample courses data
const sampleCourses = [
  {
    id: 1,
    title: "Introduction to Physics",
    teacher: "Teacher A",
    lessons: 15,
    themes: 3,
    dateStarted: "10/01/2024",
    progress: 40,
    image: "/api/placeholder/320/200",
  },
  {
    id: 2,
    title: "Introduction to Chemistry",
    teacher: "Teacher B",
    lessons: 20,
    themes: 4,
    dateStarted: "01/03/2024",
    progress: 50,
    image: "/api/placeholder/320/200",
  },
  {
    id: 3,
    title: "Use Of English",
    teacher: "Teacher C",
    lessons: 30,
    themes: 5,
    dateStarted: "01/01/2024",
    progress: 40,
    image: "/api/placeholder/320/200",
  },
  {
    id: 4,
    title: "Advanced Mathematics",
    teacher: "Teacher D",
    lessons: 25,
    themes: 6,
    dateStarted: "15/02/2024",
    progress: 60,
    image: "/api/placeholder/320/200",
  },
  {
    id: 5,
    title: "Biology Fundamentals",
    teacher: "Teacher E",
    lessons: 18,
    themes: 4,
    dateStarted: "05/03/2024",
    progress: 30,
    image: "/api/placeholder/320/200",
  },
  {
    id: 6,
    title: "World History",
    teacher: "Teacher F",
    lessons: 22,
    themes: 7,
    dateStarted: "20/01/2024",
    progress: 75,
    image: "/api/placeholder/320/200",
  },
];
