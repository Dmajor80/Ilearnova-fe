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
      avatar: "JD",
      name: "John Doe",
      status: "Offline",
      courses: 18,
      read: 12,
      projects: "07",
      hours: "198hrs",
      points: "1450.2",
    },
    {
      ranking: "03",
      avatar: "SM",
      name: "Sarah Miller",
      status: "Online",
      courses: 22,
      read: 16,
      projects: "11",
      hours: "267hrs",
      points: "1680.8",
    },
    {
      ranking: "04",
      avatar: "MJ",
      name: "Mike Johnson",
      status: "Online",
      courses: 15,
      read: 10,
      projects: "06",
      hours: "156hrs",
      points: "1200.4",
    },
    {
      ranking: "05",
      avatar: "EW",
      name: "Emma Wilson",
      status: "Offline",
      courses: 19,
      read: 13,
      projects: "08",
      hours: "210hrs",
      points: "1550.3",
    },
    {
      ranking: "06",
      avatar: "DB",
      name: "David Brown",
      status: "Online",
      courses: 21,
      read: 15,
      projects: "10",
      hours: "245hrs",
      points: "1625.7",
    },
    {
      ranking: "07",
      avatar: "LG",
      name: "Lisa Garcia",
      status: "Online",
      courses: 17,
      read: 11,
      projects: "07",
      hours: "189hrs",
      points: "1380.9",
    },
    {
      ranking: "08",
      avatar: "RT",
      name: "Robert Taylor",
      status: "Offline",
      courses: 16,
      read: 9,
      projects: "05",
      hours: "167hrs",
      points: "1150.6",
    },
    {
      ranking: "09",
      avatar: "AM",
      name: "Alice Martinez",
      status: "Online",
      courses: 23,
      read: 17,
      projects: "12",
      hours: "289hrs",
      points: "1820.4",
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

      {/* Mobile scroll container */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-3 font-medium whitespace-nowrap">Ranking</th>
              <th className="pb-3 font-medium whitespace-nowrap">Student</th>
              <th className="pb-3 font-medium whitespace-nowrap">Courses</th>
              <th className="pb-3 font-medium whitespace-nowrap">Read</th>
              <th className="pb-3 font-medium whitespace-nowrap">Projects</th>
              <th className="pb-3 font-medium whitespace-nowrap">Hours</th>
              <th className="pb-3 font-medium whitespace-nowrap">Points</th>
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
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 whitespace-nowrap">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            student.status === "Online"
                              ? "bg-green-400"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {student.status}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-600 whitespace-nowrap">
                  {student.courses}
                </td>
                <td className="py-4 text-gray-600 whitespace-nowrap">
                  {student.read}
                </td>
                <td className="py-4 text-gray-600 whitespace-nowrap">
                  {student.projects}
                </td>
                <td className="py-4 text-gray-600 whitespace-nowrap">
                  {student.hours}
                </td>
                <td className="py-4">
                  <span className="font-medium text-gray-800 whitespace-nowrap">
                    {student.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

        /* Custom scrollbar for better mobile experience */
        .overflow-x-auto::-webkit-scrollbar {
          height: 4px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default StudentsTable;
