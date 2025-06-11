import React, { useEffect } from "react";
import Navbar from "../navbar/Nabar";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Footer from "../homepage/Footer";
import SchoolComponents from "../homepage/SchoolComponents";
import EducationLanding from "../homepage/EducationLanding";
import IlearnovaHero from "./IlearnovaHero";
import SchoolHeroSection from "./SchoolHeroSection";

// Animated component for fade-in-up effect
const FadeInUp = ({ children, delay = 0, className = "", ...props }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
            delay: delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated number counter component
const CounterAnimation = ({ end, title, className, textColor = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const count = useAnimation();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (inView) {
      let startValue = 0;
      const incrementValue = end / 60; // Increment in steps
      const counter = setInterval(() => {
        startValue += incrementValue;
        if (startValue >= end) {
          setValue(end);
          clearInterval(counter);
        } else {
          setValue(Math.floor(startValue));
        }
      }, 30);
    }
  }, [inView, end]);

  return (
    <div ref={ref} className={`flex flex-col ${className}`}>
      <div
        className={`max-md:text-4xl text-center text-2xl sm:text-7xl font-light ${textColor}`}
      >
        {value}
        {end.toString().includes("%") ? "%" : ""}
      </div>
      <div className="text-center text-opacity-80 text-xl sm:text-3xl">
        {title}
      </div>
    </div>
  );
};

