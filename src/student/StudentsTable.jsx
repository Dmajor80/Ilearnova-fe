import React from "react";
import { ChevronRight } from "lucide-react";

const StudentsTable = () => {
  const fadeInUp = (delay) => ({
    animationDelay: `${delay}s`,
    animationFillMode: "both",
    animationName: "fadeInUp",
  });

  // Sample student data matching the template
  const studentData = [
    {
      ranking: "01",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "02",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "03",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "04",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "05",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "06",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "07",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "08",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
    {
      ranking: "09",
      avatar: "PD",
      name: "Priscilla Daniel",
      status: "Online",
      courses: 20,
      read: 14,
      projects: "09",
      hours: "234hrs",
      points: "1700.6",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4" style={fadeInUp(0.9)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Students Ranking</h3>
        <button className="text-blue-600 text-sm flex items-center">
          See All Students <ChevronRight size={16} />
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="pb-3 font-medium">Ranking</th>
            <th className="pb-3 font-medium">Student</th>
            <th className="pb-3 font-medium">Courses</th>
            <th className="pb-3 font-medium">Read</th>
            <th className="pb-3 font-medium">Projects</th>
            <th className="pb-3 font-medium">Hours</th>
            <th className="pb-3 font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((student, index) => (
            <tr
              key={index}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4">
                <span className="font-medium text-gray-800">
                  {student.ranking}
                </span>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <img
                      src="/api/placeholder/40/40"
                      alt={student.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.status}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 text-gray-600">{student.courses}</td>
              <td className="py-4 text-gray-600">{student.read}</td>
              <td className="py-4 text-gray-600">{student.projects}</td>
              <td className="py-4 text-gray-600">{student.hours}</td>
              <td className="py-4">
                <span className="font-medium text-gray-800">
                  {student.points}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentsTable;
