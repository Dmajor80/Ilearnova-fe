// import logo from "/logo.png";
import teacherIllustration from "/mother.png";
import { Link } from "react-router-dom"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const DEFAULT_EMAIL = "priscilladaniel@gmail.com";
const DEFAULT_PASSWORD = "123456";


const authenticateUser = async (email, password) => {
  // Example: Replace with your actual authentication logic
  // Simulate a database check
  return email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD;
};

function ParentLogin() {
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate(); // Initialize navigate


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAuthenticated = await authenticateUser(email, password);
    if (isAuthenticated) {
      setError("");
      navigate("/parent-dashboard"); // Redirect to dashboard
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-8 py-12">
        <img src="/logo.png" alt="Ilearnova Logo" className="mb-6 w-32" />
        <h2 className="text-2xl font-semibold mb-1">Login to <span className="text-blue-700">Parent Portal</span></h2>
        <p className="mb-6 text-gray-500">Enter account details</p>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Enter email address</label>
            <input
              type="email"
              className="w-full mb-4 px-4 py-2 border rounded bg-gray-100"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Enter Password</label>

            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mb-2 px-4 py-2 border rounded bg-gray-100"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[20px] transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>

          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="mr-2"
              />
              Remember password
            </label>
            <a href="#" className="text-xs text-red-500 hover:underline">Forgotten Password?</a>
          </div>
          {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gray-400 text-white py-2 rounded font-semibold mb-2"
          >
            Login
          </button>
          <div className="text-center text-sm">
            Don&apos;t have an account? <a href="#" className="text-blue-700 hover:underline">Sign in</a>
          </div>
        </form>

        <div className="flex items-center gap-[1rem] justify-center mt-10">
          <Link to="/login">                 <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
            Teacher
          </button>
          </Link>
          <Link to="/student-login">
            <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
              Student
            </button>
          </Link>
          <Link to="/parent-login">
            <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
              Parent
            </button>
          </Link>
          <Link to="/Admin-login">
            <button className="w-[80px] h-[30px] bg-[green] text-[12px] text-[white] hover:bg-[#253325] cursor-pointer">
              Admin
            </button>
          </Link>
        </div>
        {/* switch button */}
      </div>
      <div className="hidden md:block md:w-1/2 h-screen">
        <img
          src={teacherIllustration}
          alt="Parent and child"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default ParentLogin;