const HomePage = () => {
  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div id="root" className="overflow-x-hidden">
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          inset: "16px",
          pointerEvents: "none",
        }}
      ></div>
      <div className="flex flex-col items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />

        {/* Hero Section with Parallax */}
        <IlearnovaHero />

        {/* Our Success Section */}
        <div className="container mx-auto px-4 py-16">
          <FadeInUp>
            <div className="text-[white] text-[46px] sm:text-[40px] max-md:mt-10 md:text-4xl lg:text-[50px] mt-8 text-center  font-bold lg:leading-[62.4px]">
              Our Success
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="text-[18px] sm:text-[20px] lg:text-[24px] mt-4 text-center leading-6 sm:leading-10 tracking-wide text-white sm:px-32">
              Through innovative teaching methodologies and a dedicated faculty,
              we've consistently achieved remarkable results. Our students have
              not only excelled academically but have also emerged as confident,
              compassionate individuals ready to make a positive impact on the
              world.
            </div>
          </FadeInUp>

          {/* Stats counter */}
          {/* <motion.div
            className="mt-16 flex w-full flex-wrap justify-center gap-8 whitespace-nowrap px-5 sm:gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CounterAnimation
              end={10000}
              title="Students"
              textColor="text-white"
              style={{ color: "white" }}
            />
            <CounterAnimation
              end={75}
              title="Total success"
              textColor="text-white"
            />
            <CounterAnimation
              end={100}
              title="Main questions"
              textColor="text-white"
            />
            <CounterAnimation
              end={26}
              title="Chief experts"
              textColor="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent"
              className="hidden sm:flex"
            />
            <CounterAnimation
              end={16}
              title="Years of experience"
              textColor="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent"
              className="hidden sm:flex"
            />
          </motion.div> */}
        </div>

        {/* All-In-One Cloud Software Section */}
        <div className="container mx-auto px-4 py-12">
          <FadeInUp>
            <div className="mt-8 text-[24px] font-bold sm:text-[26px] lg:text-[40px] text-center">
              <span className="font-bold text-white">All-In-One </span>
              <span className="font-bold text-white">Cloud Software.</span>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="text-xl max-md:max-w-full mt-4 text-center leading-7 text-[white] px-4">
              Ilearnova is one powerful online software suite that combines all
              the tools needed to run a successful school or office.
            </div>
          </FadeInUp>

          {/* Service cards */}
          <div className="max-md:mt-10 max-md:max-w-full mt-16 w-full max-w-[1470px] px-4">
            <div className="max-md:flex-col max-md:gap-0 flex w-full flex-col gap-5 sm:flex-row">
              <FadeInUp
                delay={0.1}
                className="max-md:ml-0 max-md:w-full relative flex flex-col items-center sm:w-[33%] mb-16 sm:mb-0"
              >
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="absolute top-[-24px] m-auto h-[100px] w-[100px]"
                  alt=""
                  src="https://dimatech-lsm-frontend.vercel.app/group-80.svg"
                />
                <div className="max-md:mt-10 max-md:max-w-full flex h-full w-full grow flex-col rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-2 py-12 text-center shadow-2xl lg:px-14">
                  <div className="mt-5 font-medium text-[white] text-[20px] lg:text-[26px]">
                    Online Billing, Invoicing, & Contracts
                  </div>
                  <div className="mt-5 text-[white] lg:text-xl lg:leading-9">
                    Simple and secure control of your organization's financial
                    and legal transactions. Send customized invoices and
                    contracts
                  </div>
                </div>
              </FadeInUp>

              <FadeInUp
                delay={0.3}
                className="max-md:ml-0 max-md:w-full relative flex flex-col items-center sm:w-[33%] mb-16 sm:mb-0"
              >
                <motion.img
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="absolute top-[-24px] m-auto h-[100px] w-[100px]"
                  alt=""
                  src="https://dimatech-lsm-frontend.vercel.app/group-81.svg"
                />
                <div className="max-md:mt-10 max-md:max-w-full flex h-full w-full grow flex-col rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-2 py-12 text-center shadow-2xl lg:px-14">
                  <div className="mt-5 font-medium text-[white] text-[20px] lg:text-[26px]">
                    Easy Scheduling & Attendance Tracking
                  </div>
                  <div className="mt-5 text-[white] lg:text-xl lg:leading-9">
                    Schedule and reserve classrooms at one campus or multiple
                    campuses. Keep detailed records of student attendance
                  </div>
                </div>
              </FadeInUp>

              <FadeInUp
                delay={0.5}
                className="max-md:ml-0 max-md:w-full relative flex flex-col items-center sm:w-[33%]"
              >
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="absolute top-[-24px] m-auto h-[100px] w-[100px]"
                  alt=""
                  src="https://dimatech-lsm-frontend.vercel.app/group-79.svg"
                />
                <div className="max-md:mt-10 max-md:max-w-full flex h-full w-full grow flex-col rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-2 py-12 text-center shadow-2xl lg:px-14">
                  <div className="mt-5 font-medium text-[white] text-[20px] lg:text-[26px]">
                    Customer Tracking
                  </div>
                  <div className="mt-5 text-white lg:text-xl lg:leading-9">
                    Automate and track emails to individuals or groups.
                    Skillline's built-in system helps organize your organization
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>

        {/* What is Ilearnova Section */}
        <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl my-12">
          <FadeInUp>
            x
            <div className="mt-10 whitespace-nowrap text-center text-[30px] sm:text-[34px] lg:text-[40px] font-bold text-teal-500">
              What is <span className="text-white">Ilearnova?</span>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="text-[18px] sm:text-[20px] lg:text-[24px] mt-4 text-center leading-6 sm:leading-10 tracking-wide text-white sm:px-32">
              Ilearnova is a platform that allows educators to create online
              classes whereby they can store the course materials online; manage
              assignments, quizzes and exams; monitor due dates; grade results
              and provide students with feedback all in one place.
            </div>
          </FadeInUp>
        </div>
        <EducationLanding />
        {/* Teachers & Learners Section */}
        <SchoolHeroSection />

        {/* Everything You Can Do Section */}
        <div className="container mx-auto w-full px-4 sm:px-20 py-16">
          <div className="max-md:gap-0 flex flex-col gap-5 md:flex-row">
            <FadeInUp className="max-md:w-full flex flex-col sm:w-1/2">
              <div className="my-auto flex flex-col px-5 text-white">
                <span className="mt-10 text-center text-[25px] font-bold ">
                  Everything you can do in a physical classroom, you can do with
                  Ilearnova
                </span>
                <div className="text-[18px] sm:text-[20px] lg:text-[24px] mt-4 text-center leading-6 sm:leading-10 tracking-wide text-white sm:px-32">
                  Ilearnova's school management software helps traditional and
                  online schools manage scheduling, attendance, payments and
                  virtual classrooms all in one secure cloud-based system.
                </div>
              </div>
            </FadeInUp>

            <FadeInUp
              delay={0.3}
              className="flex flex-col p-1 sm:w-1/2 mt-10 sm:mt-0"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                loading="lazy"
                src="https://dimatech-lsm-frontend.vercel.app/group-17.svg"
                className="max-md:mt-10 max-md:max-w-full aspect-auto w-full grow rounded-2xl"
              />
            </FadeInUp>
          </div>
        </div>

        {/* Our Features Section */}
        <div className="container mx-auto px-4 py-12">
          <FadeInUp>
            <div className="text-4xl mt-4 whitespace-nowrap font-bold leading-[64.8px] text-center text-teal-500 sm:text-6xl">
              <span>Our </span>
              <span className="text-teal-500">Features</span>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="text-xl text-center leading-10 text-white mt-4">
              This very extraordinary feature, can make learning activities more
              efficient
            </div>
          </FadeInUp>

          <div className="mt-12 w-full px-5">
            <div className="flex flex-col justify-center gap-10 sm:flex-row">
              <motion.div
                className="relative flex sm:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <img
                  loading="lazy"
                  src="https://dimatech-lsm-frontend.vercel.app/group-17.svg"
                  className="inset-0 w-[100%] object-contain sm:h-96 rounded-2xl"
                />
                <div className="max-md:mt-10 absolute right-[-2px] mt-20 hidden gap-0 self-end sm:flex">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="max-md:mt-10 mt-52 h-[30px] w-[30px] self-end rounded-full bg-red-400"
                  ></motion.div>
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="h-[264px] w-[264px] max-w-full rounded-full bg-indigo-500 bg-opacity-30"
                  ></motion.div>
                </div>
              </motion.div>

              <motion.div
                className="my-auto flex max-w-full flex-col self-start sm:self-end sm:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-center font-bold text-2xl text-teal-500 mb-6">
                  Perfect user interface for a classroom
                </p>

                <motion.div
                  className="my-4 flex gap-4 tracking-wide items-center"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.img
                    whileHover={{ rotate: 10 }}
                    loading="lazy"
                    src="https://dimatech-lsm-frontend.vercel.app/group-86@2x.png"
                    className="bg-zinc-50 aspect-square h-[50px] w-[60px] self-start rounded-full object-cover shadow-md"
                  />
                  <div className="self-center text-lg text-white">
                    Teachers don't get lost in the grid view and have a
                    dedicated Podium space.
                  </div>
                </motion.div>

                <motion.div
                  className="my-4 flex gap-4 tracking-wide items-center"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.img
                    whileHover={{ rotate: -10 }}
                    loading="lazy"
                    src="https://dimatech-lsm-frontend.vercel.app/group-88@2x.png"
                    className="bg-zinc-50 aspect-square h-[50px] w-[60px] self-start rounded-full object-cover shadow-md"
                  />
                  <div className="self-center text-lg text-white">
                    TA's and presenters can be moved to the front of the class.
                  </div>
                </motion.div>

                <motion.div
                  className="my-4 flex gap-4 tracking-wide items-center"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.img
                    whileHover={{ rotate: 10 }}
                    loading="lazy"
                    src="https://dimatech-lsm-frontend.vercel.app/group-86@2x.png"
                    className="bg-zinc-50 aspect-square h-[50px] w-[60px] rounded-full object-cover shadow-md"
                  />
                  <div className="self-center text-lg text-white">
                    Teachers can easily see all students and class data at one
                    time.
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tools For Teachers And Learners Section */}
        <div className="container mx-auto px-4 py-12 bg-gray-50 rounded-3xl my-12">
          <div className="flex flex-col sm:flex-row gap-8">
            <FadeInUp className="my-auto sm:w-1/2">
              <div className="text-4xl max-md:max-w-full relative text-center font-bold leading-[64px] text-indigo-900 sm:mt-20">
                <span className="font-semibold text-teal-500">
                  Tools For Teachers And Learners
                </span>
              </div>
              <div className="text-xl z-10 px-1 mt-6 tracking-wide text-gray-500 sm:ml-12">
                Class has a dynamic set of teaching tools built to be deployed
                and used during class. Teachers can{" "}
                <br className="hidden md:block" /> hand out assignments in
                real-time for students to complete and submit.
              </div>
            </FadeInUp>

            <FadeInUp
              delay={0.3}
              className="max-md:ml-0 max-md:w-full flex flex-col sm:ml-5 sm:w-1/2"
            >
              <motion.img
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                loading="lazy"
                src="https://dimatech-lsm-frontend.vercel.app/group-122.svg"
                className="mt-5 rounded-2xl shadow-lg"
              />
            </FadeInUp>
          </div>
        </div>

        {/* Class Management Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="left-0 flex flex-col px-5 md:flex-row gap-8">
            <FadeInUp className="mt-5 flex flex-col px-2 sm:my-auto sm:pl-5 sm:w-1/2">
              <div className="text-3xl text-center font-bold text-teal-500">
                <span className="  font-semibold text-teal-500">
                  Class Management
                </span>{" "}
                <span className="font-semibold">Tools for Educators</span>
              </div>
              <div className="text-[18px] sm:text-[20px] lg:text-[24px] mt-5 text-center leading-6 sm:leading-10 tracking-wide text-white sm:px-32">
                Class provides tools to help run and manage the class such as
                Class Roster, <br className="hidden md:block" />
                Attendance, and more. With the Gradebook, teachers can review
                and grade tests and <br className="hidden md:block" /> quizzes
                in real-time.
              </div>
            </FadeInUp>

            <FadeInUp delay={0.3} className="flex flex-col sm:w-1/2">
              <div className="relative">
                <motion.div
                  className="absolute -top-4 left-4 h-[23px] w-[23px] rounded-full bg-orange-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                ></motion.div>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  loading="lazy"
                  src="https://dimatech-lsm-frontend.vercel.app/group124.png"
                  className="w-full rounded-2xl object-contain shadow-2xl"
                />
              </div>
            </FadeInUp>
          </div>
        </div>
        {/* one on one discussion */}
        <div className="left-0 mt-20 flex flex-col px-5 md:flex-row mb-[4rem]">
          <div className="flex flex-col sm:flex-row">
            <div className="ml-28 h-[23px] w-[23px] rounded-full bg-orange-500"></div>
            <img
              loading="lazy"
              src="https://dimatech-lsm-frontend.vercel.app/group106.png"
              className="w-full rounded-2xl object-contain shadow-2xl sm:w-2/3"
            />
          </div>
          <div className="mt-5 flex flex-col px-2 sm:my-auto sm:pl-5">
            <div className="text-[30px] text-center font-bold text-teal-500">
              <span className="font-semibold">One-on-One Discussions</span>
            </div>
            <div className="text-[18px] sm:text-[20px] lg:text-[24px] mt-4 text-center leading-6 sm:leading-10 tracking-wide text-white sm:px-32">
              Teachers and teacher assistants can talk with students privately
              without leaving the Zoom environment. without leaving the Zoom
              environment.without leaving the Zoom environment.
            </div>
          </div>
        </div>
        <SchoolComponents />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
