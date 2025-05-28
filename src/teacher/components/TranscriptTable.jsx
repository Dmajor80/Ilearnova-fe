import { motion } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 }
  })
};

const TranscriptTable = ({ subjects }) => {
  return (
    <motion.div
      className="overflow-x-auto"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {/* action buttons */}
      <div className="flex justify-end mb-4 space-x-2 px-4">
        <button className="px-3 py-2 border rounded text-gray-700 hover:bg-gray-100">
          Filter
        </button>
        <button className="px-3 py-2 border rounded text-gray-700 hover:bg-gray-100">
          Contact Teacher
        </button>
        <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Download
        </button>
      </div>

      {/* table */}
      <table className="min-w-[700px] w-full text-sm">
        <thead className="bg-white">
          <tr className="text-gray-600 bg-white  font-medium">
            <th className="px-4 py-2 text-left">S/N</th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-center">Term 1</th>
            <th className="px-4 py-2 text-center">Term 2</th>
            <th className="px-4 py-2 text-center">Term 3</th>
            <th className="px-4 py-2 text-center">Final Grade</th>
            <th className="px-4 py-2 text-left">Remark</th>
          </tr>
        </thead>
        <tbody >
          {subjects.map((subj, idx) => (
            
            <motion.tr
              key={idx}
              custom={idx}
              variants={rowVariants}
              className={`bg-red-700 ${
                idx % 2 === 0 ? "" : "bg-blue-50"
              }`}
            >
              <td className="px-4 py-4 text-left">{idx + 1}</td>
              <td className="px-4 py-4 text-left">{subj.name}</td>
              <td className="px-4 py-4 text-center">{subj.term1}</td>
              <td className="px-4 py-4 text-center">{subj.term2}</td>
              <td className="px-4 py-4 text-center">{subj.term3}</td>
              <td className="px-4 py-4 text-center font-semibold text-green-600">
                {subj.final}
              </td>
              <td className="px-4 py-4 text-left">{subj.remark}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TranscriptTable;
