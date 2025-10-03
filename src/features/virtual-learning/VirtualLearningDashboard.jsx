import React, { useState, useEffect } from 'react';
import { Play, BookOpen, Users, Award, Clock, Star, Download, Share2, Heart } from 'lucide-react';
import ProgressTracker from './components/ProgressTracker';
import { http } from '../../api/baseClient';

const VirtualLearningDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await http.get('/api/courses');
        setCourses(data?.data || data || []);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading courses...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Virtual Learning</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Expand your knowledge! Explore our comprehensive online courses and interactive learning modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(courses || []).map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {course.title.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">Course</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{course.duration || 'N/A'}</span>
                <span>Enrolled: {course.students_count || 0}</span>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualLearningDashboard;
