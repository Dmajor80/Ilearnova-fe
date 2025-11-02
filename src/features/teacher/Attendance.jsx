import React, { useState } from "react";
import CoursesComponent from "./components/CourseComponents";
import { Search, Filter, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Download, Users, TrendingUp, BarChart3 } from "lucide-react";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const classes = ["Grade 6A", "Grade 7B", "Grade 8A", "Grade 9B", "Grade 10A"];

  const attendanceData = [
    {
      id: 1,
      name: "John Doe",
      rollNumber: "001",
      class: "Grade 8A",
      status: "present",
      checkInTime: "8:15 AM",
      checkOutTime: "3:45 PM",
      totalHours: "7.5",
      remarks: "On time"
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNumber: "002",
      class: "Grade 7B",
      status: "present",
      checkInTime: "8:05 AM",
      checkOutTime: "3:50 PM",
      totalHours: "7.75",
      remarks: "Early arrival"
    },
    {
      id: 3,
      name: "Alice Johnson",
      rollNumber: "003",
      class: "Grade 9B",
      status: "late",
      checkInTime: "8:45 AM",
      checkOutTime: "3:40 PM",
      totalHours: "6.92",
      remarks: "Late by 30 minutes"
    },
    {
      id: 4,
      name: "Bob Lee",
      rollNumber: "004",
      class: "Grade 6A",
      status: "absent",
      checkInTime: "-",
      checkOutTime: "-",
      totalHours: "0",
      remarks: "Medical leave"
    },
    {
      id: 5,
      name: "Charlie Kim",
      rollNumber: "005",
      class: "Grade 10A",
      status: "present",
      checkInTime: "8:10 AM",
      checkOutTime: "3:55 PM",
      totalHours: "7.75",
      remarks: "On time"
    },
    {
      id: 6,
      name: "Dana White",
      rollNumber: "006",
      class: "Grade 8A",
      status: "excused",
      checkInTime: "-",
      checkOutTime: "-",
      totalHours: "0",
      remarks: "Family emergency"
    }
  ];

  const filteredStudents = attendanceData.filter(student => {
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "late":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "excused":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "excused":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateStats = () => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(s => s.status === 'present').length;
    const absent = filteredStudents.filter(s => s.status === 'absent').length;
    const late = filteredStudents.filter(s => s.status === 'late').length;
    const excused = filteredStudents.filter(s => s.status === 'excused').length;

    return { total, present, absent, late, excused };
  };

  const stats = calculateStats();

  return (
    <>
      <CoursesComponent page="Attendance" />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1">
              {["daily", "weekly", "monthly", "reports"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Filters and Date Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">{stats.present}</div>
                  <div className="text-sm text-gray-600">Present</div>
                  <div className="text-xs text-green-600">
                    {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% attendance
                  </div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-1">{stats.absent}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                  <div className="text-xs text-red-600">
                    {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}% absent
                  </div>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.late}</div>
                  <div className="text-sm text-gray-600">Late</div>
                  <div className="text-xs text-yellow-600">
                    {stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}% late
                  </div>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">{stats.excused}</div>
                  <div className="text-sm text-gray-600">Excused</div>
                  <div className="text-xs text-purple-600">
                    {stats.total > 0 ? Math.round((stats.excused / stats.total) * 100) : 0}% excused
                  </div>
                </div>
                <AlertCircle className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(student.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{student.checkInTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{student.checkOutTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{student.totalHours}h</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{student.remarks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Schedule Reminder</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
