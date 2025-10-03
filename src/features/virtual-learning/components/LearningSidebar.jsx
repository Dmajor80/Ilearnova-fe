import { useState } from 'react';
import {
  Menu,
  X,
  Play,
  BookOpen,
  Users,
  Award,
  Clock,
  Star,
  Settings,
  Library,
  Download,
  MessageSquare
} from 'lucide-react';

function LearningSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { icon: Play, label: 'Dashboard', id: 'dashboard', href: '/learning-dashboard' },
    { icon: BookOpen, label: 'My Courses', id: 'courses', href: '/learning-courses' },
    { icon: Clock, label: 'Continue Learning', id: 'continue', href: '/learning-continue' },
    { icon: Library, label: 'Course Library', id: 'library', href: '/learning-library' },
    { icon: Award, label: 'Certificates', id: 'certificates', href: '/learning-certificates' },
    { icon: Download, label: 'Downloads', id: 'downloads', href: '/learning-downloads' },
    { icon: MessageSquare, label: 'Discussion', id: 'discussion', href: '/learning-discussion' },
    { icon: Star, label: 'Favorites', id: 'favorites', href: '/learning-favorites' },
    { icon: Settings, label: 'Settings', id: 'settings', href: '/learning-settings' },
  ];

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-55 bg-white z-40 border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
              Virtual Learning
            </h1>
            <p className="text-xs text-gray-500 text-center">Learn Anywhere</p>
            <hr className="border-blue-900 mt-4" />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveItem(item.id);
                    if (window.innerWidth < 1024) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full text-left
                    ${isActive
                      ? 'bg-[#1736a4] text-white font-semibold'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Learning Progress */}
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">This Week</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Study Time</span>
                  <span>12/20 hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Courses Progress</span>
                  <span>3/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Keep it up! 🔥</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-2">
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Start Learning
            </button>
            <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningSidebar;
