import React from "react";

const AboutTeacher = ({ teacher }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">About {teacher.name}</h2>
      <p className="text-gray-700">{teacher.about}</p>
      <h3 className="text-xl font-semibold mt-4">Education</h3>
      <p className="text-gray-700">
        {teacher.eduSchool} ({teacher.eduDate})
      </p>
      <p className="text-gray-700">
        {teacher.eduSchool2} ({teacher.eduDate2})
      </p>
      <h3 className="text-xl font-semibold mt-4">Expertise</h3>
      <p className="text-gray-700">{teacher.expertise}</p>
    </div>
  );
};

export default AboutTeacher;
