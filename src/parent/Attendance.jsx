import React from 'react';
// import { Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import DownloadIcon from '@mui/icons-material/Download';
import SideBar from "./components/Sidebar"


// const scoreData = [
//     { subject: 'Math', score: 70 },
//     { subject: 'English', score: 85 },
//     { subject: 'Science', score: 60 },
//     { subject: 'Civic', score: 65 },
//     { subject: 'Agric', score: 45 },
//     { subject: 'French', score: 90 },
//     { subject: 'ICT', score: 80 }
// ];

// const percentageData = [
//     { month: 'Jan', present: 90 },
//     { month: 'Feb', present: 85 },
//     { month: 'Mar', present: 80 },
//     { month: 'Apr', present: 75 },
//     { month: 'May', present: 70 },
//     { month: 'Jun', present: 95 }
// ];

function Attendance() {
    return (
        <div className="flex min-h-screen bg-red-500">
            {/* Sidebar */}
            {/* <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-4 text-xl font-bold border-b border-gray-200">ILEARNOVA</div>
                <nav className="flex flex-col p-4 space-y-2 text-gray-700">
                    {['Dashboard', 'Messages', 'Payments', 'Reports', 'Attendance', 'Timetable'].map((item) => (
                        <a href="#" key={item} className="hover:text-blue-500">{item}</a>
                    ))}
                </nav>
            </aside> */}
            
<SideBar/>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    {/* <Typography variant="h5" className="font-semibold">Performance Insight</Typography> */}
                    <div className="flex gap-2 mt-4 md:mt-0">
                        {/* <Button variant="outlined" startIcon={<FilterListIcon />}>Filter</Button>
                        <Button variant="contained" startIcon={<DownloadIcon />}>Download</Button> */}
                    </div>
                </div>

                {/* Score Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* <Card className="lg:col-span-2"> */}
                        {/* <CardContent> */}
                            {/* <Typography variant="h6" className="mb-4">Attendance</Typography> */}
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={scoreData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="subject" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="score" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        {/* </CardContent> */}
                    {/* </Card>  */}

                    {/* Alerts */}
                    {/* <div className="space-y-4">
                        <Typography variant="h6">Performance Alert</Typography>
                        <div className="p-4 bg-red-100 rounded-lg">
                            <p className="text-sm">John Smith has 6 scores dropped <b>(45%)</b></p>
                            <Button variant="outlined" fullWidth className="mt-2">Dismiss</Button>
                        </div>
                        <div className="p-4 bg-yellow-100 rounded-lg">
                            <p className="text-sm">2 low scores for Civic & Agric</p>
                            <Button variant="outlined" fullWidth className="mt-2">Dismiss</Button>
                        </div>
                        <div className="p-4 bg-blue-100 rounded-lg">
                            <p className="text-sm">View low attendance performance</p>
                            <Button variant="contained" fullWidth className="mt-2">View Details</Button>
                        </div>
                    </div> */}
                </div> 

                {/* Attendance Chart */}
                {/* <Card className="mt-6"> */}
                    {/* <CardContent> */}
                        {/* <Typography variant="h6" className="mb-4">Attendance Percentage</Typography> */}
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={percentageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="present" fill="#82ca9d" name="Attendance %" />
                            </BarChart>
                        </ResponsiveContainer>
                    {/* </CardContent> */}
                {/* </Card> */}
            </main>
        </div>
    );
}
export default Attendance