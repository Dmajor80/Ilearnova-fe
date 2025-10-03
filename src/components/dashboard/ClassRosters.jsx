import React from 'react';

const ClassRosters = ({ classRosters }) => {
  if (!classRosters || classRosters.length === 0) {
    return <p className="text-gray-500 text-sm">No class rosters available.</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold mb-2">Class Rosters</h2>
      {classRosters.map((cls) => (
        <div
          key={cls.class_id}
          className="border rounded p-3 bg-gray-50 shadow-sm mb-3"
        >
          <h3 className="font-semibold text-blue-700">{cls.class_name}</h3>
          <p>Academic Year: {cls.academic_year}</p>
          <p>Total Students: {cls.total_students}</p>
          <div className="mt-2">
            <h4 className="font-semibold">Recent Students:</h4>
            <ul className="list-disc list-inside">
              {cls.recent_students.map((student) => (
                <li key={student.id}>
                  {student.name} ({student.email})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassRosters;
