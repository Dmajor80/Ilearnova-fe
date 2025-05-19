function CoursesComponent({ page }) {
  return (
    <div>
      {/* dashboard nav */}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          <p className="text-gray-500 text-xs mt-1">Page/Teacher Portal</p>
          <h2 className="font-medium mt-2">{page}</h2>
        </div>
        <div className="flex items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Priscilla"
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
          <div>
            <img
              src="../assets/image.png"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
      {/* end of dashboard nav */}

      {/* <div className="grid grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div> */}
    </div>
  );
}

export default CoursesComponent;