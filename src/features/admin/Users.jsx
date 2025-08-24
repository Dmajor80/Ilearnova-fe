import { ArrowDown, Calendar, Delete, Edit, Search } from "lucide-react";
import React from "react";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";

const user = [
  {
    id: "User1",
    Name: "Priscilla Daniel",
    Email: "Priscilla1980@gmail.com",
    Role: "Student",
    Status: "Active",
    last: "last Login December 18,2024",
  },
  {
    id: "User2",
    Name: "Priscilla Daniel",
    Email: "Priscilla1980@gmail.com",
    Role: "Student",
    Status: "Active",
    last: "last Login December 18,2024",
  },
];

const Users = () => {
  // function newUser () => {
  //   const navigate = useNavigate()

  //   const handleCourseClick = () => {
  //     navigate(`/admin-dashboard/user/new-user`);
  //   }}

  const [showSearch, hideSearch] = useState(false);
  return (
    <>
      <div>
        {/* user nav */}
        <div className="flex items-center justify-between max-w-[1250px] p-[5px]">
          <p
            className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
            style={{ color: "rgba(18, 40, 164, 1)" }}
          >
            User Management <br />
            <span
              className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]"
              style={{ color: "rgba(0, 0, 0, 1)" }}
            >
              Manage users across all roles efficiently.
            </span>
          </p>
          <div className="flex items-center gap-4">
            <button
              className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium flex items-center justify-center gap-3.5 p-[5px] w-[125px] h-[46px] rounded-[8px]"
              style={{
                color: "rgba(18, 40, 164, 1)",
                border: "1px  solid rgba(18, 40, 164, 1)",
              }}
              onClick={() => hideSearch(!showSearch)}
            >
              <Search size={20} style={{ color: "rgba(18, 40, 164, 1)" }} />{" "}
              Search
            </button>
            {showSearch && (
              <div className="absolute bottom-[20%] ">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="relative w-32 sm:w-48 md:w-64">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="border border-gray-300 rounded-full w-full py-2 px-4 pl-10 text-sm"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <button
              className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium flex items-center justify-center gap-3.5 p-[5px] w-[125px] h-[46px] rounded-[8px]"
              style={{
                color: "rgba(18, 40, 164, 1)",
                border: "1px  solid rgba(18, 40, 164, 1)",
              }}
            >
              <ArrowDown size={20} style={{ color: "rgba(18, 40, 164, 1)" }} />{" "}
              Export
            </button>
            <button
              className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium flex items-center justify-center gap-3.5 p-[5px] w-[125px] h-[46px] rounded-[8px]"
              style={{
                color: "rgba(18, 40, 164, 1)",
                border: "1px  solid rgba(18, 40, 164, 1)",
              }}
            >
              <Calendar size={20} style={{ color: "rgba(18, 40, 164, 1)" }} />
              Date
            </button>
          </div>
        </div>
        {/* end of user nav */}

        {/* users */}
        <div className="mt-[5rem] flex flex-col gap-20 p-[5px] ">
          {user.map((use, index) => (
            <div
              key={index}
              className="rounded-[10px] p-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
            >
              {/* user1 nav */}
              <div className="flex items-center justify-between max-w-[1250px] p-[5px]">
                <p
                  className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[25px]"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  {use.id}
                </p>
                <div className="flex items-center gap-3.5">
                  <button
                    className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] flex items-center justify-center gap-1 w-[87px] h-[44px] rounded-[10px]"
                    style={{
                      color: "rgba(18, 40, 164, 1)",
                      backgroundColor: "rgba(18, 40, 164, 0.2)",
                    }}
                  >
                    <Edit
                      size={16}
                      className=""
                      style={{
                        color: "rgba(18, 40, 164, 1)",
                      }}
                    />
                    Edit
                  </button>
                  <button
                    className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] flex items-center justify-center gap-1 w-[87px] h-[44px] rounded-[10px]"
                    style={{
                      color: "rgba(220, 50, 48, 1)",
                      backgroundColor: "rgba(253, 103, 39, 0.2)",
                    }}
                  >
                    Delete
                    <Delete
                      size={16}
                      style={{ color: "rgba(220, 50, 48, 1)" }}
                    />
                  </button>
                </div>
              </div>
              {/*end of  user1 nav */}

              {/* form generating */}
              {/* name fetch */}
              <div className="flex flex-col p-[10px]">
                <label
                  className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  {" "}
                  Name
                </label>
                <p
                  className=" p-[10px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                  style={{
                    color: "rgba(51, 51, 51, 1)",
                    border: "1.5px solid rgba(174, 174, 174, 1) ",
                    backgroundColor: "rgba(235, 235, 235, 1)",
                  }}
                >
                  {use.Name}
                </p>
              </div>
              {/*end of  name fetch */}

              {/* email fetch */}

              <div className="flex flex-col p-[10px]">
                <label
                  className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Email Address
                </label>
                <p
                  className=" p-[10px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                  type="text"
                  style={{
                    color: "rgba(51, 51, 51, 1)",
                    border: "1.5px solid rgba(174, 174, 174, 1)",
                    backgroundColor: "rgba(235, 235, 235, 1)",
                  }}
                >
                  {use.Email}
                </p>
              </div>
              {/* end of  email fetch */}

              <div className="flex items-center w-full">
                {/* Role fetch */}
                <div className="flex flex-col p-[10px]">
                  <label
                    className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Role
                  </label>
                  <p
                    className=" p-[10px] w-[487px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                    type="text"
                    style={{
                      color: "rgba(51, 51, 51, 1)",
                      border: "1.5px solid rgba(174, 174, 174, 1) ",
                      backgroundColor: "rgba(235, 235, 235, 1)",
                    }}
                  >
                    {use.Role}
                  </p>
                </div>
                {/*end of  Role fetch */}

                {/* Status fetch */}
                <div className="flex flex-col p-[10px]">
                  <label
                    className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Status
                  </label>
                  <p
                    className=" p-[10px] w-[487px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                    type="text"
                    style={{
                      color: "green",
                      border: "1.5px solid rgba(174, 174, 174, 1)",
                      backgroundColor: "rgba(235, 235, 235, 1)",
                    }}
                  >
                    {use.Status}
                  </p>
                </div>
                {/* end of  Status fetch */}
              </div>
              {/* last login */}
              <p
                className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3 p-[10px]"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                {use.last}
              </p>
              {/* end of  last login */}
              {/* end of form generating */}
            </div>
          ))}
        </div>
        {/*end of  users */}
      </div>
    </>
  );
};

export default Users;
