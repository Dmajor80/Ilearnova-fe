import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Clock, CheckCircle, BookOpen, Star, Users } from 'lucide-react';

const SelfPacedCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockCourses = [
      {
        id: 1,
        title: 'Introduction to Mathematics',
        description: 'Learn the fundamentals of mathematics including basic arithmetic and problem-solving.',
        category: 'Mathematics',
        difficulty: 'Beginner',
        duration: '8 hours',
        modules: 12,
        enrolledStudents: 245,
        rating: 4.5,
        thumbnail: '/api/placeholder/300/200',
        status: 'available'
      },
      {
        id: 2,
        title: 'Advanced English Literature',
        description: 'Explore classic literature and develop advanced reading and writing skills.',
        category: 'English',
        difficulty: 'Advanced',
        duration: '15 hours',
        modules: 20,
        enrolledStudents: 89,
        rating: 4.8,
        thumbnail: '/api/placeholder/300/200',
        status: 'available'
      },
      {
        id: 3,
        title: 'Basic Science Concepts',
        description: 'Understand fundamental scientific principles and natural phenomena.',
        category: 'Science',
        difficulty: 'Beginner',
        duration: '10 hours',
        modules: 15,
        enrolledStudents: 156,
        rating: 4.2,
        thumbnail: '/api/placeholder/300/200',
        status: 'available'
      },
      {
        id: 4,
        title: 'History of World Civilizations',
        description: 'Journey through the major civilizations and historical events that shaped our world.',
        category: 'History',
        difficulty: 'Intermediate',
        duration: '20 hours',
        modules: 25,
        enrolledStudents: 67,
        rating: 4.6,
        thumbnail: '/api/placeholder/300/200',
        status: 'available'
      }
    ];

    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
      const matchesDifficulty = filterDifficulty === 'all' || course.difficulty === filterDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
    setFilteredCourses(filtered);
  }, [courses, searchTerm, filterCategory, filterDifficulty]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueValues = (key) => {
    return ['all', ...new Set(courses.map(item => item[key]))];
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-current text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Self-Paced Courses</h1>
          <p className="text-gray-600 mt-1">Explore and enroll in courses at your own pace</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueValues('category').map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueValues('difficulty').map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Course Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <div className="flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.modules} modules</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

              {/* Rating and Enrollment */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(course.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({course.rating})</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledStudents} enrolled</span>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {course.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Start Course</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Course Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {courses.filter(c => c.difficulty === 'Beginner').length}
            </div>
            <div className="text-sm text-gray-600">Beginner Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {courses.filter(c => c.difficulty === 'Intermediate').length}
            </div>
            <div className="text-sm text-gray-600">Intermediate Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {courses.filter(c => c.difficulty === 'Advanced').length}
            </div>
            <div className="text-sm text-gray-600">Advanced Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfPacedCourseList;
