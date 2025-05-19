import { motion } from "framer-motion";

const ResourceCard = ({ title, type, uploadDate, grade, subject }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-xl p-4 w-full max-w-xs flex flex-col justify-between"
    >
      <div className="text-sm text-gray-500 mb-2 flex justify-between">
        <span>Last Saved: 3rd December, 2024 – 1:00PM</span>
        <span className="text-blue-500 cursor-pointer text-xs font-semibold">Edit</span>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-blue-700">{title}</h2>
        <p className="text-sm text-gray-700">Type: {type}</p>
        <p className="text-sm text-gray-700">Uploaded Date: {uploadDate}</p>
        <p className="text-sm text-gray-700">Class: {grade}</p>
        <p className="text-sm text-gray-700">Subject: {subject}</p>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-all">
          Share Resources
        </button>
        <button className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-all">
          Delete Resources
        </button>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
