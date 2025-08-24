import React from 'react'
import CoursesComponent from './components/CourseComponents'
import AttendanceTable from './components/AttendanceTable'
import ResourceLibrary from './components/ResourceLibrary'

const Resources = () => {
  return (
    <>
        <CoursesComponent page="Resources" />
            <div className="min-h-screen bg-gray-100 p-6">
      <ResourceLibrary />
    </div>
        
   
  

      
    </>
  )
}

export default Resources
