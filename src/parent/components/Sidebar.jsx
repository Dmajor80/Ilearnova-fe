import React from 'react'
import {Link} from 'react-router-dom'

function Navigation() {
  return (

    <aside className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-4 text-xl font-bold border-b border-gray-200">ILEARNOVA</div>
      <nav className="flex flex-col p-4 space-y-2 text-gray-700">
        {/* {['Dashboard', 'Messages', 'Payments', 'Reports', 'Attendance', 'Timetable'].map((item) => (
          <a href="#" key={item} className="hover:text-blue-500">{item}</a>
        ))} */}
<Link to="/parent-dashboard">
  Dashboard
</Link>
<Link to="/messages">
  Messages
</Link>
<Link to="/payments">
  Payments
</Link>
<Link to="/reports>
  Reports
</Link>
<Link to="/attendace">
  Attendance
</Link>
<Link to="/timetable">
  Timetable
</Link>
      </nav>
    </aside>
  )
}

export default Navigation