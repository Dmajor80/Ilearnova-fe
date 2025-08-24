import React from "react";

const Hero = () => {
  return (
    <>
      {/* hero container */}
      <div className="">
        <div>
          <p className="sm:text-[45px] text-[20px] font-black text-white">
            WELCOME BACK TO SCHOOL 🎒📚
          </p>
          <p className="text-justify text-white mt-12 hidden sm:block">
            Summer’s adventures are a memory, and it's time to dive back into a
            world of learning and excitement. At Ilearnova, we’re thrilled to
            welcome you to a brand-new academic year filled with fresh
            opportunities, new friends, and boundless possibilities. As you step
            into the classroom, remember that each day is a chance to grow,
            discover, and achieve. Our dedicated teachers and staff are here to
            support you every step of the way. Get ready to explore new
            subjects, engage in creative projects, and make lasting memories.
            Let’s make this school year the best one yet! Embrace the
            challenges, celebrate the victories, and most importantly, enjoy the
            journey. Welcome back – let’s make this year unforgettable! 🌟
          </p>
        </div>
        <div>
          <img
            src="https://dimatech-lsm-frontend.vercel.app/group1.png"
            alt=""
          />
        </div>
      </div>
      {/* end of hero container */}
      <div className="flex justify-center mt-[2rem]">
        <div className="">
          <div className="  max-w-[400px] w-[350px] bg-[red] h-[200px] relative rounded-tl-2xl rounded-tr-2xl shadow-2xs"></div>
          <div className="bg-[yellow] w-[100px] h-[100px] rounded-full absolute mt-[-5rem] ml-[2rem]"></div>
          <div className="max-w-[400px] w-[350px] bg-[white] h-[200px] rounded-bl-2xl rounded-br-2xl"></div>
        </div>
      </div>
    </>
  );
};

export default Hero;
