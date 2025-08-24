import { motion } from 'framer-motion';

const Instructions = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="mb-6"
  >
    <h1 className="text-2xl font-semibold text-[#1f3bb3]">Biology: Photosynthesis Worksheet</h1>
    <p className="text-sm text-gray-600 mt-1">Section 1</p>
    <div className="h-1 bg-green-500 w-1/4 my-2 rounded" />
    <p className="text-sm text-gray-700">
      • Answer all questions in complete sentences. Submit before Dec 20, 2024.
    </p>
  </motion.div>
);

export default Instructions;
