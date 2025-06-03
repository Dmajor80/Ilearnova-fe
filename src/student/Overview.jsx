import { useState, useEffect, useRef } from "react";

import {
  Bell,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Clock,
  Search,
  User,
  Users,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Settings,
  LineChart,
  BarChart2,
  Percent,
  ChevronRight,
} from "lucide-react";
import completed from "../assets/completed.png";
import pro from "../assets/progress (2).png";
import assignment from "../assets/assignment.png";
import mask from "../assets/Mask group.png";
import bell from "../assets/bell.png";
import chemistry from "../assets/chemistry.png";
import LiveCalendar from "./LiveCalendar";
import StudentsTable from "./StudentsTable";
const Overview = () => {
  const [progress, setProgress] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate progress to 67%
      let startProgress = 0;
      const interval = setInterval(() => {
        if (startProgress >= 67) {
          clearInterval(interval);
        } else {
          startProgress += 1;
          setProgress(startProgress);
        }
      }, 20);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const chartData = [35, 42, 55, 60, 48, 72];
  // const activityData = [
  //   { name: "Team Meeting", time: "9:00 AM", color: "blue" },
  //   { name: "Project Review", time: "11:30 AM", color: "amber" },
  //   { name: "Client Call", time: "2:15 PM", color: "rose" },
  //   { name: "Strategy Session", time: "4:00 PM", color: "purple" },
  // ];

  const taskData = [
    {
      name: "UX Research",
      completion: "80%",
      color: "blue",
      time: "13 Lessons - 3 hrs 15mins",
    },
    {
      name: "Wireframe Design",
      completion: "65%",
      color: "amber",
      time: "13 Lessons - 3 hrs 15mins",
    },
    {
      name: "Frontend Development",
      completion: "42%",
      color: "green",
      time: "13 Lessons - 3 hrs 15mins",
    },
  ];

  // const projectData = [
  //   { name: "Website Redesign", status: "In Progress", daysLeft: 7 },
  //   { name: "Mobile App Updates", status: "On Hold", daysLeft: 12 },
  //   { name: "Marketing Campaign", status: "Completed", daysLeft: 0 },
  // ];

  const teamData = [
    {
      name: "Alex Johnson",
      role: "UX Designer",
      avatar: "AJ",
      performance: 92,
    },
    { name: "Maria Garcia", role: "Developer", avatar: "MG", performance: 88 },
    {
      name: "David Kim",
      role: "Project Manager",
      avatar: "DK",
      performance: 95,
    },
    { name: "Sarah Wilson", role: "Marketing", avatar: "SW", performance: 85 },
    { name: "James Chen", role: "Developer", avatar: "JC", performance: 90 },
  ];

  const fadeInUp = (delay) => {
    return {
      animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
      opacity: 0,
      transform: "translateY(20px)",
    };
  };

  return (
    <div className=" w-[280px]  sm:w-[320px]  md:w-[500px] lg:w-[1200px] bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div
        className="flex justify-between items-center mb-6"
        style={fadeInUp(0.1)}
      >
        <div className="flex items-center">
          <h1 className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium text-[rgba(51, 51, 51, 1)]">
            Overview
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-white p-4 rounded-xl shadow-sm h-[143px] max-w-[340px]"
          style={fadeInUp(0.2)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px]  text-[#3737df] font-normal ">
              24
            </h2>
            <div className="p-2 bg-blue-100 rounded-lg">
              <img src={completed} alt="" />
            </div>
          </div>
          <p className="lg:text-[14px] font-medium">Courses Completed</p>
        </div>

        <div
          className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
          style={fadeInUp(0.2)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal ">
              24
            </h2>
            <div className="p-2 bg-blue-100 rounded-lg">
              <img src={pro} alt="" />
            </div>
          </div>
          <p className="text-[12px]  font-medium">Courses Progress</p>
        </div>

        <div
          className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
          style={fadeInUp(0.2)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] sm:text-[22px] md:text-[25px] lg:text-[35px] text-[#3737df] font-normal ">
              24
            </h2>
            <div className="p-2 bg-blue-100 rounded-lg">
              <img src={assignment} alt="" />
            </div>
          </div>
          <p className="lg:text-[14px] font-medium">Pending Assignment</p>
        </div>
      </div>

      {/* Calendar and Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2" style={fadeInUp(0.6)}>
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="  text-[12px] sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium text-[rgba(51, 51, 51, 1)]">
                Courses In progress
              </h3>
              <p className="text-[12px] sm:text-[14px]  md:text-[16px] lg:text-[18px] text-[#484894] font-normal">
                View All
              </p>
            </div>

            {taskData.map((task, index) => (
              <div key={index} className="  mb-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-[5px] ">
                  <div>
                    <img src={completed} alt="" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <div className="">
                        <h4
                          className="lg:text-[14px] font-medium"
                          style={{ color: "rgba(51, 51, 51, 1)" }}
                        >
                          {task.name}
                        </h4>
                        <h4
                          className="text-[12px] font-normal "
                          style={{ color: "rgba(90, 100, 125, 1)" }}
                        >
                          {task.time}
                        </h4>
                      </div>
                      <span className={`text-${task.color}-600 text-sm`}>
                        {task.completion}
                        <img src={mask} alt="" />
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${task.color}-500 rounded-full`}
                        style={{
                          width: task.completion,
                          animation: `growWidth 1s ease-out ${
                            0.7 + index * 0.2
                          }s forwards`,
                          transform: "scaleX(0)",
                          transformOrigin: "left",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* notification */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] text-[#333]">
                Notification
              </h3>
              <button className="text-blue-600 text-[16px] font-normal flex items-center">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {/* notification1 */}
              <div
                className=" mb-7"
                style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              >
                <div className="flex items-center gap-[5px]">
                  <img src={bell} alt="" />
                  <div>
                    <p
                      className="lg:text-[14px] font-medium"
                      style={{ color: "rgba(51, 51, 51, 1)" }}
                    >
                      Assignment Due Soon
                    </p>
                    <p
                      className="text-[12px] font-normal "
                      style={{ color: "rgba(90, 100, 125, 1)" }}
                    >
                      Your Math assignment on ‘Linear Equations’ is due
                      tomorrow, Nov 19, 2024. Don’t forget to submit it on time!
                    </p>
                  </div>
                </div>
                {/* notification button */}
                <button
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium w-full rounded-[5px] h-[25px] lg:h-\[42px\] mt-[1rem] "
                  style={{
                    backgroundColor: "rgba(18, 40, 164, 1)",
                    color: "rgba(255, 255, 255, 1)",
                  }}
                >
                  View Assignment
                </button>
              </div>
              {/* end of  notification1 */}
              {/* notification1 */}
              <div
                className=""
                style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              >
                <div className="flex items-center gap-[5px]">
                  <img src={bell} alt="" />
                  <div>
                    <p
                      className="lg:text-[14px] font-medium"
                      style={{ color: "rgba(51, 51, 51, 1)" }}
                    >
                      Assignment Due Soon
                    </p>
                    <p
                      className="text-[12px] font-normal "
                      style={{ color: "rgba(90, 100, 125, 1)" }}
                    >
                      Your Math assignment on ‘Linear Equations’ is due
                      tomorrow, Nov 19, 2024. Don’t forget to submit it on time!
                    </p>
                  </div>
                </div>
                {/* notification button */}
                <button
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium w-full rounded-[5px] h-[25px] lg:h-\[42px\] mt-[1rem] "
                  style={{
                    backgroundColor: "rgba(18, 40, 164, 1)",
                    color: "rgba(255, 255, 255, 1)",
                  }}
                >
                  View Assignment
                </button>
              </div>
              {/* end of  notification1 */}
              {/* notification1 */}
              <div
                className=""
                style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              >
                <div className="flex items-center gap-[5px]">
                  <img src={bell} alt="" />
                  <div>
                    <p
                      className="lg:text-[14px] font-medium"
                      style={{ color: "rgba(51, 51, 51, 1)" }}
                    >
                      Assignment Due Soon
                    </p>
                    <p
                      className="text-[12px] font-normal "
                      style={{ color: "rgba(90, 100, 125, 1)" }}
                    >
                      Your Math assignment on ‘Linear Equations’ is due
                      tomorrow, Nov 19, 2024. Don’t forget to submit it on time!
                    </p>
                  </div>
                </div>
                {/* notification button */}
                <button
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium w-full rounded-[5px] h-[25px] lg:h-\[42px\] mt-[1rem] "
                  style={{
                    backgroundColor: "rgba(18, 40, 164, 1)",
                    color: "rgba(255, 255, 255, 1)",
                  }}
                >
                  View Assignment
                </button>
              </div>
              {/* end of  notification1 */}
            </div>
          </div>
          {/* end of notification */}
        </div>
        <div className="col-span-1" style={fadeInUp(0.5)}>
          {/* calender */}

          <LiveCalendar />
          {/* end of calender */}

          {/* class */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] max-w-[500px] sm:w-[400px] h-[100px]">
            <div className="flex items-center gap-[2rem]">
              <img src={chemistry} alt="" />
              <div>
                <p
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Chemistry Practical
                </p>
                <p
                  className="lg:text-[14px] font-normal "
                  style={{ color: "rgba(105, 105, 105, 1)" }}
                >
                  October 22nd - 26th .10:00 am
                </p>
              </div>
            </div>
          </div>
          {/* end of class */}

          {/* class */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] max-w-[500px] sm:w-[400px] h-[100px]">
            <div className="flex items-center gap-[2rem]">
              <img src={chemistry} alt="" />
              <div>
                <p
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Chemistry Practical
                </p>
                <p
                  className="lg:text-[14px] font-normal "
                  style={{ color: "rgba(105, 105, 105, 1)" }}
                >
                  October 22nd - 26th .10:00 am
                </p>
              </div>
            </div>
          </div>
          {/* end of class */}

          {/* class */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] max-w-[500px] sm:w-[400px] h-[100px]">
            <div className="flex items-center gap-[2rem]">
              <img src={chemistry} alt="" />
              <div>
                <p
                  className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Chemistry Practical
                </p>
                <p
                  className="lg:text-[14px] font-normal "
                  style={{ color: "rgba(105, 105, 105, 1)" }}
                >
                  October 22nd - 26th .10:00 am
                </p>
              </div>
            </div>
          </div>
          {/* end of class */}

          {/* certification */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-[1.5rem] max-w-[500px] sm:w-[400px] ">
            <div className="flex items-center justify-between">
              <p className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium">
                Certification
              </p>
              <p
                className="text-[12px] font-normal"
                style={{ color: "rgba(18, 40, 164, 1)" }}
              >
                View
              </p>
            </div>
            {/* class */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-[1.5rem]">
              <div className="flex items-center gap-[2rem]">
                <img src={chemistry} alt="" />
                <div>
                  <p
                    className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Chemistry Practical
                  </p>
                  <p
                    className="lg:text-[14px] font-normal "
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    October 22nd - 26th .10:00 am
                  </p>
                </div>
              </div>
            </div>
            {/* end of class */}
            {/* class */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-[1.5rem]">
              <div className="flex items-center gap-[2rem]">
                <img src={chemistry} alt="" />
                <div>
                  <p
                    className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Chemistry Practical
                  </p>
                  <p
                    className="lg:text-[14px] font-normal "
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    October 22nd - 26th .10:00 am
                  </p>
                </div>
              </div>
            </div>
            {/* end of class */}
            {/* class */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-[1.5rem]">
              <div className="flex items-center gap-[2rem]">
                <img src={chemistry} alt="" />
                <div>
                  <p
                    className="text-[12px] sm:lg:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Chemistry Practical
                  </p>
                  <p
                    className="lg:text-[14px] font-normal "
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    October 22nd - 26th .10:00 am
                  </p>
                </div>
              </div>
            </div>
            {/* end of class */}
          </div>
          {/* certification */}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div
          className="bg-white p-4 rounded-xl shadow-sm"
          style={fadeInUp(0.7)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Performance</h3>
            <button className="text-sm text-gray-500 flex items-center">
              This Week <ChevronDown size={14} />
            </button>
          </div>

          <div className="relative pt-4">
            <div className="flex justify-center items-center flex-col mb-3">
              <div className="relative h-32 w-32">
                <div className="h-32 w-32 rounded-full border-8 border-gray-100"></div>
                <div
                  className="h-32 w-32 rounded-full border-8 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent absolute top-0 left-0 transform -rotate-45"
                  style={{
                    transform: `rotate(${progress * 3.6 - 45}deg)`,
                    transition: "transform 1s ease-out",
                  }}
                ></div>
                <div className="absolute top-0 left-0 h-32 w-32 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold">{progress}%</span>
                    <p className="text-xs text-gray-500">Completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-span-2 bg-white p-4 rounded-xl shadow-sm"
          style={fadeInUp(0.8)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Weekly Progress</h3>
            <button className="text-sm text-gray-500 flex items-center">
              Last 7 Days <ChevronDown size={14} />
            </button>
          </div>

          <div className="h-52" ref={chartRef}>
            <div className="flex h-40 items-end justify-between gap-2">
              {chartData.map((value, index) => (
                <div
                  key={index}
                  className="relative flex-1 flex flex-col items-center"
                >
                  <div
                    className="bg-green-500 w-full rounded-t-md"
                    style={{
                      height: `${value}%`,
                      maxHeight: "100%",
                      animation: `growHeight 1s ease-out ${
                        1 + index * 0.1
                      }s forwards`,
                      transform: "scaleY(0)",
                      transformOrigin: "bottom",
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    Day {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <StudentsTable />

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

        @keyframes growWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes growHeight {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;
