export const TeacherDetails = ({ student, onBack }) => {
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className=" ">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Details
            </h1>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Main Content */}
        <div className="flex flex-col w-full">
          <div className="  flex-1 p-6 relative ">
            {/* Student Profile Card */}
            <div className="bg-gradient-to-r bg-[#3d3690] rounded-xl p-6   overflow-hidden h-[200px]">
              <div className=""></div>
              <div className=""></div>

              <div className="absolute mt-[2rem]  flex flex-col items-center space-x-6">
                <div className="w-40 h-40  rounded-full flex items-center justify-center text-4xl  ">
                  <img
                    src={student.avatar}
                    alt=""
                    className="border-10 border-b-white border-t-white border-l-white border-r-white  rounded-full z-1 p-0"
                  />
                </div>
                <div className="absolute flex justify-center right-[-35rem] z-0 mt-[0.6rem]">
                  <div
                    className="w-[250px] h-[150px] absolute mt-[2rem] z-[-10] ml-[-15rem] rounded-2xl"
                    style={{ background: "rgb(252, 196, 62" }}
                  ></div>
                  <div className="bg-[#FB7D5B] w-[250px] h-[150px] rounded-2xl  mb-[10.5]"></div>
                </div>
                <div className="mt-[1rem] z-40 ">
                  <h2 className="text-3xl font-bold mb-1 text-[#303972] font-poppins">
                    {student.name}
                  </h2>
                  <p className="text-[#4D44B5] mb-1 font-poppins text-[16px] font-semibold">
                    Student
                  </p>
                  <div className="flex items-center space-x-4">
                    {/* <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {student.id}
                  </span> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-3.5 bg-[white] grid grid-col-1 lg:grid-cols-2 gap-6 mb-6 pt-[12rem]  relative">
              {/* parent information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[5px]">
                  <User size={40} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Parents:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {" "}
                    {student.parent}
                  </p>
                </div>
              </div>
              {/* end of parent information */}
              {/* add information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <LocationEditIcon size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Address:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {" "}
                    {student.city}
                  </p>
                </div>
              </div>
              {/* end of add information */}
              {/* Phone information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Phone size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Phone:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.Phone}
                  </p>
                </div>
              </div>
              {/* end of phone information */}
              {/* Email information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Email:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {" "}
                    {student.email}
                  </p>
                </div>
              </div>
              {/* end of parent information */}
            </div>
          </div>
          <div>
            <PaymentHistory />
          </div>
        </div>
        {/* Schedule Sidebar */}
        <div className="w-120   p-6">
          <div className="space-y-4">
            <div className="border-l-8 rounded-[10px] border-[#4D44B5] pl-4 py-3 bg-[white]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Basic Algorithm</h4>
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Algorithm</p>
              <div className="flex flex-col space-x-4 text-sm text-gray-500">
                <span className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-1 text-red-600" />
                  March 20, 2022
                </span>

                <span className="flex items-center mb-2">
                  <Timer className="w-5 h-5 mr-1 text-amber-300" />
                  09:00 - 10:00 AM
                </span>
              </div>
            </div>
            <div className="border-l-8 rounded-[10px] border-[#4D44B5] pl-4 py-3 bg-[white]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Basic Algorithm</h4>
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Algorithm</p>
              <div className="flex flex-col space-x-4 text-sm text-gray-500">
                <span className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-1 text-red-600" />
                  March 20, 2022
                </span>

                <span className="flex items-center mb-2">
                  <Timer className="w-5 h-5 mr-1 text-amber-300" />
                  09:00 - 10:00 AM
                </span>
              </div>
            </div>
            <div className="border-l-8 rounded-[10px] border-[#4D44B5] pl-4 py-3 bg-[white]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Basic Algorithm</h4>
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Algorithm</p>
              <div className="flex flex-col space-x-4 text-sm text-gray-500">
                <span className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-1 text-red-600" />
                  March 20, 2022
                </span>

                <span className="flex items-center mb-2">
                  <Timer className="w-5 h-5 mr-1 text-amber-300" />
                  09:00 - 10:00 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
