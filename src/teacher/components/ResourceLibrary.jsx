import ResourceCard from "./ResourceCard";
import HeaderButtons from "./HeaderButtons";

const mockResources = new Array(6).fill({
  title: "Chapter 1 Notes",
  type: "PDF",
  uploadDate: "Jan 5, 2025",
  grade: "Grade 8",
  subject: "Biology",
});

const ResourceLibrary = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Resourcea Library</h1>
        <HeaderButtons />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockResources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourceLibrary;
