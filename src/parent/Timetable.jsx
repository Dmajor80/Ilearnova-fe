import React from 'react';
import SideBar from "./components/Sidebar"
// import { Card, CardContent, Typography, MenuItem, Select } from '@mui/material';

// const timetable = {
//     '08:00 am': {
//         Monday: 'Mathematics',
//         Tuesday: 'Mathematics',
//         Wednesday: 'Mathematics',
//         Thursday: 'Mathematics',
//         Friday: 'Mathematics',
//     },
//     '08:30 am': {
//         Monday: 'Social Studies',
//         Tuesday: 'Social Studies',
//         Wednesday: 'Social Studies',
//         Thursday: 'Social Studies',
//         Friday: 'Social Studies',
//     },
//     '09:00 am': {
//         Monday: 'English Language',
//         Tuesday: 'English Language',
//         Wednesday: 'English Language',
//         Thursday: 'English Language',
//         Friday: 'English Language',
//     },
//     '09:30 am': {
//         Monday: 'Civic Education',
//         Tuesday: 'Civic Education',
//         Wednesday: 'Civic Education',
//         Thursday: 'Civic Education',
//         Friday: 'Civic Education',
//     },
//     '10:00 am': {
//         Monday: 'Economics',
//         Tuesday: 'Economics',
//         Wednesday: 'Economics',
//         Thursday: 'Economics',
//         Friday: 'Economics',
//     }
// };

// const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function Timetable() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <SideBar />
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                    {/* <Typography variant="h5" className="font-semibold">Timetable</Typography> */}
                </div>
                {/* <Select defaultValue="Grade 2" className="mt-4 md:mt-0">
                    <MenuItem value="Grade 1">Grade 1</MenuItem>
                    <MenuItem value="Grade 2">Grade 2</MenuItem>
                    <MenuItem value="Grade 3">Grade 3</MenuItem>
                </Select> */}
            </div>

            <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-4 min-w-[900px]">
                    <div></div>
                    {/* {days.map(day => (
                        <div key={day} className="text-center font-medium text-gray-700">{day}</div>
                    ))} */}

                    {/* {Object.entries(timetable).map(([time, subjects], i) => (
                        <React.Fragment key={i}>
                            <div className="text-gray-600 text-sm font-semibold pt-2">{time}</div>
                            {days.map(day => (
                                <Card key={day} className="bg-white shadow-sm">
                                    <CardContent className="p-3">
                                        <Typography variant="body2" className="text-sm font-medium text-blue-600">
                                            {subjects[day] || '—'}
                                        </Typography>
                                        <Typography variant="caption" className="text-gray-500">
                                            Class Session
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </React.Fragment>
                    ))} */}
                </div>
            </div>
        </div>
    );
}

export default Timetable