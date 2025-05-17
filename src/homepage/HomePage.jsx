import React from "react";
import Navbar from "../navbar/Nabar";
// import Nabar from "../navbar/Nabar";
// import Hero from "../hero/Hero";

const HomePage = () => {
  return (
    <div id="root">
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          inset: "16px",
          pointerEvents: "none",
        }}
      ></div>
      <div className="flex flex-col items-center bg-[#B2EBF2]">
        <Navbar />

        <div className="relative flex w-full flex-col items-center bg-gold lg:rounded-b-[20.5rem]">
          <div className="z-10 flex flex-col sm:flex-row sm:gap-16">
            <div className="my-auto p-5 sm:ms-8 text-center sm:p-0 sm:w-1/2">
              <p className="sm:text-[45px] text-[20px] font-black text-white">
                WELCOME BACK TO SCHOOL 🎒📚
              </p>
              <p className="text-justify text-white mt-12 hidden sm:block">
                Summer's adventures are a memory, and it's time to dive back
                into a world of learning and excitement. At Ilearnova, we're
                thrilled to welcome you to a brand-new academic year filled with
                fresh opportunities, new friends, and boundless possibilities.
                As you step into the classroom, remember that each day is a
                chance to grow, discover, and achieve. Our dedicated teachers
                and staff are here to support you every step of the way. Get
                ready to explore new subjects, engage in creative projects, and
                make lasting memories. Let's make this school year the best one
                yet! Embrace the challenges, celebrate the victories, and most
                importantly, enjoy the journey. Welcome back – let's make this
                year unforgettable! 🌟
              </p>
            </div>
            <div>
              <img
                alt=""
                src="https://dimatech-lsm-frontend.vercel.app/group1.png"
                className="max-h-[90vh]"
              />
            </div>
          </div>
        </div>

        <div className="text-slate-950 max-md:mt-10 max-md:text-4xl mt-8 whitespace-nowrap text-center text-5xl font-bold lg:leading-[62.4px]">
          Our Success
        </div>
        <div className="mt-4 justify-center px-4 text-justify text-gray-500 text-opacity-80 lg:px-96 lg:text-center lg:text-lg lg:leading-7">
          Through innovative teaching methodologies and a dedicated faculty,
          we've consistently achieved remarkable results. Our students have not
          only excelled academically but have also emerged as confident,
          compassionate individuals ready to make a positive impact on the
          world.
        </div>

        <div className="mt-8 flex w-full justify-center gap-8 whitespace-nowrap px-5 sm:gap-16">
          <div className="flex flex-col">
            <div className="max-md:text-4xl text-xs self-center font-light sm:text-13xl">
              <span className="text-blue">10K</span>
            </div>
            <div className="text-gold text-opacity-80 sm:text-3xl">
              Students
            </div>
          </div>
          <div className="flex flex-col">
            <div className="max-md:text-4xl text-xs self-center font-light sm:text-13xl">
              <span>75</span> <span>%</span>
            </div>
            <div className="text-slate-950 text-opacity-80 sm:text-3xl">
              Total success
            </div>
          </div>
          <div className="flex flex-col">
            <div className="max-md:text-4xl text-xs self-center font-light text-blue sm:text-13xl">
              100+
            </div>
            <div className="text-gold text-opacity-80 sm:text-3xl">
              Main questions
            </div>
          </div>
          <div className="hidden flex-col sm:flex">
            <div className="max-md:text-4xl text-xs self-center bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent font-light sm:text-13xl">
              26+
            </div>
            <div className="text-slate-950 text-opacity-80 sm:text-3xl">
              Chief experts
            </div>
          </div>
          <div className="hidden flex-col sm:flex">
            <div className="max-md:text-4xl text-xs self-center bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent font-light sm:text-13xl">
              16
            </div>
            <div className="text-slate-950 text-opacity-80 sm:text-3xl">
              Years of experience
            </div>
          </div>
        </div>

        <div className="mt-8 text-3xl font-semibold sm:text-11xl">
          <span className="font-bold text-blue">All-In-One </span>
          <span className="font-bold text-gold">Cloud Software.</span>
        </div>
        <div className="text-2xl max-md:max-w-full mt-4 text-center leading-10 text-gray-500">
          Ilearnova is one powerful online software suite that combines all the
          tools needed to run a successful school or office.
        </div>

        <div className="max-md:mt-10 max-md:max-w-full mt-16 flex w-full max-w-[1470px] px-5">
          <div className="max-md:flex-col max-md:gap-0 flex w-full flex-col gap-5 sm:flex-row">
            <div className="max-md:ml-0 max-md:w-full relative flex flex-col items-center sm:w-[33%]">
              <img
                className="absolute top-[-24px] m-auto h-[100px] w-[100px]"
                alt=""
                src="https://dimatech-lsm-frontend.vercel.app/group-80.svg"
              />
              <div className="max-md:mt-10 max-md:max-w-full flex h-full w-full grow flex-col rounded-3xl bg-white px-2 py-12 text-center shadow-2xl lg:px-14">
                <div className="mt-5 font-medium text-indigo-900 lg:text-3xl">
                  Online Billing, Invoicing, & Contracts
                </div>
                <div className="mt-5 text-gray-500 lg:text-xl lg:leading-9">
                  Simple and secure control of your organization's financial and
                  legal transactions. Send customized invoices and contracts
                </div>
              </div>
            </div>
            <div className="max-md:ml-0 max-md:w-full relative flex flex-col items-center sm:w-[33%]">
              <img
                className="absolute top-[-24px] m-auto h-[100px] w-[100px]"
                alt=""
                src="https://dimatech-lsm-frontend.vercel.app/group-81.svg"
              />
              <div className="max-md:mt-10 max-md:max-w-full flex h-full w-full grow flex-col rounded-3xl bg-white px-2 py-12 text-center shadow-2xl lg:px-14">
                <div className="mt-5 self-center font-medium text-indigo-900 lg:text-3xl">
                  Easy Scheduling & Attendance Tracking
                </div>
                <div className="mt-5 text-gray-500 lg:text-xl lg:leading-9">
                  Schedule and reserve classrooms at one campus or multiple
                  campuses. Keep detailed records of student attendance
                </div>
              </div>
            </div>
            <div className="max-md:ml-0 max-md:w-full relative flex flex-col items-center sm:w-[33%]">
              <img
                className="absolute top-[-24px] m-auto h-[100px] w-[100px]"
                alt=""
                src="https://dimatech-lsm-frontend.vercel.app/group-79.svg"
              />
              <div className="max-md:mt-10 max-md:max-w-full flex h-full w-full grow flex-col rounded-3xl bg-white px-2 py-12 text-center shadow-2xl lg:px-14">
                <div className="mt-5 whitespace-nowrap font-medium text-indigo-900 lg:text-3xl">
                  Customer Tracking
                </div>
                <div className="mt-5 text-gray-500 lg:text-xl lg:leading-9">
                  Automate and track emails to individuals or groups. Skilline's
                  built-in system helps organize your organization
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 whitespace-nowrap text-center text-5xl font-semibold text-teal-500">
          What is <span className="text-teal-500">Ilearnova?</span>
        </div>
        <div className="text-2xl mt-10 text-center leading-10 tracking-wide text-gray-500 sm:px-32">
          Ilearnova is a platform that allows educators to create online classes
          whereby they can store the course materials online; manage
          assignments, quizzes and exams; monitor due dates; grade results and
          provide students with feedback all in one place.
        </div>

        <div className="my-4 w-full sm:px-5">
          <div className="flex w-full flex-col gap-5 sm:flex-row">
            <div className="relative w-full flex-col sm:w-1/2">
              <div className="w-full flex-col items-center justify-center px-4 text-center text-white sm:py-12 sm:px-16">
                <img
                  loading="lazy"
                  src="https://dimatech-lsm-frontend.vercel.app/rectangle-19@2x.png"
                  className="inset-0 h-full w-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-semibold">Teachers</div>
                  <div className="text-2xl max-md:px-5 mt-8 justify-center rounded-[80px] border border-solid border-white px-10 py-7 font-medium">
                    Start a class today
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full flex-col sm:w-1/2">
              <div className="flex flex-col items-center justify-center px-4 text-center text-white sm:py-12 sm:px-16">
                <img
                  loading="lazy"
                  src="https://dimatech-lsm-frontend.vercel.app/rectangle-21@2x.png"
                  className="inset-0 h-auto w-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-semibold">Learners</div>
                  <a
                    href="https://trenova.nyc3.cdn.digitaloceanspaces.com/1app/app-release.apk"
                    className="text-2xl max-md:px-5 mt-8 justify-center rounded-[80px] bg-cyan-400 bg-opacity-90 px-11 py-8 font-medium no-underline"
                  >
                    Download app
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-20">
          <div className="max-md:gap-0 flex flex-col gap-5 md:flex-row">
            <div className="max-md:w-full flex flex-col">
              <div className="my-auto flex flex-col px-5 text-gray-500">
                <span className="mt-10 text-center text-5xl font-semibold text-gold">
                  Everything you can do in a physical classroom, you can do with
                  Ilearnova
                </span>
                <div className="text-2xl max-md:max-w-full leading-10 tracking-wide">
                  Ilearnova's school management software helps traditional and
                  online schools manage scheduling, attendance, payments and
                  virtual classrooms all in one secure cloud-based system.
                </div>
                <div className="text-2xl mt-2 underline">Ilearnova</div>
              </div>
            </div>
            <div className="flex flex-col p-1">
              <img
                loading="lazy"
                src="https://dimatech-lsm-frontend.vercel.app/group-17.svg"
                className="max-md:mt-10 max-md:max-w-full aspect-[1.45] w-full grow"
              />
            </div>
          </div>
        </div>

        <div className="text-4xl mt-4 whitespace-nowrap font-bold leading-[64.8px] text-teal-500 sm:text-13xl">
          <span>Our </span>
          <span className="text-teal-500">Features</span>
        </div>
        <div className="text-2xl text-center leading-10 text-gray-500">
          This very extraordinary feature, can make learning activities more
          efficient
        </div>

        <div className="mt-12 w-full px-5">
          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <div className="relative flex">
              <img
                loading="lazy"
                src="https://dimatech-lsm-frontend.vercel.app/group-17.svg"
                className="inset-0 w-[100%] object-contain sm:h-96"
              />
              <div className="max-md:mt-10 absolute right-[-2px] mt-20 hidden gap-0 self-end sm:flex">
                <div className="max-md:mt-10 mt-52 h-[30px] w-[30px] self-end rounded-full bg-red-400"></div>
                <div className="h-[264px] w-[264px] max-w-full rounded-full bg-indigo-500"></div>
              </div>
            </div>
            <div className="my-auto flex max-w-full flex-col self-start sm:self-end">
              <p className="text-center font-bold text-teal-500">
                Perfect user interface for a classroom
              </p>
              <div className="my-2 flex gap-2 tracking-wide">
                <img
                  loading="lazy"
                  src="https://dimatech-lsm-frontend.vercel.app/group-86@2x.png"
                  className="bg-zinc-50 aspect-square h-[50px] w-[60px] self-start rounded-full"
                />
                <div className="self-center">
                  Teachers don't get lost in the grid view and have a dedicated
                  Podium space.
                </div>
              </div>
              <div className="my-2 flex gap-2 tracking-wide">
                <img
                  loading="lazy"
                  src="https://dimatech-lsm-frontend.vercel.app/group-88@2x.png"
                  className="bg-zinc-50 aspect-square h-[50px] w-[60px] self-start rounded-full"
                />
                <div className="self-center">
                  TA's and presenters can be moved to the front of the class.
                </div>
              </div>
              <div className="my-2 flex gap-2 tracking-wide">
                <img
                  loading="lazy"
                  src="https://dimatech-lsm-frontend.vercel.app/group-86@2x.png"
                  className="bg-zinc-50 aspect-square h-[50px] w-[60px] rounded-full"
                />
                <div className="self-center">
                  Teachers can easily see all students and class data at one
                  time.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-5 flex flex-col sm:mx-16 sm:flex-row">
          <div className="my-auto">
            <div className="text-4xl max-md:max-w-full relative text-center font-bold leading-[64px] text-indigo-900 sm:mt-20">
              <span className="font-semibold text-teal-500">
                Tools For Teachers And Learners
              </span>
            </div>
            <div className="text-2xl z-10 px-1 tracking-wide text-gray-500 sm:ml-12">
              Class has a dynamic set of teaching tools built to be deployed and
              used during class. Teachers can <br /> hand out assignments in
              real-time for students to complete and submit.
            </div>
          </div>
          <div className="max-md:ml-0 max-md:w-full flex flex-col sm:ml-5">
            <div className="text-2xl max-md:max-w-full flex grow flex-col leading-10 text-gray-500">
              <img
                loading="lazy"
                src="https://dimatech-lsm-frontend.vercel.app/group-122.svg"
                className="mt-5 aspect-[1.04] w-[637px]"
              />
            </div>
          </div>
        </div>

        <div className="left-0 mt-20 flex flex-col px-5 md:flex-row">
          <div className="mt-5 flex flex-col px-2 sm:my-auto sm:pl-5">
            <div className="text-3xl font-bold text-teal-500">
              <span className="font-semibold text-teal-500">
                Class Management
              </span>{" "}
              <span className="font-semibold">Tools for Educators</span>
            </div>
            <div className="text-2xl tracking-wide text-gray-500">
              Class provides tools to help run and manage the class such as
              Class Roster, <br />
              Attendance, and more. With the Gradebook, teachers can review and
              grade tests and <br /> quizzes in real-time.
              <span className="text-2xl mt-2 underline">Ilearnova</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="ml-28 h-[23px] w-[23px] rounded-full bg-orange-500"></div>
            <img
              loading="lazy"
              src="https://dimatech-lsm-frontend.vercel.app/group124.png"
              className="w-full rounded-2xl object-contain shadow-2xl sm:w-2/3"
            />
          </div>
        </div>

        <div className="left-0 mt-20 flex flex-col px-5 md:flex-row">
          <div className="flex flex-col sm:flex-row">
            <div className="ml-28 h-[23px] w-[23px] rounded-full bg-orange-500"></div>
            <img
              loading="lazy"
              src="https://dimatech-lsm-frontend.vercel.app/group106.png"
              className="w-full rounded-2xl object-contain shadow-2xl sm:w-2/3"
            />
          </div>
          <div className="mt-5 flex flex-col px-2 sm:my-auto sm:pl-5">
            <div className="text-3xl font-bold text-teal-500">
              <span className="font-semibold">One-on-One Discussions</span>
            </div>
            <div className="text-2xl tracking-wide text-gray-500">
              Teachers and teacher assistants can talk with students privately
              without leaving the <br /> Zoom environment. without leaving the
              Zoom environment.without leaving <br /> the Zoom environment.
            </div>
          </div>
        </div>

        <div className="max-md:px-5 max-md:mt-10 max-md:max-w-full mt-10 flex w-full items-center justify-center bg-gold">
          <div className="mt-4 flex max-w-full flex-col items-center">
            <div className="text-2xl flex max-w-full justify-between gap-5 font-semibold tracking-wider text-white">
              <img
                loading="lazy"
                src="https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png"
                className="aspect-[1.37] w-[114px] max-w-full"
              />
              <div className="h-[83px] bg-gray-500"></div>
              <div className="my-auto">Support for Offline Class</div>
            </div>
            <div className="text-2xl text-slate-400 max-md:mt-10 max-md:max-w-full mt-2 text-center font-medium tracking-wider"></div>
            <div className="mt-6 flex items-center gap-2">
              <div className="border-white text-white rounded-[80px] border border-solid px-4 py-2">
                Want to get in touch??
              </div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://wa.me/+2347065689414"
                className="text-2xl flex items-center justify-center gap-2 rounded-[60px] bg-powderblue px-4 py-2 font-medium"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  color="green"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: "green" }}
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                </svg>
                Contact Us
              </a>
            </div>
            <div className="text-2xl text-white max-md:flex-wrap max-md:mt-10 max-md:mr-2.5 max-md:max-w-full mx-5 mt-5 flex justify-between gap-2 self-stretch text-center tracking-wider">
              <div>Careers</div>
              <div className="h-[23px] w-px bg-gray-500"></div>
              <div className="flex-auto">Privacy Policy</div>
              <div className="h-[23px] w-px bg-gray-500"></div>
              <div className="grow whitespace-nowrap text-white">
                Terms & Conditions
              </div>
            </div>
            <div className="text-2xl text-white mt-8 text-center tracking-wider">
              ©{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "Africa/Lagos",
              })}{" "}
              Ilearnova
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
