import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Award,

  ChevronRight,
  Heart,
} from "lucide-react";
import { FaFacebook, FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa6";


export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [year, setYear] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setYear(new Date().getFullYear()), 1000
    });

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const quickLinks = [
    { name: "About Us", href: "#" },
    { name: "Academics", href: "#" },
    { name: "Admissions", href: "#" },
    { name: "Student Life", href: "#" },
    { name: "Faculty", href: "#" },
    { name: "News & Events", href: "#" },
  ];

  const departments = [
    { name: "Elementary School", href: "#" },
    { name: "Middle School", href: "#" },
    { name: "High School", href: "#" },
    { name: "Special Programs", href: "#" },
    { name: "Athletics", href: "#" },
    { name: "Arts & Music", href: "#" },
  ];

  const headSocialLinks = [
    { icon: FaFacebook, href: "https://www.facebook.com/ilearnova", color: "hover:text-blue-400" },
    { icon: FaXTwitter, href: "https://www.x.com/iilearnova", color: "hover:text-sky-400" },
    { icon: FaInstagram, href: "https://www.instagram.com/ilearnova", color: "hover:text-pink-400" },
    { icon: FaYoutube, href: "https://www.youtube.com/@ilearnova", color: "hover:text-red-400" },
  ];
  const footSocialLinks = [
    { icon: FaLinkedin, href: "https://www.linkedin.com/company/dimatech-it-consultancy-and-general-services/", color: "hover:text-red-400" },
    { icon: FaXTwitter, href: "https://www.x.com/Dimatech2023", color: "hover:text-sky-400" },
    { icon: FaInstagram, href: "https://www.instagram.com/Dimatech2023", color: "hover:text-pink-400" },
    { icon: FaYoutube, href: "https://www.youtube.com/@DIMATECHIT", color: "hover:text-red-400" },
  ];

  return (
    <div className="min-h-screen   flex flex-col justify-end w-full ">
      <footer className="relative  text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"></div>
          <div className="absolute top-4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-500/10 rounded-full blur-lg animate-ping"></div>
        </div>

        <div
          className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* School Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ilearnova
                  </h3>
                  <p className="text-sm text-gray-300">
                    Inspiring Future Leaders
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                Nurturing young minds with excellence in education, character
                development, and innovation since 1985.
              </p>
              {/* Social Links */}
              <div className="pt-2">
                <div className="flex space-x-4">
                  {headSocialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`p-2 bg-white/10 rounded-lg ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:-translate-y-1`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-purple-400 group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <div className="text-lg font-bold text-white">2,500+</div>
                  <div className="text-xs text-gray-400">Students</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-pink-400 group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <div className="text-lg font-bold text-white">150+</div>
                  <div className="text-xs text-gray-400">Faculty</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-indigo-400 group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <div className="text-lg font-bold text-white">38</div>
                  <div className="text-xs text-gray-400">Years</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-purple-400" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center group"
                    >
                      <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      <span className="group-hover:translate-x-2 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Departments */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-pink-400" />
                Departments
              </h4>
              <ul className="space-y-3">
                {departments.map((dept, index) => (
                  <li key={index}>
                    <a
                      href={dept.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center group"
                    >
                      <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      <span className="group-hover:translate-x-2 transition-transform duration-300">
                        {dept.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-indigo-400" />
                Contact Us
              </h4>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <MapPin className="h-5 w-5 text-purple-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      162,
                      <br />
                      AGBODU QUARTERS,
                      <br />
                      ITELE IJEBU
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group cursor-pointer">
                  <Phone className="h-5 w-5 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                    +2349050119078,
                    <br />
                    +2347061500944
                  </span>
                </div>

                <div className="flex items-center space-x-3 group cursor-pointer">
                  <Mail className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                    dimatechitconsultancy@gmail.com
                  </span>
                </div>
              </div>

              {/* Social Links 2 */}
              <div className="pt-4">
                <h5 className="text-sm font-medium text-white mb-3">
                  Follow Us
                </h5>
                <div className="flex space-x-4">
                  {footSocialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`p-2 bg-white/10 rounded-lg ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:-translate-y-1`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400 flex items-center">
                <span>© {year} Excellence Academy. Made with</span>
                <Heart className="h-4 w-4 mx-1 text-red-400 animate-pulse" />
                <span>for education.</span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Accessibility
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-indigo-400 rounded-full opacity-80 animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
}
