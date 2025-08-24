import { motion } from "framer-motion";

const StudentProfile = ({ student }) => {
  return (
    <motion.div
      className="text-center bg-white py-6 rounded-xl shadow-md mb-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-indigo-700 w-full h-24 rounded-t-xl relative">
        <img
          src={student.image}
          alt={student.name}
          className="w-24 h-24 rounded-full border-4 border-white absolute -bottom-12 left-1/2 transform -translate-x-1/2"
        />
      </div>
      <div className="mt-14">
        <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
        <p className="text-gray-500">{student.id}</p>
        <p className="text-gray-500">{student.grade}</p>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
