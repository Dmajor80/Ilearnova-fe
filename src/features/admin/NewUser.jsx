import { Delete, Save } from "lucide-react";
import React from "react";

const NewUser = () => {
  return (
    <>
      {/* new-container */}
      <div>
        <p className="text-[#2e2ed0] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium pl-2.5">
          Add New User
        </p>
        {/* new user information */}
        <div className="bg-[#FFFFFF] p-6 mt-[1rem]">
          <p className="lg:text-[25px] font-semibold ">User 1</p>

          {/* name fetch */}
          <div className="flex flex-col p-[10px]">
            <label
              className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
              style={{ color: "rgba(51, 51, 51, 1)" }}
            >
              {" "}
              Name
            </label>
            <input
              placeholder="Prisicilla"
              className=" p-[10px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
              style={{
                color: "rgba(51, 51, 51, 1)",
                border: "1.5px solid rgba(174, 174, 174, 1) ",
                backgroundColor: "rgba(235, 235, 235, 1)",
              }}
            />
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
            <input
              placeholder="Prisicilla190@gmail.com"
              className=" p-[10px] h-[54px]  text-[12px] sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
              type="text"
              style={{
                color: "rgba(51, 51, 51, 1)",
                border: "1.5px solid rgba(174, 174, 174, 1)",
                backgroundColor: "rgba(235, 235, 235, 1)",
              }}
            />
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
              <select
                className=" p-[10px] w-[487px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                type="text"
                style={{
                  color: "rgba(51, 51, 51, 1)",
                  border: "1.5px solid rgba(174, 174, 174, 1) ",
                  backgroundColor: "rgba(235, 235, 235, 1)",
                }}
              >
                <option value="">Teacher</option>
                <option value="">Parent</option>
                <option value="">Student</option>
              </select>
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
              <select
                className=" p-[10px] w-[487px] h-[54px] p-[5px]text-12px
                sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium
                rounded-[8px]"
                type="text"
                style={{
                  color: "green",
                  border: "1.5px solid rgba(174, 174, 174, 1)",
                  backgroundColor: "rgba(235, 235, 235, 1)",
                }}
              >
                <option value="">Active</option>
                <option value="">Not Active</option>
              </select>
            </div>
            {/* end of  Status fetch */}
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-[24px]">
              <button className="text-[12px] sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium text-[#1228A4] flex items-center  gap-[9px] justify-center bg-[#1228A433] w-[93px] h-[44px] rounded-[10px]">
                {" "}
                <Save size={20} className="text-[#1228A4]" /> Save{" "}
              </button>
              <button className="text-[12px] sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium text-[#DC3230] flex items-center justify-center bg-[#FD672733] w-[126px] h-[44px] gap-[9px] rounded-[10px]">
                {" "}
                Cancel <Delete size={20} className="text-[#DC3230]" />{" "}
              </button>
            </div>
          </div>
          {/* end of new user footer */}
        </div>
        {/*end of  new user information */}
        {/* new user footer */}
      </div>
      {/* end of new-container */}
    </>
  );
};

export default NewUser;
