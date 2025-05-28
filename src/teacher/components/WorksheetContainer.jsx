import { motion } from 'framer-motion';

const WorksheetContainer = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f4f7fb] p-4 md:p-8 text-[#1a1a1a]"
    >
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-4 md:p-8">
        {children}
      </div>
    </motion.div>
  );
};

export default WorksheetContainer;
