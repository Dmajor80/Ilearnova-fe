import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Calendar, MessageCircle, FileText, CreditCard, BarChart3, Users, Settings, ChevronLeft, ChevronRight, Phone, Video, MoreHorizontal, Send, Smile, Paperclip, Menu, X } from 'lucide-react';
import SideMenu from '../components/SideMenu';
import DashboardHeader from '../components/DashboardHeader';


const ParentMessages = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 9)); // October 2024
  const [selectedDate, setSelectedDate] = useState(26);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Teacher XYZ',
      message: "Thank you! I will remind her.",
      time: "2:00PM",
      read: true,
      isTeacher: true,
      avatar: 'bg-blue-500'
    },
    {
      id: 2,
      sender: 'You',
      message: "Good day, Mrs Daniel",
      time: "2:01PM",
      read: true,
      isTeacher: false,
      avatar: 'bg-orange-400'
    },
    {
      id: 3,
      sender: 'Teacher XYZ',
      message: "Please ensure Priscilla completes her Math assignments by today.",
      time: "2:02PM",
      read: true,
      isTeacher: true,
      avatar: 'bg-blue-500'
    },
    {
      id: 4,
      sender: 'You',
      message: "Good day, Teacher xyz!",
      time: "2:03PM",
      read: true,
      isTeacher: false,
      avatar: 'bg-orange-400'
    },
    {
      id: 5,
      sender: 'Teacher XYZ',
      message: "Thank you! I will remind her.",
      time: "2:04PM",
      read: true,
      isTeacher: true,
      avatar: 'bg-blue-500'
    }
  ]);

  const chatEndRef = useRef(null);

  const announcements = [
    {
      title: "Annual Sports Day Scheduled!",
      description: "We are pleased to announce that our Annual Sports Day 2024. Students must register by Dec 5.",
      date: "Posted on 23rd December, 2024",
      type: "Event",
      color: "bg-blue-100 text-blue-800",
      buttonText: "Register now!",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Midterm Report Card Distribution",
      description: "You can now check and view all schedules on the portal from Nov 25, 2024. Please log in to review your child's progress.",
      date: "Posted on 23rd December, 2024",
      type: "Academic Reminder",
      color: "bg-green-100 text-green-800",
      buttonText: "View Details",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Free Submission Deadline Extended",
      description: "The deadline for Fee Submission has been extended to Nov 30, 2024. Late fees will apply after this date.",
      date: "Posted on 23rd December, 2024",
      type: "Finance Urgent",
      color: "bg-red-100 text-red-800",
      buttonText: "Pay now!",
      buttonColor: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "Parent-Teacher Meeting: Save the Date!",
      description: "Our PTA meeting on Jan 15, 2024, at 5 PM in the school auditorium. Attendance is highly encouraged.",
      date: "Posted on 23rd December, 2024",
      type: "Event-Parent Engagement",
      color: "bg-purple-100 text-purple-800",
      buttonText: "Add to calendar",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const events = [
    { date: 22, title: "Parent-Teacher Meeting", color: "bg-yellow-100", time: "10:00 am" },
    { date: 22, title: "Parent-Teacher Meeting", color: "bg-yellow-100", time: "10:00 am" },
    { date: 26, title: "Parent-Teacher Meeting", color: "bg-yellow-100", time: "10:00 am" },
  ];

    useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'You',
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
        isTeacher: false,
        avatar: 'bg-orange-400'
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');

      // Simulate teacher response after 2 seconds
      setTimeout(() => {
        const teacherResponse = {
          id: chatMessages.length + 2,
          sender: 'Teacher XYZ',
          message: "Thank you for your message. I'll get back to you shortly.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
          isTeacher: true,
          avatar: 'bg-blue-500'
        };
        setChatMessages(prev => [...prev, teacherResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
      const hasEvent = day === 22 || day === 23;
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-full hover:bg-blue-100 transition-colors relative ${day === selectedDate
              ? 'bg-blue-600 text-white'
              : hasEvent
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
            }`}
        >
          {day}
          {hasEvent && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-orange-400 rounded-full"></div>
          )}
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

  const handleAnnouncementAction = (index) => {
    const actions = ['Registration submitted!', 'Details viewed!', 'Payment initiated!', 'Added to calendar!'];
    alert(actions[index]);
  };

  return (
    <div className="flex min-h-screen gap-2 bg-[#f5f8fe]">
      {/* Header */}

      <SideMenu />
      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 min-h-screen">
        <DashboardHeader text='PTA HUB' holder='Search announcement' />

        <div className="mb-6 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">School Announcement</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Announcements and Chat */}
          <div className="xl:col-span-2 space-y-6">
            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {announcements.map((announcement, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.color}`}>
                      {announcement.type}
                    </span>
                    <div className="text-xs text-gray-400">
                      {announcement.date.split(' ')[2]}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{announcement.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{announcement.description}</p>
                  <p className="text-xs text-gray-500 mb-6">{announcement.date}</p>
                  <button
                    onClick={() => handleAnnouncementAction(index)}
                    className={`w-full ${announcement.buttonColor} text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors transform hover:scale-105 active:scale-95`}
                  >
                    {announcement.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* Enhanced Chat Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Teacher XYZ</h3>
                      <p className="text-sm text-gray-600">Class A • Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-green-500 hover:bg-green-100 rounded-full transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-6 text-lg">Chat</h4>
                <div className="space-y-4 max-h-80 overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-gray-300">
                  {chatMessages.map((chat) => (
                    <div key={chat.id} className={`flex items-start space-x-3 ${!chat.isTeacher ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-10 h-10 ${chat.avatar} rounded-full flex-shrink-0 flex items-center justify-center shadow-sm`}>
                        <span className="text-white font-semibold text-sm">
                          {chat.isTeacher ? 'T' : 'Y'}
                        </span>
                      </div>
                      <div className={`flex-1 max-w-xs ${!chat.isTeacher ? 'text-right' : ''}`}>
                        <div className={`inline-block p-3 rounded-2xl ${chat.isTeacher
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-blue-500 text-white'
                          }`}>
                          <p className="text-sm leading-relaxed">{chat.message}</p>
                        </div>
                        <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${!chat.isTeacher ? 'justify-end' : ''}`}>
                          <span>{chat.time}</span>
                          {chat.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex items-end space-x-3 p-4 bg-gray-50 rounded-xl">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                
                  <div className="flex-1">
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full p-3 shadow-md shadow-inset rounded-lg resize-none   text-sm"
                      rows="1"
                    />
                    {/* focus:outline-none focus:border-transparent */}
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!chatMessage.trim()}
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and Events Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Calendar */}
            <div className="bg-white rounded-xl shadow-md p-6 ">
              <div className="flex items-center flex-row justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Upcoming Classes</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700 min-w-[120px] text-center">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>

            {/* Enhanced Upcoming Events */}
            <div className="bg-white rounded-xl shadow-md p-6 ">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Upcoming Events</h3>
              <div className="flex flex-col gap-2">
                {events.map((event, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3`}>
                    <img src="/icon.png" className='h-10 w-10' alt="icons" />
                    <div className='flex-row text-left'>
                      <span className="text-md md:text-lg text-blue-700">{event.title}</span>
                      <div className="flex items-center mt-2 ">
                        <li className="ml-auto text-xs text-gray-500">{`December ${event.date}`}</li>
                        <li className="ml-auto text-xs text-gray-500">{event.time}</li>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

  );
};

export default ParentMessages;
