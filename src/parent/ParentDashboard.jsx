import React from 'react';
// import { Avatar, Card, CardContent, Typography, IconButton, Badge } from '@mui/material';
// import { Notifications } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { CalendarMonth } from '@mui/icons-material';
import SideBar from "./components/Sidebar"

const data = [
  { name: 'Math', score: 80 },
  { name: 'Science', score: 90 },
  { name: 'English', score: 60 },
  { name: 'History', score: 70 },
  { name: 'Art', score: 40 },
  { name: 'Music', score: 45 },
  { name: 'PE', score: 95 },
];

 function ParentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
     <SideBar/>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            {/* <Typography variant="h6">Welcome,</Typography> */}
            {/* <Typography variant="h4" className="text-blue-600 font-bold">Mrs Daniel</Typography> */}
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              {/* <IconButton>
                <Badge color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton> */}
            </div>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Search" className="px-3 py-1 rounded-md border border-gray-300" />
              {/* <Avatar alt="Priscilla" src="https://i.pravatar.cc/150?img=65" /> */}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="relative bg-[url(/Frame.png)] my-6 rounded-xl overflow-hidden bg-gradient-to-r from-yellow-400 via-blue-700 to-purple-600 h-24 md:h-32">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            {/* <Avatar src="https://i.pravatar.cc/150?img=65" sx={{ width: 96, height: 96 }} /> */}
          </div>
        </div>

        {/* Student Info */}
        <div className="text-center mt-16">
          {/* <Typography variant="h6">Priscilla Daniel</Typography>
          <Typography variant="body2" color="textSecondary">ilearnova/Stu/001</Typography>
          <Typography variant="body2" color="textSecondary">Grade 6</Typography> */}
        </div>

        {/* Score and Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
           {/* <Card className="md:col-span-2"> */}
            {/* <CardContent> */}
              {/* <Typography variant="h6">Score</Typography> */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            {/* </CardContent> */}
          {/* </Card>  */}

          {/* <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6">Upcoming Classes</Typography>
                <CalendarMonth className="text-gray-500" />
              </div>
              <div className="grid grid-cols-7 text-center text-sm text-gray-500">
                {['Mo','Tu','We','Th','Fr','Sa','Su'].map(day => <div key={day}>{day}</div>)}
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={`py-1 ${[22, 24, 25, 26].includes(i+1) ? 'text-white bg-blue-500 rounded-full' : ''}`}>{i + 1}</div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </main>
    </div>
  );
} 

export default ParentDashboard