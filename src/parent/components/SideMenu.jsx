import { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  CreditCard,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';
import { Link } from "react-router-dom";


function SideMenu() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/parent-dashboard' },
    { icon: MessageSquare, label: 'Messages', href: '/parent-messages' },
    { icon: CreditCard, label: 'Payments', href: '/parent-payments' },
    { icon: FileText, label: 'Result', href: '/parent-results' },
    { icon: Calendar, label: 'Attendance', href: '/parent-attendance' },
    { icon: Clock, label: 'Timetable', href: '/parent-timetable' },
  ];
  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-55 bg-gray-50 z-40
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <a href='/'>
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                ILEARNOVA
              </h1>
            </a>
            <hr className="border-blue-900" />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive
                      ? 'bg-gray-200 text-gray-800 font-semibold'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => {
                    setActiveItem(item.label);
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

    </div>
  );
}

export default SideMenu
