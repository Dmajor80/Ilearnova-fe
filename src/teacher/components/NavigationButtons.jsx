import { motion } from 'framer-motion';

const NavigationButtons = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0"
  >
    <div className="space-x-3">
      <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition-all">
        Previous
      </button>
      <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition-all">
        Next
      </button>
    </div>
    <div className="space-x-3">
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-all">
        Save progress
      </button>
      <button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded transition-all">
        Submit
      </button>
    </div>
  </motion.div>
);

export default NavigationButtons;
