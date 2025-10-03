import { useState } from 'react';
import { Play, Users, Clock, Star, Heart, Share2, Download } from 'lucide-react';

function CourseCard({ course, onSelect }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      {/* Course Thumbnail */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Play className="w-6 h-6 text-blue-600 ml-1" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-2 left-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
              course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}
          `}>
            {course.level}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-1 rounded-full transition-colors ${
              isLiked ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 hover:text-red-600'
            }`}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 bg-white text-gray-600 hover:text-blue-600 rounded-full transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 bg-white text-gray-600 hover:text-green-600 rounded-full transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4" onClick={() => onSelect()}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1">
            {course.title}
          </h3>
        </div>

        <p className="text-xs text-gray-600 mb-2">by {course.instructor}</p>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{course.duration}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            {course.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
