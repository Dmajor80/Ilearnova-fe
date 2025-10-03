import { useState } from 'react';
import {
  Menu,
  X,
  Calendar,
  Gift,
  Bell,
  Users,
  Settings,
  Heart,
  Star
} from 'lucide-react';

function BirthdaySidebar({ isMobileMenuOpen, setIsMobileMenuOpen, selectedView, setSelectedView }) {
  const [activeItem, setActiveItem] = useState('today');

  const menuItems = [
    { icon: Calendar, label: 'Today', id: 'today', href: '/birthday-dashboard' },
    { icon: Gift, label: 'Upcoming', id: 'upcoming', href: '/birthday-upcoming' },
    { icon: Bell, label: 'Reminders', id: 'reminders', href: '/birthday-reminders' },
    { icon: Users, label: 'Family', id: 'family', href: '/birthday-family' },
    { icon: Heart, label: 'Wishes', id: 'wishes', href: '/birthday-wishes' },
    { icon: Star, label: 'History', id: 'history', href: '/birthday-history' },
    { icon: Settings, label: 'Settings', id: 'settings', href: '/birthday-settings' },
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
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
              Birthday Alerts
            </h1>
            <hr className="border-blue-900" />
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
                    setSelectedView(item.id);
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

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">This Month</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Birthdays</span>
                <span className="font-semibold text-[#1736a4]">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Wishes Sent</span>
                <span className="font-semibold text-green-600">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reminders</span>
                <span className="font-semibold text-orange-600">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BirthdaySidebar;
