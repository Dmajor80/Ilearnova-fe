import React from 'react';
import CoursesComponent from './components/CourseComponents';
import Schedule from "../../assets/schedule.png";
import Approved from "../../assets/approved.png";
import total from "../../assets/total.png";
import { EllipsisVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ClassManagement = () => {
  return (
    <>
      <CoursesComponent page="Class Management" />
      <div className="min-h-screen bg-gray-100 p-6">
        <TeacherDashboard />
      </div>
    </>
  );
};

const StatCard = ({ label, value, icon }) => {
  return (
    <motion.div
      className="bg-white p-4 rounded-xl shadow-sm h-[143px]"
      variants={fadeInUp}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-[39px] text-[#3737df] font-normal ">{value}</h2>
        <div className="p-2 bg-blue-100 rounded-lg">
          <img src={icon} alt="" className="w-10 h-10 object-contain" />
        </div>
      </div>
      <p className="text-[14px] font-medium">{label}</p>
    </motion.div>
  );
};

const StudentPerformanceCard = ({ name, score, img }) => (
  <motion.div
    className="flex items-center justify-between border-b border-b-gray-200 py-2"
    variants={fadeInUp}
    initial="hidden"
    animate="show"
  >
    <div className="flex items-center gap-2">
      <img src={img} alt={name} className="w-8 h-8 rounded-full" />
      <div className='flex flex-col gap-1'>
        <span>{name}</span>
        <p className="text-xs text-gray-400">Hello there</p>
      </div>
    </div>
    <span className="font-semibold">{score}%</span>
  </motion.div>
);

const NoteCard = ({ title, date, description }) => (
  <motion.div
    className='flex items-center justify-between border-b border-b-gray-200 py-2'
    variants={fadeInUp}
    initial="hidden"
    animate="show"
  >
    <div className="py-2 flex flex-col gap-1">
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-xs text-black-500">{description}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
    <div>
      <EllipsisVertical size={20} />
    </div>
  </motion.div>
);

const TeacherDashboard = () => {
  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto space-y-6 bg-[#F9FAFC] min-h-screen"
      initial="hidden"
      animate="show"
      variants={fadeInUp}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-xl font-semibold">Welcome back, <span className="text-blue-600">Teacher A</span></h2>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">Add announcement</button>
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">Mark attendance</button>
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">Quick Actions</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Grade 6 - Mathematics" value="05" icon={Approved} />
        <StatCard label="Total Students" value="30" icon={total} />
        <StatCard label="Assignment Due" value="02" icon={Schedule} />
        <StatCard label="Test Scheduled" value="10" icon={Approved} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Student Performance</h3>
            <a href="#" className="text-blue-500 text-sm">View all</a>
          </div>
          <StudentPerformanceCard name="Priscilla Daniel" score="98" img="https://randomuser.me/api/portraits/women/65.jpg" />
          <StudentPerformanceCard name="Priscilla Daniel" score="96" img="https://randomuser.me/api/portraits/women/65.jpg" />
          <StudentPerformanceCard name="Priscilla Daniel" score="93" img="https://randomuser.me/api/portraits/women/65.jpg" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Latest Discussion</h3>
            <a href="#" className="text-blue-500 text-sm">View all</a>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b">
              <div>
                <span>Priscilla Daniel</span>
                <p className='text-xs text-gray-600'>G1 class A</p>
                <p className='text-xs text-gray-400'>Updated 30 mins Ago</p>
              </div>
              <div className="text-right">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt='img' className="w-8 h-8 rounded-full mb-1" />
                <span className="text-xs text-gray-400 block">1 new message</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">My Lesson Notes</h3>
            <a href="#" className="text-blue-500 text-sm">View all</a>
          </div>
          <NoteCard title="Prepare Questions for Midterm Test" date="25 Nov 2024" description="Prepare Questions for Midterm Test and exam and notes for students in class A " />
          <NoteCard title="Announcement to Students..." date="25 Nov 2024" description="Prepare Questions for Midterm Test and exam and note for students in class A" />
          <button className="bg-blue-600 text-white w-full mt-3 py-2 rounded">Add New Notes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow h-64 flex items-center justify-center text-gray-400">
          Bar Chart: Class Performance Summary
        </div>
        <div className="bg-white p-4 rounded-xl shadow h-64 flex items-center justify-center text-gray-400">
          Pie Chart: Attendance Summary
        </div>
      </div>
    </motion.div>
  );
};

export default ClassManagement;
