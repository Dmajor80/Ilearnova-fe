import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Play, FileText, Download } from 'lucide-react';

function ProgressTracker({ course }) {
  const [completedLessons, setCompletedLessons] = useState([1, 2, 3]);

  const lessons = [
    {
      id: 1,
      title: "Introduction to Course",
      duration: "15 min",
      type: "video",
      completed: true,
      locked: false
    },
    {
      id: 2,
      title: "Basic Concepts Overview",
      duration: "25 min",
      type: "video",
      completed: true,
      locked: false
    },
    {
      id: 3,
      title: "Practice Exercises",
      duration: "30 min",
      type: "exercise",
      completed: true,
      locked: false
    },
    {
      id: 4,
      title: "Advanced Techniques",
      duration: "35 min",
      type: "video",
      completed: false,
      locked: false
    },
    {
      id: 5,
      title: "Real-world Applications",
      duration: "40 min",
      type: "video",
      completed: false,
      locked: false
    },
    {
      id: 6,
      title: "Final Assessment",
      duration: "60 min",
      type: "quiz",
      completed: false,
      locked: true
    },
    {
      id: 7,
      title: "Course Certificate",
      duration: "5 min",
      type: "certificate",
      completed: false,
      locked: true
    }
  ];

  const getIcon = (lesson) => {
    if (lesson.completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (lesson.locked) {
      return <Lock className="w-5 h-5 text-gray-400" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'exercise':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'certificate':
        return <Download className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video':
        return 'text-blue-600 bg-blue-100';
      case 'exercise':
        return 'text-green-600 bg-green-100';
      case 'quiz':
        return 'text-purple-600 bg-purple-100';
      case 'certificate':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Course Progress</h3>
        <div className="text-sm text-gray-500">
          {completedLessons.length} of {lessons.length} lessons completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((completedLessons.length / lessons.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className={`
              flex items-center space-x-3 p-3 rounded-lg transition-colors
              ${lesson.completed ? 'bg-green-50' : lesson.locked ? 'bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}
              ${!lesson.locked && !lesson.completed ? 'cursor-pointer' : ''}
            `}
          >
            <div className="flex-shrink-0">
              {getIcon(lesson)}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1
                  ${getTypeColor(lesson.type)}
                `}>
                  {getTypeIcon(lesson.type)}
                  <span className="capitalize">{lesson.type}</span>
                </span>
                {lesson.completed && (
                  <span className="text-xs text-green-600 font-medium">Completed</span>
                )}
                {lesson.locked && (
                  <span className="text-xs text-gray-400 font-medium">Locked</span>
                )}
              </div>

              <h4 className={`font-medium ${lesson.completed ? 'text-green-800' : lesson.locked ? 'text-gray-400' : 'text-gray-800'}`}>
                {lesson.title}
              </h4>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{lesson.duration}</span>
                {lesson.completed && (
                  <span className="text-xs text-green-600">Lesson {index + 1}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Completion */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Course Completion</span>
          <span className="text-sm text-gray-500">
            {Math.round((completedLessons.length / lessons.length) * 100)}%
          </span>
        </div>

        <button
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors
            ${completedLessons.length === lessons.length
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          disabled={completedLessons.length !== lessons.length}
        >
          {completedLessons.length === lessons.length ? 'Download Certificate' : 'Complete All Lessons'}
        </button>
      </div>
    </div>
  );
}

export default ProgressTracker;
