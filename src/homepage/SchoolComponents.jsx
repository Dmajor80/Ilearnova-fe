import React, { useState, useEffect } from "react";
import {
  Star,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Play,
  Pause,
} from "lucide-react";
import { Link } from "react-router-dom";
import EducationLanding from "./EducationLanding";
// Features Section Component
const FeaturesSection = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(
              (prev) => new Set([...prev, entry.target.dataset.index])
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".feature-card").forEach((card, index) => {
      card.dataset.index = index;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Advanced Learning",
      description:
        "Cutting-edge curriculum designed to challenge and inspire students at every level.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Faculty",
      description:
        "Highly qualified teachers committed to nurturing each student's potential.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence Awards",
      description:
        "Recognition programs that celebrate academic and personal achievements.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Facilities",
      description:
        "State-of-the-art infrastructure supporting modern educational needs.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-pulse">
            Why Choose Our School?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                visibleCards.has(index.toString())
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 w-fit mb-6 transform hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Programs Section Component
const ProgramsSection = () => {
  const [activeProgram, setActiveProgram] = useState(0);

  const programs = [
    {
      title: "Elementary Program",
      age: "Ages 5-10",
      description:
        "Building strong foundations in literacy, numeracy, and social skills through play-based learning.",
      features: [
        "Interactive Learning",
        "Creative Arts",
        "Physical Education",
        "Character Development",
      ],
      color: "from-green-400 to-blue-500",
    },
    {
      title: "Middle School",
      age: "Ages 11-14",
      description:
        "Developing critical thinking and independence through comprehensive academic programs.",
      features: [
        "STEM Focus",
        "Language Arts",
        "Social Studies",
        "Leadership Training",
      ],
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "High School",
      age: "Ages 15-18",
      description:
        "Preparing students for college and career success with advanced coursework and guidance.",
      features: [
        "AP Courses",
        "College Prep",
        "Career Counseling",
        "Research Projects",
      ],
      color: "from-orange-400 to-red-500",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Academic Programs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive educational pathways designed to nurture growth at
            every stage
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            {programs.map((program, index) => (
              <button
                key={index}
                onClick={() => setActiveProgram(index)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeProgram === index
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {program.title}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div
              className={`bg-gradient-to-r ${programs[activeProgram].color} text-white rounded-2xl p-8 mb-8 transform transition-all duration-500`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-2">
                    {programs[activeProgram].title}
                  </h3>
                  <p className="text-lg opacity-90">
                    {programs[activeProgram].age}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link to="/student-login">
                    <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium text-[black]">
                      Get Started
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {programs[activeProgram].description}
                </p>
                <div className="space-y-3">
                  {programs[activeProgram].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    Interactive Learning Environment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats Counter Component
const StatsSection = () => {
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    years: 0,
    rate: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const finalCounts = { students: 1200, teachers: 85, years: 25, rate: 98 };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        students: Math.floor(finalCounts.students * progress),
        teachers: Math.floor(finalCounts.teachers * progress),
        years: Math.floor(finalCounts.years * progress),
        rate: Math.floor(finalCounts.rate * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(finalCounts);
      }
    }, interval);
  };

  return (
    <section
      id="stats-section"
      className="py-20 bg-gradient-to-r from-blue-600 to-purple-700"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center text-white transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {counts.students}+
            </div>
            <div className="text-lg opacity-90">Active Students</div>
          </div>
          <div className="text-center text-white transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
              {counts.teachers}+
            </div>
            <div className="text-lg opacity-90">Expert Teachers</div>
          </div>
          <div className="text-center text-white transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              {counts.years}
            </div>
            <div className="text-lg opacity-90">Years of Excellence</div>
          </div>
          <div className="text-center text-white transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-300 to-yellow-300 bg-clip-text text-transparent">
              {counts.rate}%
            </div>
            <div className="text-lg opacity-90">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Events Component
// const EventsSection = () => {
//   const [currentEvent, setCurrentEvent] = useState(0);


//   const events = [
//     {
//       title: "Science Fair 2024",
//       date: "March 15, 2024",
//       time: "9:00 AM - 3:00 PM",
//       location: "Main Auditorium",
//       description:
//         "Students showcase innovative science projects and experiments.",
//       category: "Academic",
//     },
//     {
//       title: "Spring Sports Day",
//       date: "April 20, 2024",
//       time: "8:00 AM - 5:00 PM",
//       location: "Sports Complex",
//       description:
//         "Annual athletics competition featuring various sports activities.",
//       category: "Sports",
//     },
//     {
//       title: "Arts & Culture Festival",
//       date: "May 10, 2024",
//       time: "6:00 PM - 9:00 PM",
//       location: "Cultural Center",
//       description:
//         "Celebration of student creativity through music, dance, and visual arts.",
//       category: "Cultural",
//     },
//   ];

//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-gray-800 mb-4">
//             Upcoming Events
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Join us for exciting events that bring our school community together
//           </p>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
//             <div className="grid lg:grid-cols-3">
//               <div className="lg:col-span-1 bg-gradient-to-br from-blue-500 to-purple-600 p-8">
//                 <div className="space-y-4">
//                   {events.map((event, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentEvent(index)}
//                       className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
//                         currentEvent === index
//                           ? "bg-white text-gray-800 shadow-lg transform scale-105"
//                           : "text-white hover:bg-white hover:bg-opacity-20"
//                       }`}
//                     >
//                       <div className="font-semibold text-sm mb-1">
//                         {event.category}
//                       </div>
//                       <div className="font-bold">{event.title}</div>
//                       <div className="text-sm opacity-75">{event.date}</div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="lg:col-span-2 p-8">
//                 <div className="space-y-6">
//                   <div>
//                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                       {events[currentEvent].category}
//                     </span>
//                     <h3 className="text-3xl font-bold text-gray-800 mt-4 mb-4">
//                       {events[currentEvent].title}
//                     </h3>
//                     <p className="text-gray-600 text-lg leading-relaxed">
//                       {events[currentEvent].description}
//                     </p>
//                   </div>

//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
//                       <Calendar className="w-5 h-5 text-blue-500" />
//                       <div>
//                         <div className="text-sm text-gray-500">Date</div>
//                         <div className="font-semibold text-gray-800">
//                           {events[currentEvent].date}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
//                       <Clock className="w-5 h-5 text-blue-500" />
//                       <div>
//                         <div className="text-sm text-gray-500">Time</div>
//                         <div className="font-semibold text-gray-800">
//                           {events[currentEvent].time}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
//                       <MapPin className="w-5 h-5 text-blue-500" />
//                       <div>
//                         <div className="text-sm text-gray-500">Location</div>
//                         <div className="font-semibold text-gray-800">
//                           {events[currentEvent].location}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
//                     <span>Register Now</span>
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// Testimonials Component
const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent",
      content:
        "The dedication of the teachers and the quality of education at this school is exceptional. My daughter has thrived academically and personally.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Alumni",
      content:
        "The skills and values I learned here prepared me perfectly for university and my career. The supportive environment made all the difference.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Dr. Emily Williams",
      role: "Education Consultant",
      content:
        "This institution sets the standard for modern education. Their innovative approach and caring faculty create an ideal learning environment.",
      rating: 5,
      avatar: "EW",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What People Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our community about their experience with our school
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

            <div className="text-center mb-8">
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  )
                )}
              </div>

              <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800 text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
const SchoolComponents = () => {
  return (
    <div className="min-h-screen bg-white w-full mt-2.5">
      <FeaturesSection />
      <ProgramsSection />
      <StatsSection />
      {/* <EventsSection /> */}
      <TestimonialsSection />
    </div>
  );
};

export default SchoolComponents;
