import TextAreaAnswer from './TextAreaAnswer';
import { motion } from 'framer-motion';

const QuestionBox = ({ number, question }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-[#f9fafe] p-5 rounded-lg shadow-md mt-6"
  >
    <p className="font-medium text-gray-700 mb-2">Question {number}</p>
    <p className="text-gray-800 mb-4">{question}</p>
    <TextAreaAnswer />
  </motion.div>
);

export default QuestionBox;
