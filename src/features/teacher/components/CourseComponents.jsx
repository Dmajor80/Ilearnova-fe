import { useState, useEffect } from "react";
import { getCourses } from "@/api/academicApi";

function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{course.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">Code: {course.code}</span>
            <span>Status: {course.status}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          course.status === 'active' ? 'bg-green-100 text-green-800' :
          course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {course.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Class</p>
          <p className="font-medium">{course.class?.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Subject</p>
          <p className="font-medium">{course.subject?.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Teacher</p>
          <p className="font-medium">{course.teacher?.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Max Students</p>
          <p className="font-medium">{course.max_students || 'N/A'}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {course.start_date && (
            <span>Starts: {new Date(course.start_date).toLocaleDateString()}</span>
          )}
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

function CoursesComponent({ page }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCourses();
        setCourses(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* dashboard nav */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-xs mt-1">Page/Teacher Portal</p>
          <h2 className="font-medium mt-2">{page}</h2>
        </div>
        <div className="flex items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-full w-full py-2 px-4 pl-10"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      {/* end of dashboard nav */}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      )}



      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">No courses found</p>
              {searchTerm && (
                <p className="text-gray-400 mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CoursesComponent;