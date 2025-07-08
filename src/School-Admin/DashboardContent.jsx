import React from "react";
import { Users, UserCheck, Calendar, Utensils, BarChart3 } from "lucide-react";
import SchoolPerformanceChart from "./SchoolPerformanceChart ";
import SchoolOverviewChart from "./SchoolOverviewChart";
import SchoolCalendar from "./SchoolCalendar";
import TeacherTable from "./TeacherTable";
import UnpaidStudentTuition from "./UnpaidStudentTuition";

export const DashboardContent = () => {
  const statsCards = [
    {
      icon: Users,
      label: "Students",
      value: "932",
      bgColor: "bg-indigo-500",
      iconBg: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: UserCheck,
      label: "Teachers",
      value: "754",
      bgColor: "bg-orange-500",
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      icon: Calendar,
      label: "Events",
      value: "40",
      bgColor: "bg-yellow-500",
      iconBg: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Utensils,
      label: "Foods",
      value: "32k",
      bgColor: "bg-slate-600",
      iconBg: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${card.iconBg} mr-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex gap-5 ">
        <SchoolPerformanceChart />
        <SchoolOverviewChart />
      </div>
      <div className="flex mt-8 gap-5 mb-5">
        <SchoolCalendar />
        <TeacherTable />
      </div>
      <div>
        <UnpaidStudentTuition />
      </div>
    </div>
  );
};
