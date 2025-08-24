import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Star,
  Heart,
} from "lucide-react";

const SchoolHeroSection = () => {
  const floatingAnimation = {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const sparkleAnimation = {
    scale: [1, 1.3, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="container mx-auto px-4 my-8 w-full sm:px-5 relative overflow-hidden">
      {/* Floating educational elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-12 left-12 text-blue-300 opacity-50"
          animate={sparkleAnimation}
        >
          <Star size={20} />
        </motion.div>
        <motion.div
          className="absolute top-24 right-16 text-green-300 opacity-50"
          animate={{
            ...sparkleAnimation,
            transition: { ...sparkleAnimation.transition, delay: 0.8 },
          }}
        >
          <Award size={18} />
        </motion.div>
        <motion.div
          className="absolute bottom-24 left-24 text-purple-300 opacity-50"
          animate={{
            ...sparkleAnimation,
            transition: { ...sparkleAnimation.transition, delay: 1.5 },
          }}
        >
          <Heart size={16} />
        </motion.div>
      </div>

      <div className="flex w-full flex-col gap-6 sm:flex-row">
        {/* Students Card */}
        <motion.div
          className="relative w-full flex-col sm:w-1/2 overflow-hidden rounded-3xl group"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-full flex-col items-center justify-center px-4 text-center text-white sm:py-12 sm:px-16">
            <div className="relative h-72 sm:h-96 w-full">
              <div className="w-full rounded-3xl h-72 sm:h-96 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 relative overflow-hidden">
                {/* Animated book pages floating */}
                <div className="absolute inset-0 opacity-15">
                  <motion.div
                    className="absolute top-8 left-8 w-6 h-8 bg-white rounded-sm"
                    animate={{
                      x: [0, 20, 0],
                      y: [0, -15, 0],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute top-16 right-12 w-8 h-6 bg-white rounded-sm"
                    animate={{
                      x: [0, -25, 0],
                      y: [0, 20, 0],
                      rotate: [0, -15, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  <motion.div
                    className="absolute bottom-12 left-16 w-5 h-7 bg-white rounded-sm"
                    animate={{
                      x: [0, 15, 0],
                      y: [0, -10, 0],
                      rotate: [0, 8, 0],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center  bg-opacity-25 rounded-3xl">
                  <motion.div className="mb-4" animate={floatingAnimation}>
                    <BookOpen className="w-16 h-16 text-yellow-300" />
                  </motion.div>

                  <motion.div
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Students
                  </motion.div>

                  <motion.div
                    className="text-lg mb-8 opacity-90 max-w-xs px-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Discover, learn, and grow with our engaging curriculum
                  </motion.div>

                  <motion.button
                    className="text-lg sm:text-xl bg-white text-blue-600 px-8 py-4 rounded-full font-semibold cursor-pointer shadow-lg hover:shadow-xl transform transition-all duration-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join Our School
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Teachers Card */}
        <motion.div
          className="relative w-full flex-col sm:w-1/2 overflow-hidden rounded-3xl group mt-5 sm:mt-0"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex flex-col items-center justify-center px-4 text-center text-white sm:py-12 sm:px-16">
            <div className="relative h-72 sm:h-96 w-full">
              <div className="w-full rounded-3xl h-72 sm:h-96 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 relative overflow-hidden">
                {/* Animated academic elements */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    className="absolute top-10 left-10"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <GraduationCap size={32} className="text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-10 right-10"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Users size={28} className="text-white" />
                  </motion.div>
                  {/* Floating dots representing knowledge */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        left: `${15 + (i % 4) * 20}%`,
                        top: `${20 + Math.floor(i / 4) * 25}%`,
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center  bg-opacity-25 rounded-3xl">
                  <motion.div
                    className="mb-4"
                    animate={{
                      ...floatingAnimation,
                      transition: {
                        ...floatingAnimation.transition,
                        delay: 0.5,
                      },
                    }}
                  >
                    <div className="relative">
                      <GraduationCap className="w-16 h-16 text-yellow-300" />
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Teachers
                  </motion.div>

                  <motion.div
                    className="text-lg mb-8 opacity-90 max-w-xs px-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Shape minds and inspire the next generation
                  </motion.div>

                  <motion.button
                    className="text-lg sm:text-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold cursor-pointer shadow-lg hover:shadow-xl transform transition-all duration-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)",
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Teaching
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolHeroSection;
