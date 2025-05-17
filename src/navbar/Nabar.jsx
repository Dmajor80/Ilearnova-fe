import React from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";

const Navbar = () => {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gold shadow-xl">
      <div className="mx-auto w-full px-2 sm:px-10 lg:px-20">
        <div className="relative flex h-16 items-center justify-between sm:h-20">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              type="button"
              aria-expanded="false"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="block h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden flex-shrink-0 items-center sm:flex">
              <img
                className="h-10 w-16"
                src="https://dimatech-lsm-frontend.vercel.app/static/media/auth.639d277feb2fe0057614.png"
                alt="Your Company"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <a
                  className="bg-blue text-white text-sm rounded-md px-3 py-2 font-medium"
                  aria-current="page"
                  href="/admin"
                >
                  Dashboard
                </a>
                <a
                  className="text-white hover:bg-powderblue hover:text-white text-sm rounded-md px-3 py-2 font-medium"
                  href="/auth/signup"
                >
                  School Signup
                </a>
                <a
                  className="text-white hover:bg-powderblue hover:text-white text-sm rounded-md px-3 py-2 font-medium"
                  href="/auth/login"
                >
                  Teachers Login
                </a>
                <a
                  className="text-white hover:bg-powderblue hover:text-white text-sm rounded-md px-3 py-2 font-medium"
                  href="https://trenova.nyc3.cdn.digitaloceanspaces.com/1app/app-release.apk"
                >
                  download App
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
              <div>
                <button
                  className="text-sm relative flex rounded-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
