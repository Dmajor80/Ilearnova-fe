import React, { useState } from "react";
import CoursesComponent from "./components/CourseComponents";
import { Calendar, Clock, MapPin, User, Plus, Edit, Trash2, Download, Share, Bell } from "lucide-react";

const Timetable = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [selectedClass, setSelectedClass] = useState("all");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const classes = ["all", "Grade 6A", "Grade 7B", "Grade 8A", "Grade 9B", "Grade 10A"];

  const timetableData = {
    Monday: [
      { time: "8:00 AM - 9:00 AM", subject: "Mathematics", teacher: "Mr. Johnson", room: "Room 101", type: "Lecture", class: "Grade 8A", color: "bg-blue-500" },
      { time: "9:15 AM - 10:15 AM", subject: "Physics", teacher: "Ms. Davis", room: "Lab 201", type: "Lab", class: "Grade 8A", color: "bg-green-500" },
      { time: "10:30 AM - 11:30 AM", subject: "English", teacher: "Mrs. Wilson", room: "Room 105", type: "Lecture", class: "Grade 8A", color: "bg-purple-500" },
      { time: "1:00 PM - 2:00 PM", subject: "Chemistry", teacher: "Mr. Brown", room: "Lab 202", type: "Lab", class: "Grade 8A", color: "bg-red-500" },
      { time: "2:15 PM - 3:15 PM", subject: "Biology", teacher: "Ms. Green", room: "Lab 203", type: "Lab", class: "Grade 8A", color: "bg-yellow-500" },
    ],
    Tuesday: [
      { time: "8:00 AM - 9:00 AM", subject: "Chemistry", teacher: "Mr. Brown", room: "Lab 202", type: "Lab", class: "Grade 8A", color: "bg-red-500" },
      { time: "9:15 AM - 10:15 AM", subject: "Mathematics", teacher: "Mr. Johnson", room: "Room 101", type: "Lecture", class: "Grade 8A", color: "bg-blue-500" },
      { time: "10:30 AM - 11:30 AM", subject: "History", teacher: "Mr. Smith", room: "Room 106", type: "Lecture", class: "Grade 8A", color: "bg-indigo-500" },
      { time: "1:00 PM - 2:00 PM", subject: "English", teacher: "Mrs. Wilson", room: "Room 105", type: "Lecture", class: "Grade 8A", color: "bg-purple-500" },
      { time: "2:15 PM - 3:15 PM", subject: "Physics", teacher: "Ms. Davis", room: "Lab 201", type: "Lab", class: "Grade 8A", color: "bg-green-500" },
    ],
    Wednesday: [
      { time: "8:00 AM - 9:00 AM", subject: "Biology", teacher: "Ms. Green", room: "Lab 203", type: "Lab", class: "Grade 8A", color: "bg-yellow-500" },
      { time: "9:15 AM - 10:15 AM", subject: "History", teacher: "Mr. Smith", room: "Room 106", type: "Lecture", class: "Grade 8A", color: "bg-indigo-500" },
      { time: "10:30 AM - 11:30 AM", subject: "Mathematics", teacher: "Mr. Johnson", room: "Room 101", type: "Lecture", class: "Grade 8A", color: "bg-blue-500" },
      { time: "1:00 PM - 2:00 PM", subject: "Chemistry", teacher: "Mr. Brown", room: "Lab 202", type: "Lab", class: "Grade 8A", color: "bg-red-500" },
      { time: "2:15 PM - 3:15 PM", subject: "English", teacher: "Mrs. Wilson", room: "Room 105", type: "Lecture", class: "Grade 8A", color: "bg-purple-500" },
    ],
    Thursday: [
      { time: "8:00 AM - 9:00 AM", subject: "Physics", teacher: "Ms. Davis", room: "Lab 201", type: "Lab", class: "Grade 8A", color: "bg-green-500" },
      { time: "9:15 AM - 10:15 AM", subject: "Biology", teacher: "Ms. Green", room: "Lab 203", type: "Lab", class: "Grade 8A", color: "bg-yellow-500" },
      { time: "10:30 AM - 11:30 AM", subject: "History", teacher: "Mr. Smith", room: "Room 106", type: "Lecture", class: "Grade 8A", color: "bg-indigo-500" },
      { time: "1:00 PM - 2:00 PM", subject: "Mathematics", teacher: "Mr. Johnson", room: "Room 101", type: "Lecture", class: "Grade 8A", color: "bg-blue-500" },
      { time: "2:15 PM - 3:15 PM", subject: "Chemistry", teacher: "Mr. Brown", room: "Lab 202", type: "Lab", class: "Grade 8A", color: "bg-red-500" },
    ],
    Friday: [
      { time: "8:00 AM - 9:00 AM", subject: "English", teacher: "Mrs. Wilson", room: "Room 105", type: "Lecture", class: "Grade 8A", color: "bg-purple-500" },
      { time: "9:15 AM - 10:15 AM", subject: "Physics", teacher: "Ms. Davis", room: "Lab 201", type: "Lab", class: "Grade 8A", color: "bg-green-500" },
      { time: "10:30 AM - 11:30 AM", subject: "Biology", teacher: "Ms. Green", room: "Lab 203", type: "Lab", class: "Grade 8A", color: "bg-yellow-500" },
      { time: "1:00 PM - 2:00 PM", subject: "History", teacher: "Mr. Smith", room: "Room 106", type: "Lecture", class: "Grade 8A", color: "bg-indigo-500" },
      { time: "2:15 PM - 3:15 PM", subject: "Mathematics", teacher: "Mr. Johnson", room: "Room 101", type: "Lecture", class: "Grade 8A", color: "bg-blue-500" },
    ],
  };

  const timeSlots = [
    "8:00 AM", "9:15 AM", "10:30 AM", "1:00 PM", "2:15 PM"
  ];

  const filteredSessions = selectedClass === "all"
    ? timetableData[selectedDay] || []
    : (timetableData[selectedDay] || []).filter(session => session.class === selectedClass);

  const getTypeColor = (type) => {
    switch (type) {
      case "Lecture":
        return "bg-blue-100 text-blue-800";
      case "Lab":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentDay = days[now.getDay() - 1]; // 0 = Sunday, so Monday = 1

    if (currentDay !== selectedDay) return null;

    // Convert time slots to minutes
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
      return totalMinutes;
    };

    for (let i = 0; i < timeSlots.length; i++) {
      const slotStart = timeToMinutes(timeSlots[i]);
      const slotEnd = slotStart + 60; // Assuming 1 hour slots

      if (currentTime >= slotStart && currentTime < slotEnd) {
        return i;
      }
    }
    return null;
  };

  const currentSlotIndex = getCurrentTimeSlot();

  return (
    <>
      <CoursesComponent page="Timetable" />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Weekly Timetable</h2>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Add Session</span>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Class Selector */}
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls === "all" ? "All Classes" : cls}</option>
                  ))}
                </select>
                <User className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Grid View
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1">
                  <Bell className="w-4 h-4" />
                  <span>Remind</span>
                </button>
              </div>
            </div>

            {/* Day Selector */}
            <div className="flex space-x-2 overflow-x-auto">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedDay === day
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Timetable Content */}
          {viewMode === "list" ? (
            /* List View */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedDay}'s Schedule</h3>

                {filteredSessions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredSessions.map((session, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                          currentSlotIndex === index ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-900">{session.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{session.teacher}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{session.room}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="font-semibold text-gray-900 block">{session.subject}</span>
                            <span className="text-sm text-gray-600">{session.class}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(session.type)}`}>
                            {session.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No classes scheduled</h4>
                    <p className="text-gray-600">No classes are scheduled for {selectedDay}.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedDay}'s Schedule</h3>

                <div className="grid grid-cols-1 gap-4">
                  {timeSlots.map((timeSlot, index) => {
                    const session = filteredSessions.find(s => s.time.startsWith(timeSlot));
                    return (
                      <div
                        key={index}
                        className={`p-4 border border-gray-200 rounded-lg min-h-24 flex items-center ${
                          currentSlotIndex === index ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <div className="flex items-center space-x-4 w-full">
                          <div className="text-sm font-medium text-gray-600 w-32">{timeSlot}</div>
                          {session ? (
                            <div className={`flex-1 p-3 rounded-lg ${session.color} text-white`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{session.subject}</h4>
                                  <p className="text-sm opacity-90">{session.teacher}</p>
                                  <p className="text-sm opacity-90">{session.room}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-20`}>
                                    {session.type}
                                  </span>
                                  <div className="flex items-center space-x-1 mt-2">
                                    <button className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors">
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 text-center text-gray-400">
                              <span className="text-sm">No class scheduled</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {filteredSessions.length}
                </div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {filteredSessions.filter(s => s.type === 'Lab').length}
                </div>
                <div className="text-sm text-gray-600">Lab Sessions</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {filteredSessions.filter(s => s.type === 'Lecture').length}
                </div>
                <div className="text-sm text-gray-600">Lectures</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {Math.round(filteredSessions.reduce((sum, s) => {
                    const [start] = s.time.split(' - ');
                    const [time, period] = start.split(' ');
                    const [hours] = time.split(':').map(Number);
                    let totalHours = hours;
                    if (period === 'PM' && hours !== 12) totalHours += 12;
                    if (period === 'AM' && hours === 12) totalHours = 0;
                    return sum + totalHours;
                  }, 0) / filteredSessions.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Start Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timetable;
