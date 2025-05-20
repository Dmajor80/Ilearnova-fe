const courses = [
  {
    id: 1,
    title: "Introduction to Physics",
    teacher: "Teacher A",
    lessons: 15,
    themes: 3,
    dateStarted: "10/01/2024",
    progress: 40,
    image: "/api/placeholder/320/200",
  },
  {
    id: 2,
    title: "Introduction to Chemistry",
    teacher: "Teacher B",
    lessons: 20,
    themes: 4,
    dateStarted: "01/03/2024",
    progress: 50,
    image: "/api/placeholder/320/200",
  },
  {
    id: 3,
    title: "Use Of English",
    teacher: "Teacher C",
    lessons: 30,
    themes: 5,
    dateStarted: "01/01/2024",
    progress: 40,
    image: "/api/placeholder/320/200",
  },
  {
    id: 4,
    title: "Mathematics: Simultaneous Equation",
    teacher: "Teacher A",
    lessons: 15,
    themes: 3,
    dateStarted: "01/01/2024",
    progress: 40,
    image: "/api/placeholder/320/200",
  },
  {
    id: 5,
    title: "Advance Mathematics: DV/DX Solutions",
    teacher: "Teacher B",
    lessons: 20,
    themes: 3,
    dateStarted: "01/03/2024",
    progress: 50,
    image: "/api/placeholder/320/200",
  },
  {
    id: 6,
    title: "Biology: Reproduction",
    teacher: "Teacher C",
    lessons: 30,
    themes: 5,
    dateStarted: "01/01/2024",
    progress: 40,
    image: "/api/placeholder/320/200",
  },
];
export function CourseCard({ course }) {
  return (
    <div className="bg-white rounded shadow">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="rounded-t w-full object-cover h-48"
        />
        <Link to="/course-page">
          <button className="absolute inset-0 m-auto w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white">
            <ChevronRight size={24} />
          </button>
        </Link>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-2">{course.title}</h3>
        <div className="flex items-center mb-2">
          <img
            src="/api/placeholder/32/32"
            alt={course.teacher}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium">{course.teacher}</p>
            <p className="text-xs text-gray-500">
              {course.lessons} Lessons - {course.themes} Key Themes
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs mt-2">
          <span>Date Started: {course.dateStarted}</span>
          <span className="font-medium text-blue-600">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
          <div
            className="bg-blue-600 h-1 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
