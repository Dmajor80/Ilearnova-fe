import { useState, useEffect } from 'react';
import { Bell, Search, Play, BookOpen, Award, Download } from 'lucide-react';

// Demo notifications
const demoNotifications = [
  "📚 New course available: 'Data Science Fundamentals'",
  "🎯 Complete 3 more lessons to earn your certificate!",
  "📈 Your study streak is now 15 days! Keep it up!",
  "🏆 You've completed 75% of Advanced Mathematics",
  "📝 New assignment due in 2 days",
  "⭐ Great progress! You're in the top 10% of learners",
];

function LearningHeader() {
  const [showNotif, setShowNotif] = useState(false);
  const [notification, setNotification] = useState("");
  const [notifIndex, setNotifIndex] = useState(0);
  const [hasUnread, setHasUnread] = useState(false);

  // Show a new notification every 25 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNotification(demoNotifications[notifIndex]);
      setNotifIndex((prev) => (prev + 1) % demoNotifications.length);
      setShowNotif(false); // Hide popup until user clicks
      setHasUnread(true);  // Show red dot
    }, 25000);

    // Show the first notification immediately on mount
    setTimeout(() => {
      setNotification(demoNotifications[0]);
      setShowNotif(false);
      setHasUnread(true);
    }, 1000);

    return () => clearInterval(interval);
  }, [notifIndex]);

  // Show all notifications when icon is clicked, clear red dot
  const handleNotifClick = () => {
    setShowNotif(!showNotif);
    setHasUnread(false);
    setNotification(demoNotifications.join('\n\n'));
  };

  return (
    <div className="bg-white h-auto max-w-full border-b border-gray-200">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#f5f8fe]">
        <div>
          <p className="text-xs text-gray-500">Virtual Learning Platform</p>
          <h1 className="text-lg font-semibold text-gray-800">Learning Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses, lessons..."
              className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-36 md:w-56"
              aria-label="Search courses"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Play size={20} />
            </button>
            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <BookOpen size={20} />
            </button>
            <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
              <Award size={20} />
            </button>
            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <Download size={20} />
            </button>
          </div>

          <img
            src="/profile.png"
            loading='lazy'
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </header>

      {/* Welcome & Banner */}
      <section className="relative flex flex-col items-center mt-2 mb-8 px-4 md:px-8">
        <div className="flex w-full justify-between items-center mb-4">
          <div>
            <p className="text-lg text-gray-600">Welcome back,</p>
            <h2 className="text-2xl font-semibold text-[#1a237e]">Alex Johnson</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Notifications</span>
            <span className="relative">
              <button
                onClick={handleNotifClick}
                className="focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Show notifications"
              >
                <Bell className="w-5 h-5 text-gray-500" />
                {hasUnread && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              {/* Notification Dropdown */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-sm text-gray-700">
                  <div className="whitespace-pre-line max-h-60 overflow-y-auto">
                    {notification}
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>

        {/* Learning Banner */}
        <div className="relative w-full rounded-lg overflow-hidden h-32 flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-600 to-blue-700">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative text-center text-white z-10">
            <div className="flex items-center justify-center mb-2">
              <Play className="w-8 h-8 mr-2" />
              <h3 className="text-2xl font-bold">Continue Your Learning Journey</h3>
            </div>
            <p className="text-lg opacity-90">Master new skills at your own pace</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute left-4 top-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60"></div>
          <div className="absolute right-8 bottom-4 w-6 h-6 bg-green-300 rounded-full opacity-60"></div>
          <div className="absolute left-1/3 bottom-2 w-4 h-4 bg-pink-300 rounded-full opacity-60"></div>
        </div>

        {/* Profile Section */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <img
            src="/profile.png"
            loading='lazy'
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <div className="mt-2 text-center">
            <div className="font-semibold text-[#1736a4]">Alex Johnson</div>
            <div className="text-xs text-gray-500">Student ID: STU-2024-001</div>
            <div className="text-xs text-gray-500">Grade: 10 • Science Stream</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LearningHeader;
