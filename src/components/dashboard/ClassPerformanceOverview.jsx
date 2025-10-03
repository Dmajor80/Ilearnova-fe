import React from 'react';

const ClassPerformanceOverview = ({ classPerformance }) => {
  if (!classPerformance || classPerformance.length === 0) {
    return <p className="text-gray-500 text-sm">No class performance data.</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold mb-2">Class Performance Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classPerformance.map((cls) => (
          <div
            key={cls.class_id}
            className="border rounded p-3 bg-gray-50 shadow-sm"
          >
            <h3 className="font-semibold text-blue-700">{cls.class_name}</h3>
            <p>Academic Year: {cls.academic_year}</p>
            <p>Students: {cls.student_count}</p>
            <p>
              Average Score: {cls.average_score} (Min: {cls.min_score}, Max:{" "}
              {cls.max_score})
            </p>
            <p>Attendance Rate: {cls.attendance_rate}%</p>
            <p>Assignment Completion Rate: {cls.assignment_completion_rate}%</p>
            <p>Total Grades: {cls.total_grades}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassPerformanceOverview;
