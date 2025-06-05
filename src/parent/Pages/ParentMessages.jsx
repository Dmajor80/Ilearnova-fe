import { useState } from 'react';
import { Bell, Search, Calendar, MessageCircle, FileText, CreditCard, BarChart3, Users, Settings, ChevronLeft, ChevronRight, Phone, Video, MoreHorizontal } from 'lucide-react';
import DashboardHeader from "../components/DashboardHeader"
import SideMenu from "../components/SideMenu"

function ParentMessages() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 9)); // October 2024
  const [selectedDate, setSelectedDate] = useState(26);

  const announcements = [
    {
      title: "Annual Sports Day Scheduled!",
      description: "We are pleased to announce that our Annual Sports Day 2024. Students must register by Dec 5.",
      date: "Posted on 23rd December, 2024",
      type: "Event",
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Midterm Report Card Distribution",
      description: "You can now check and view all schedules on the portal from Nov 25, 2024. Please log in to review your child's progress.",
      date: "Posted on 23rd December, 2024",
      type: "Academic Reminder",
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Free Submission Deadline Extended",
      description: "The deadline for Fee Submission has been extended to Nov 30, 2024. Late fees will apply after this date.",
      date: "Posted on 23rd December, 2024",
      type: "Finance Urgent",
      color: "bg-red-100 text-red-800"
    },
    {
      title: "Parent-Teacher Meeting: Save the Date!",
      description: "Our PTA meeting on Jan 15, 2024, at 5 PM in the school auditorium. Attendance is highly encouraged.",
      date: "Posted on 23rd December, 2024",
      type: "Event-Parent Engagement",
      color: "bg-purple-100 text-purple-800"
    }
  ];

  const chatMessages = [
    { teacher: "Teacher XYZ", message: "Thank you! I will remind her.", time: "2:00PM", read: true },
    { teacher: "Teacher XYZ", message: "Good day, Mrs Daniel", time: "2:00PM", read: true },
    { teacher: "Teacher XYZ", message: "Please ensure Priscilla completes her Math assignments by today.", time: "2:00PM", read: true },
    { teacher: "Teacher XYZ", message: "Good day, Teacher xyz!", time: "2:00PM", read: true },
    { teacher: "Teacher XYZ", message: "Thank you! I will remind her.", time: "2:00PM", read: true }
  ];

  const upcomingEvents = [
    { title: "Parent-Teacher Meeting: Save the Date!", date: "December 22nd", time: "10:00 am" },
    { title: "Parent-Teacher Meeting: Save the Date!", date: "December 23rd", time: "10:00 am" }
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-full hover:bg-blue-100 ${day === selectedDate
            ? 'bg-blue-600 text-white'
            : day === 26
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-700 hover:text-blue-600'
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SideMenu />

      <div className="flex">
        {/* Sidebar */}
        {/* <aside className="hidden lg:block w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              <a href="#" className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 mr-3" />
                Dashboard
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <MessageCircle className="w-5 h-5 mr-3" />
                Messages
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 mr-3" />
                Payments
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 mr-3" />
                Reports
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 mr-3" />
                Attendance
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </a>
            </div>
          </nav>
        </aside> */}
        <DashboardHeader />
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">School Announcement</h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Page/Parent</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Notifications</span>
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">8</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Announcements */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {announcements.map((announcement, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${announcement.color}`}>
                        {announcement.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{announcement.description}</p>
                    <p className="text-xs text-gray-500 mb-4">{announcement.date}</p>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        {index === 0 ? 'Register now!' : index === 1 ? 'View Details' : index === 2 ? 'Pay now!' : 'Add to calendar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Teacher XYZ</h3>
                      <p className="text-sm text-gray-500">Class A</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Video className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Chat</h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {chatMessages.map((chat, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm text-gray-900">{chat.teacher}</span>
                            <span className="text-xs text-gray-500">{chat.time}</span>
                            {chat.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{chat.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar and Events */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Upcoming Classes</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentMessages;