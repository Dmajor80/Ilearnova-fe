import { Link } from "react-router-dom";
import { useState } from "react"
import { useNavigate } from "react-router-dom";


function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    // const handleSubmission = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch("https://api.ilearnova.com/api/auth/register/", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email, password }),
    //         });
    //         const data = await response.json();
    //         if (response.ok && data.success) {
    //             // Optionally store token/user info
    //             // localStorage.setItem("token", data.token);
    //             // localStorage.setItem("adminName", data.user.name);
    //             navigate("/login");
    //         } else {
    //             alert(data.message || "Invalid email or password.");
    //             console.log('clicked')
    //         }
    //     } catch (error) {
    //         alert("Network error. Please try again.");
    //         console.log('click........')
    //     }
    // };

    const handleSubmission = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://api.ilearnova.com/api/auth/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, firstName, lastName, birthDate, address, phone,  email, password }),
            });
            const data = await response.json();
            // if (response.ok && data.success) { ... }
            console.log(data)
            if (response.ok && data.status === "success") {
                // Optionally store token/user info
                // localStorage.setItem("token", data.token);
                // localStorage.setItem("adminName", data.user.name);
                navigate("/login");
            } else {
                alert(data.message || "Account creation failed.");
            }
        } catch (error) {
            alert("Network error. Please try again.");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full relative">
                {/* Decorative Circle */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-30" />

                {/* Header */}
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">School Signup</h1>
                <p className="text-center text-gray-500 mb-6">Join our academic community today</p>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmission}>
                    {/* FirstName */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            type="text"
                            placeholder="John Doe"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    {/* LastName */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            value={lastName}
                            type="text"
                            onChange={e => setLastName(e.target.value)}
                            placeholder="John Doe"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    {/* username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Name</label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            type="text"
                            placeholder="John Doe"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="example@school.edu"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    {/* DOB */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            type="date"
                            placeholder="example@school.edu"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    {/* address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            type="text"
                            placeholder="example@school.edu"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    {/* phone number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            type="text"
                            placeholder="example@school.edu"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            value={password}
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>



                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-xl disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup;