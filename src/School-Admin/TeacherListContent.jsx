import React, { useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  Plus,
  User,
  Mail,
  ChevronLeft,
  LocationEditIcon,
  Calendar,
  Timer,
  Phone,
} from "lucide-react";
import im from "../assets/image3.png";
import { useNavigate } from "react-router-dom";
import { PaymentHistory } from "./PaymentHistory";
const TeacherDetails = ({ teacher, onBack }) => {
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
                <div className="w-50 h-50  rounded-full flex items-center justify-center text-4xl  ">
                  <img
                    src={teacher.img}
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
                    {teacher.name}
                  </h2>
                  <p className="text-[#4D44B5] mb-1 font-poppins text-[16px] font-semibold">
                    Teacher
                  </p>
                  <div className="flex items-center space-x-4">
                    {/* <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {teacher.id}
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
                    {teacher.parent}
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
                    {teacher.address}
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
                    {teacher.Phone}
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
                    {teacher.email}
                  </p>
                </div>
              </div>
              {/* end of parent information */}
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md mb-20">
            {" "}
            <h2 className="text-[20px] font-bold mb-4 text-[#303972] font-poppins">
              About{" "}
            </h2>
            <p className="text-[#A098AE]">{teacher.about}</p>
            <h3 className="text-[20px] font-bold mb-4 text-[#303972] font-poppins">
              Education:
            </h3>
            <div className="mb-5.5">
              <p className="flex items-center text-[#303972] font-semibold font-poppins">
                <span className="text-[#303972] font-bold text-[16px]">.</span>
                {teacher.eduSchool}
              </p>
              <p>({teacher.eduDate})</p>
            </div>
            <div className="mb-5">
              <p className="flex items-center text-[#303972] font-semibold font-poppins">
                <span className="text-[#303972] font-bold text-[16px]">.</span>
                {teacher.eduSchool2}
              </p>
              <p>({teacher.eduDate2})</p>
            </div>
            <h3 className="text-[20px] font-bold mb-4 text-[#303972] font-poppins">
              Expertise:
            </h3>
            <p className="text-[#A098AE]">{teacher.expertise}</p>
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
export const TeacherListContent = () => {
  const [currentPage, setCurrrentPage] = useState(1);
  // const [teacherShow, teacherClose] = useState();
  const [cardStates, setCardStates] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const teacher = [
    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      address: "123 History Lane, History City, HC 12345",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      address: "123 History Lane, History City, HC 12345",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      address: "123 History Lane, History City, HC 12345",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      address: "123 History Lane, History City, HC 12345",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      address: "123 History Lane, History City, HC 12345",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      address: "123 History Lane, History City, HC 12345",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      address: "123 History Lane, History City, HC 12345",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      address: "123 History Lane, History City, HC 12345",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      address: "123 History Lane, History City, HC 12345",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      address: "123 History Lane, History City, HC 12345",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      address: "123 History Lane, History City, HC 12345",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      address: "123 History Lane, History City, HC 12345",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      address: "123 History Lane, History City, HC 12345",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },

    {
      img: im,
      name: "Dimitres Viga",
      occ: "Teacher",
      sub1: "Mathematics",
      sub2: "English",
      sub3: "Yoruba",
      parent: "John Doe",
      email: "history@gmail.com",
      address: "123 History Lane, History City, HC 12345",
      Phone: "+234 123 4567",
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      eduSchool: "History Major, University Akademi Historia",
      eduDate: "2013-2017",
      eduSchool2: "History Major, University Akademi Historia",
      eduDate2: "2013-2017",
      expertise:
        "World History, Philosophy, Prehistoric, Culture, Ancient Civilizations",
    },
  ];
  // pages control
  const teacherPerPage = 10;
  const totalPages = Math.ceil(teacher.length / teacherPerPage);
  const startIndex = (currentPage - 1) * teacherPerPage;
  const currentTeacher = teacher.slice(startIndex, startIndex + teacherPerPage);

  const handlePageChange = (page) => {
    setCurrrentPage(page);
  };
  const handleTeacherClick = (teach) => {
    setSelectedTeacher(teach);
  };

  // end of page control
  const handleHarmbugerClick = (cardId) => {
    setCardStates((prevStates) => ({
      ...prevStates,
      [cardId]: !prevStates[cardId],
    }));
  };
  if (selectedTeacher) {
    return (
      <TeacherDetails
        teacher={selectedTeacher}
        onBack={() => setSelectedTeacher(null)}
      />
    );
  }
  return (
    <>
      {/* Teacher list container */}
      <div className="mb-[6rem]">
        {/* teachlist header */}
        <div className="flex justify-between items-center p-6 bg-[white] mb-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search here..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppin text-[#000000] text-[15px]">
              <option
                value="newest"
                className="text-[12px] text-[#4D44B5] font-poppins"
              >
                Newest
              </option>
              <option
                value="oldest"
                className="text-[12px] text-[#4D44B5] font-poppins"
              >
                Oldest
              </option>
              <option
                value="name"
                className="text-[12px] text-[#4D44B5] font-poppins"
              >
                Name
              </option>
            </select>
            <button className="bg-[#4D44B5] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4 font-semibold" />
              <span className="text-[13px] font-semibold font-poppins">
                New Teacher
              </span>
            </button>
          </div>
        </div>
        {/* end of teachlist header */}

        {/* teacher fetch */}
        <div className=" tec mb-[5rem]">
          {currentTeacher.map((teach, index) => (
            <div key={index}>
              {/* card container */}
              <div className="bg-[white] max-w-[300px] w-[280px] mx-auto relative rounded-2xl h-[350px] shadow-[#b0a2a2] hover:shadow-lg">
                <div className="flex justify-center mb-[2rem] pt-[1rem]">
                  <img src={teach.img} alt="" className="w-[110px] h-[110px]" />
                  <div
                    className=" absolute right-[20px] top-[12px] flex    items-center justify-center w-fit p-[5px] cursor-pointer h-[0px] "
                    onClick={() => handleHarmbugerClick(index)}
                  >
                    <p className="text-[#303972] text-[40px] text-center h-[0px]  font-bold">
                      .
                    </p>
                    <p className="text-[#303972] text-[40px] text-center h-[0px] font-bold">
                      .
                    </p>
                    <p className="text-[#303972] text-[40px] text-center h-[0px] font-bold">
                      .
                    </p>
                  </div>
                  {cardStates[index] && (
                    <div
                      className="absolute top-8 right-20
                    bg-[white]
                    shadow-lg p-5
                    "
                    >
                      <p className="text-16px text-center font-poppins text-[#A098AE] font-normal cursor-pointer">
                        Edit
                      </p>
                      <p className="text-16px text-center font-poppins text-[#A098AE] font-normal cursor-pointer">
                        Delete
                      </p>
                    </div>
                  )}
                </div>
                <h1 className="text-center text-[#303972] font-poppins text-[18px]  font-bold mb-2.5 ">
                  {teach.name}
                </h1>
                <p className="text-[16px] font-poppins text-[#A098AE] text-center mb-[1rem]">
                  {teach.occ}
                </p>
                {/* subject */}
                <div className="flex items-center justify-center gap-2 mb-[2rem]">
                  <p className="text-[12px] font-poppins text-[#1EBA62] bg-[#DDFAEA] p-[2px] rounded-[10px] shadow-lg">
                    {teach.sub1}
                  </p>
                  <p className="text-[12px] font-poppins text-[#FB7D5B] bg-[#FFF3F0] p-[2px] rounded-[10px] shadow-lg">
                    {teach.sub2}
                  </p>
                  <p className="text-[12px] font-poppins text-[#FB7D5B] bg-[#FFF3F0] p-[2px] rounded-[10px] shadow-lg">
                    {teach.sub3}
                  </p>
                </div>
                {/* end of subject */}
                {/* contarol */}
                <div className="flex items-center justify-center  gap-5">
                  <button
                    className="bg-[#3D3690] text-[12px] flex items-center justify-center text-[#FFFFFF] font-semibold p-[5px] rounded-[5px] w-[80px] gap-1"
                    onClick={() => handleTeacherClick(teach)}
                  >
                    {" "}
                    <User
                      size={14}
                      className="text-[#FFFFFF] font-normal font-poppins"
                    />{" "}
                    Profile
                  </button>
                  <button className="flex items-center justify-center text-[12px] text-[#303972] font-poppins font-semibold p-[5px] rounded-[5px] w-[80px] bg-[#EBEBF9] gap-1">
                    {" "}
                    <Mail size={14} /> Chat
                  </button>
                </div>
                {/* contarol */}
              </div>
              {/* end of  card container */}
            </div>
          ))}
          {/* end of teacher fetch */}
        </div>
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="text-[16px] text-[#A098AE] font-poppins ">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + teacherPerPage, teacher.length)} of{" "}
            {teacher.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border-2 border-[#A098AE] rounded-[5px] text-gray-400  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer  hover:bg-[#4D44B5] hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded text-[20px] font-medium font-poppins transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-[#4D44B5] text-white"
                      : "text-[#303972] bg-[#ffffff] hover:bg-[#4D44B5] hover:text-white border-2 border-[#303972] "
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border-2 border-[#A098AE] rounded-[5px] text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer  hover:bg-[#4D44B5] hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {/* end of Teacher  list container */}
    </>
  );
};
// This component displays a list of teachers with pagination, search functionality, and options to view profiles or chat.
// It allows for dynamic card states to show or hide additional options when clicked.
