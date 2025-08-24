import { ArrowUp, DownloadCloud } from "lucide-react";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import im1 from "../../assets/Frame 752.png";
import im2 from "../../assets/Frame 753.png";
import im3 from "../../assets/Frame 754.png";
import im4 from "../../assets/Frame 752 (1).png";
import im5 from "../../assets/Frame 752 (2).png";
import im6 from "../../assets/Frame 752 (3).png";
import im7 from "../../assets/Frame 842.png";
import { useState } from "react";
const Dashboard = () => {
  const dashboardArray = [
    {
      id: "1,245",
      tex: "Total Users",
      des: "Registered users across all roles (Teachers, Students, Parents).",
      im: im1,
    },
    {
      id: "320",
      tex: "Active Courses",
      des: "Courses currently live and accessible by users.",
      im: im2,
    },
    {
      id: "12",
      tex: "Pending Approvals",
      des: "Awaiting admin action (e.g., new user signups or course approvals).",
      im: im3,
    },
    {
      id: "99.9%",
      tex: "System Uptime",
      des: "Overall system reliability for the past month.",
      im: im4,
    },
    {
      id: "530",
      tex: "Daily Login",
      des: "Number of users logged in today.",
      im: im5,
    },
    {
      id: "25",
      tex: "Feedback",
      des: "Unread or unresolved user feedback tickets.",
      im: im6,
    },
  ];
  const [optionOpen, optionClose] = useState(false);

  const naviagte = useNavigate();
  const handleNewUserClick = () => {
    naviagte(`/admin-dashboard/users/new-user`);
  };
  const handleCheckReport = () => {
    naviagte(`/admin-dashboard/reports`);
  };
  return (
    <>
      {/* dashboard conntainer */}
      <div className="w-[1224px] p-3.5">
        {/* admin-nav */}
        <div className=" flex items-center justify-between">
          {/* left */}
          <div className="">
            <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px]">
              Welcome back <br />
              <span
                className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[25px] font-semibold"
                style={{ color: "rgba(18, 40, 164, 1)" }}
              >
                Admin A
              </span>
            </p>
          </div>
          {/* end of left  */}

          {/* right */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2 w-[200px] p-[5px] rounded-[8px]"
              style={{ border: "1px solid rgba(18, 40, 164, 1)" }}
            >
              <button
                className="rounded-full font-bold"
                style={{
                  border: "2px solid rgba(18, 40, 164, 1)",
                  color: " rgba(18, 40, 164, 1)",
                }}
              >
                <ArrowUp size={16} />
              </button>
              <button
                className="text-[14px] sm:text-[16px] font-semibold md:text-[18px] lg:text-[20px]"
                style={{
                  color: "rgba(18, 40, 164, 1)",
                }}
                onClick={handleCheckReport}
              >
                Check Report
              </button>
            </div>
            <div
              className="flex items-center gap-2 w-[200px] p-[5px] rounded-[8px]"
              style={{ border: "1px solid rgba(18, 40, 164, 1)" }}
            >
              <button
                className="rounded-full font-bold"
                style={{
                  border: "2px solid rgba(18, 40, 164, 1)",
                  color: " rgba(18, 40, 164, 1)",
                }}
              >
                <ArrowUp size={16} />
              </button>
              <button
                className="text-[14px] sm:text-[16px] font-semibold md:text-[18px] lg:text-[20px] "
                style={{ color: "rgba(18, 40, 164, 1)" }}
                onClick={() => optionClose(!optionOpen)}
              >
                Quick Actions
              </button>
            </div>
          </div>
          {/*end of  right */}
        </div>
        {/*end of  admin-nav */}
        {/* quick action */}
        {optionOpen && (
          <div
            className=" flex flex-col gap-2.5 absolute right-[3%] shadow-xl w-[305px] h-[166px] p-[15px]  "
            style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
          >
            {/* add button */}
            <div
              className=" flex items-center gap-3.5 pt-[5px] pr-[10px] pb-[5px] pl-[10px]"
              style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              onClick={() => optionClose(false)}
            >
              <span
                className="w-[50px] h-[50px]  text-[18px]  flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: "rgba(18, 40, 164, 1)",
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                +
              </span>{" "}
              <p
                className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]"
                onClick={handleNewUserClick}
              >
                Add new user
              </p>
            </div>
            {/* end of add button */}
            {/* add button */}
            <div
              className=" flex items-center gap-3.5 pt-[5px] pr-[10px] pb-[5px] pl-[10px]"
              style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
              onClick={() => optionClose(false)}
            >
              <span
                className="w-[50px] h-[50px]  text-[18px]  flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: "rgba(18, 40, 164, 1)",
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                +
              </span>{" "}
              <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                Export User Data
              </p>
            </div>
            {/* end of add button */}
          </div>
        )}
        {/*end of  quick action */}
        {/* Admin-card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[5rem] w-fit mx-auto">
          {dashboardArray.map((dash, index) => (
            <div className="mt-[2rem] ">
              {/* card container */}
              <div
                key={index}
                className=" max-w-[300px] flex p-[3rem] shadow-xl"
                style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
              >
                <div>
                  <p
                    className="text-[16px] sm:text-[18px] font-semibold md:text-[25px]"
                    style={{ color: "rgba(18, 40, 164, 1)" }}
                  >
                    {dash.id}
                  </p>
                  <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]">
                    {dash.tex}
                  </p>
                  <p
                    className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[12px] max-w-[150px]"
                    style={{ color: "rgba(90, 100, 125, 1)" }}
                  >
                    {dash.des}
                  </p>
                </div>
                <div>
                  <img src={dash.im} alt="" />
                </div>
              </div>
              {/* end of card container */}
            </div>
          ))}
        </div>
        {/* end of Admin-card */}
        {/* pie-chart */}
        <div className="w-fit mx-auto mt-[5rem]">
          <img src={im7} alt="" />
        </div>
        {/* end pie chart */}
      </div>
      {/* end of dashboard conntainer */}
    </>
  );
};

export default Dashboard;
