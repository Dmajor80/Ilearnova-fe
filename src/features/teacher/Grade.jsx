import React, { useState } from "react";
import CoursesComponent from "./components/CourseComponents";
import { Search, Filter, Download, Eye, Edit, Star, TrendingUp, Users, BookOpen, Award } from "lucide-react";

const Grade = () => {
  const [activeTab, setActiveTab] = useState("grades");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const classes = ["Grade 6A", "Grade 7B", "Grade 8A", "Grade 9B", "Grade 10A"];
  const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Biology", "History"];

  const students = [
    {
      id: 1,
      name: "John Doe",
      class: "Grade 8A",
      rollNumber: "001",
      subjects: {
        Mathematics: { score: 85, grade: "A", attendance: 95 },
        Physics: { score: 78, grade: "B+", attendance: 92 },
        Chemistry: { score: 82, grade: "A-", attendance: 98 },
        English: { score: 88, grade: "A", attendance: 96 },
        Biology: { score: 75, grade: "B", attendance: 90 }
      },
      overallGrade: "A-",
      overallScore: 81.6,
      attendance: 94.2
    },
    {
      id: 2,
      name: "Jane Smith",
      class: "Grade 7B",
      rollNumber: "002",
      subjects: {
        Mathematics: { score: 92, grade: "A+", attendance: 98 },
        Physics: { score: 85, grade: "A", attendance: 95 },
        Chemistry: { score: 88, grade: "A", attendance: 97 },
        English: { score: 90, grade: "A+", attendance: 99 },
        Biology: { score: 83, grade: "A-", attendance: 93 }
      },
      overallGrade: "A",
      overallScore: 87.6,
      attendance: 96.4
    },
    {
      id: 3,
      name: "Alice Johnson",
      class: "Grade 9B",
      rollNumber: "003",
      subjects: {
        Mathematics: { score: 76, grade: "B+", attendance: 88 },
        Physics: { score: 72, grade: "B", attendance: 85 },
        Chemistry: { score: 79, grade: "B+", attendance: 91 },
        English: { score: 84, grade: "A-", attendance: 94 },
        Biology: { score: 77, grade: "B+", attendance: 89 }
      },
      overallGrade: "B+",
      overallScore: 77.6,
      attendance: 89.4
    },
    {
      id: 4,
      name: "Bob Lee",
      class: "Grade 6A",
      rollNumber: "004",
      subjects: {
        Mathematics: { score: 68, grade: "B-", attendance: 82 },
        Physics: { score: 65, grade: "C+", attendance: 78 },
        Chemistry: { score: 71, grade: "B-", attendance: 85 },
        English: { score: 74, grade: "B", attendance: 88 },
        Biology: { score: 69, grade: "B-", attendance: 81 }
      },
      overallGrade: "B-",
      overallScore: 69.4,
      attendance: 82.8
    },
    {
      id: 5,
      name: "Charlie Kim",
      class: "Grade 10A",
      rollNumber: "005",
      subjects: {
        Mathematics: { score: 95, grade: "A+", attendance: 100 },
        Physics: { score: 93, grade: "A+", attendance: 98 },
        Chemistry: { score: 96, grade: "A+", attendance: 99 },
        English: { score: 92, grade: "A+", attendance: 97 },
        Biology: { score: 94, grade: "A+", attendance: 96 }
      },
      overallGrade: "A+",
      overallScore: 94.0,
      attendance: 98.0
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-blue-100 text-blue-800";
      case "A-":
        return "bg-cyan-100 text-cyan-800";
      case "B+":
        return "bg-yellow-100 text-yellow-800";
      case "B":
        return "bg-orange-100 text-orange-800";
      case "B-":
        return "bg-red-100 text-red-800";
      case "C+":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const calculateClassAverage = (className) => {
    const classStudents = students.filter(s => s.class === className);
    const average = classStudents.reduce((sum, s) => sum + s.overallScore, 0) / classStudents.length;
    return average.toFixed(1);
  };

  return (
    <>
      <CoursesComponent page="Grade" />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Grade Management</h2>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Export Grades</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1">
              {["grades", "reports", "analytics"].map((tab) => (
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

          {/* Filters */}
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
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Class Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            {classes.map(cls => (
              <div key={cls} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{cls}</h3>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {calculateClassAverage(cls)}%
                </div>
                <div className="text-sm text-gray-600">Class Average</div>
                <div className="mt-2 text-xs text-gray-500">
                  {students.filter(s => s.class === cls).length} students
                </div>
              </div>
            ))}
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Student Grades</h3>
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
                    {selectedSubject === "all" ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Overall
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                      </>
                    ) : (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedSubject}
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
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
                      {selectedSubject === "all" ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.overallGrade)}`}>
                                {student.overallGrade}
                              </span>
                              <span className={`text-sm font-semibold ${getScoreColor(student.overallScore)}`}>
                                {student.overallScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-900">{student.attendance}%</span>
                            </div>
                          </td>
                        </>
                      ) : (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.subjects[selectedSubject]?.grade)}`}>
                              {student.subjects[selectedSubject]?.grade}
                            </span>
                            <span className={`text-sm font-semibold ${getScoreColor(student.subjects[selectedSubject]?.score)}`}>
                              {student.subjects[selectedSubject]?.score}%
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
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

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {students.filter(s => s.overallGrade === 'A+' || s.overallGrade === 'A').length}
                  </div>
                  <div className="text-sm text-gray-600">Excellent (A-A+)</div>
                </div>
                <Award className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {students.filter(s => s.overallGrade.includes('B')).length}
                  </div>
                  <div className="text-sm text-gray-600">Good (B-B+)</div>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {students.filter(s => s.overallGrade.includes('C') || s.overallGrade === 'B-').length}
                  </div>
                  <div className="text-sm text-gray-600">Needs Improvement</div>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {(students.reduce((sum, s) => sum + s.overallScore, 0) / students.length).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Average</div>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Grade;
