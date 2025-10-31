import React, { useState, useEffect } from "react";
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
  Loader2,
  Filter,
  BookOpen,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { getStudentCourses } from "../../api/dashboardApi";

// Sample course data with realistic educational content
const SAMPLE_COURSES = [
  {
    id: 1,
    name: "Advanced Mathematics",
    code: "MATH-301",
    description: "Comprehensive study of calculus, algebra, and mathematical analysis",
    status: "active",
    subject: { name: "Mathematics", id: 1 },
    class: { name: "Grade 12", id: 12 },
    teacher: {
      name: "Dr. Sarah Johnson",
      id: 1,
      avatar: "/api/placeholder/40/40"
    },
    start_date: "2024-01-15",
    total_lessons: 24,
    completed_lessons: 8,
    progress: 33,
    thumbnail: "/api/placeholder/320/200",
    rating: 4.8,
    enrolled_students: 28
  },
  {
    id: 2,
    name: "Physics Fundamentals",
    code: "PHYS-201",
    description: "Introduction to mechanics, thermodynamics, and wave phenomena",
    status: "active",
    subject: { name: "Physics", id: 2 },
    class: { name: "Grade 11", id: 11 },
    teacher: {
      name: "Prof. Michael Chen",
      id: 2,
      avatar: "/api/placeholder/40/40"
    },
    start_date: "2024-01-10",
    total_lessons: 20,
    completed_lessons: 15,
    progress: 75,
    thumbnail: "/api/placeholder/320/200",
    rating: 4.9,
    enrolled_students: 32
  },
  {
    id: 3,
    name: "English Literature",
    code: "ENG-202",
    description: "Exploring classic and contemporary literature with critical analysis",
    status: "active",
    subject: { name: "English", id: 3 },
    class: { name: "Grade 10", id: 10 },
    teacher: {
      name: "Ms. Emily Rodriguez",
      id: 3,
      avatar: "/api/placeholder/40/40"
    },
    start_date: "2024-02-01",
    total_lessons: 18,
    completed_lessons: 5,
    progress: 28,
    thumbnail: "/api/placeholder/320/200",
    rating: 4.7,
    enrolled_students: 25
  },
  {
    id: 4,
    name: "Chemistry Lab Techniques",
    code: "CHEM-301",
    description: "Hands-on laboratory skills and chemical analysis methods",
    status: "draft",
    subject: { name: "Chemistry", id: 4 },
    class: { name: "Grade 12", id: 12 },
    teacher: {
      name: "Dr. Robert Kim",
      id: 4,
      avatar: "/api/placeholder/40/40"
    },
    start_date: "2024-03-01",
    total_lessons: 16,
    completed_lessons: 0,
    progress: 0,
    thumbnail: "/api/placeholder/320/200",
    rating: 4.6,
    enrolled_students: 20
  },
  {
    id: 5,
    name: "World History",
    code: "HIST-101",
    description: "Comprehensive overview of world civilizations and historical events",
    status: "completed",
    subject: { name: "History", id: 5 },
    class: { name: "Grade 9", id: 9 },
    teacher: {
      name: "Mr. David Thompson",
      id: 5,
      avatar: "/api/placeholder/40/40"
    },
    start_date: "2023-09-01",
    total_lessons: 22,
    completed_lessons: 22,
    progress: 100,
    thumbnail: "/api/placeholder/320/200",
    rating: 4.8,
    enrolled_students: 35
  },
  {
    id: 6,
    name: "Computer Science Fundamentals",
    code: "CS-101",
    description: "Introduction to programming, algorithms, and computational thinking",
    status: "active",
    subject: { name: "Computer Science", id: 6 },
    class: { name: "Grade 11", id: 11 },
    teacher: {
      name: "Ms. Lisa Wang",
      id: 6,
      avatar: "/api/placeholder/40/40"
    },
    start_date: "2024-01-20",
    total_lessons: 25,
    completed_lessons: 12,
    progress: 48,
    thumbnail: "/api/placeholder/320/200",
    rating: 4.9,
    enrolled_students: 30
  }
];


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

// Enhanced Course card component with modern design
function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    navigate(`/student-dashboard/courses/${course.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-slate-200">
      <div className="relative">
        <img
          src="/api/placeholder/320/200"
          alt={course.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <button
          onClick={handleCourseClick}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ArrowIcon />
        </button>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.status === 'active' ? 'bg-green-500 text-white' :
            course.status === 'draft' ? 'bg-yellow-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {course.status || 'Unknown'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">{course.name}</h3>
        <div className="flex items-center mb-4">
          <img
            src="/api/placeholder/40/40"
            alt={course.teacher?.name || 'Teacher'}
            className="w-10 h-10 rounded-full mr-3 border-2 border-blue-100"
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">{course.teacher?.name || 'Unknown Teacher'}</p>
            <p className="text-xs text-slate-500">
              {course.subject?.name || 'Subject'} • {course.class?.name || 'Class'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600">Code: {course.code || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-slate-600">Enrolled</span>
          </div>
        </div>
        {course.start_date && (
          <div className="flex items-center space-x-1 text-xs text-slate-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>Started: {new Date(course.start_date).toLocaleDateString()}</span>
          </div>
        )}
        <button
          onClick={handleCourseClick}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
}

// Main courses component with enhanced UI
export function CoursesComponent({ courses }) {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getStudentCourses();
        // Use API data if available, otherwise fall back to sample data
        const apiCourses = response.data?.courses || response.data?.enrollments || [];
        const coursesToUse = apiCourses.length > 0 ? apiCourses : SAMPLE_COURSES;
        setCoursesData(coursesToUse);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        // Fall back to sample data on error
        setCoursesData(SAMPLE_COURSES);
        setError(null); // Don't show error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const coursesToDisplay = courses && courses.length > 0 ? courses : coursesData;

  // Filter and search courses
  const filteredCourses = coursesToDisplay.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
          <p className="text-slate-600 text-lg font-medium">Loading your courses...</p>
          <p className="text-slate-500 text-sm mt-2">Please wait while we fetch your learning materials</p>
        </div>
      </div>
    );
  }

  if (error && coursesData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            My Courses
          </h1>
          <p className="text-slate-600 text-lg">Continue your learning journey and explore new subjects</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses, teachers, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>Showing {filteredCourses.length} of {coursesToDisplay.length} courses</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No courses found</h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || filterStatus !== 'all'
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't enrolled in any courses yet"}
                </p>
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {coursesToDisplay.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Learning Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{coursesToDisplay.length}</div>
                <div className="text-sm text-slate-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {coursesToDisplay.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-slate-600">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {coursesToDisplay.filter(c => c.status === 'completed').length}
                </div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
            </div>
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Lesson {currentLesson}
                </p>
                <h2 className="text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-bold text-gray-900">
                  {currentLessonData?.title}
                </h2>
              </div>
              <div className="flex items-center space-x-2 mt-3.5 lg:mt-0">
                <button
                  onClick={handlePrevious}
                  disabled={currentLesson === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors "
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
                <button className="border-b-2 border-blue-600 py-2 px-1 text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12pxs] font-medium text-blue-600">
                  Teacher's Note
                </button>
                <button className="py-2 px-1 text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12pxs] font-medium text-gray-500 hover:text-gray-700">
                  Exercises
                </button>
                <button className="py-2 px-1 text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12pxs] font-medium text-gray-500 hover:text-gray-700">
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


