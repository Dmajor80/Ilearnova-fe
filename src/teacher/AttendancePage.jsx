import React from "react";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceRow from "./components/AttendanceRow";
import AttendanceTableHeader from "./components/AttendanceTableHeader";
import CoursesComponent from "./components/CourseComponents";

const AttendancePage = () => {
    const attendanceData = [
        { name: "Mathematics", status: "Present", date: "19/11/2024" },
        { name: "Biology", status: "Absent", date: "19/11/2024" },
        { name: "English", status: "Absent", date: "19/11/2024" },
        { name: "Physics", status: "Absent", date: "19/11/2024" },
        { name: "Chemistry", status: "Present", date: "19/11/2024" },
        { name: "Civic Education", status: "Present", date: "19/11/2024" },
        { name: "Physical Health Education", status: "Present", date: "18/11/2024" },
        { name: "Yoruba", status: "Late", date: "19/11/2024" },
    ];

    return (
        <>
            <CoursesComponent page="Attendance Page" />
            <div className="min-h-screen bg-gray-100 p-6" >
                <div className="max-w-full mx-auto  font-sans">
                    {/* Header Card */}
                    <div className="  rounded-xl  mb-6 text-center">
                        <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                            <img
                                src="https://randomuser.me/api/portraits/women/65.jpg"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-xl font-semibold">Priscilla Daniel</h1>
                        <p className="text-sm text-gray-500">IKAMU/JS1/001 - Grade 6</p>

                        <div className="mt-4">
                            <p className="font-semibold mb-2">Total Attendance Rate: 80%</p>
                            <div className="flex justify-center gap-6 text-sm bg-white p-4 w-full  shadow ">
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500" />
                                    Present Days: 35 days
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500" />
                                    Absent Days: 10 days
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                                    Late Days: 5 days
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Controls */}
                    <div className="max-w-full mx-auto bg-white shadow rounded-xl p-4">
                          <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Attendance</h2>
                        <div className="flex gap-2">
                            <button className="border px-3 py-1 rounded text-sm flex items-center gap-1">
                                Filter
                            </button>
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                Send Notification
                            </button>
                            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">
                                Download
                            </button>
                        </div>
                    </div>

                    {/* Table Header */}
                    <AttendanceTableHeader />

                    {/* Attendance List */}
                    <div className="space-y-2 mt-2  border rounded-2xl p-4 border-[#A3AED0]">
                        {attendanceData.map((item, index) => (
                            <AttendanceRow
                                key={index}
                                name={item.name}
                                status={item.status}
                                date={item.date}
                            />
                        ))}
                    </div>


                    </div>
                </div>


            </div>


        </>

    );
};

export default AttendancePage;
