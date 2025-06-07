import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import SideMenu from "../components/SideMenu";
import DashboardHeader from "../components/DashboardHeader";


const feeTypes = [
    {
        title: "Tuition Fee",
        price: 100,
        desc: "Empower your child’s learning journey for just $300 per session – quality education, personalized attention, and a brighter future.",
    },
    {
        title: "Activity Fee",
        price: 50,
        desc: "Unlock a world of exploration and growth – our activity fees cover enriching experiences beyond the classroom.",
    },
    {
        title: "Book & Materials",
        price: 100,
        desc: "Everything your child needs to learn and excel – comprehensive books and materials designed for success.",
    },
    {
        title: "Uniform & Sport Dress",
        price: 80,
        desc: "Promoting unity and pride – our uniform ensures students shine with confidence and belonging.",
    },
    {
        title: "Technology Fee",
        price: 80,
        desc: "Empowering modern learning – our technology fee brings cutting-edge tools and resources to every student.",
    },
    {
        title: "Admission Fee",
        price: 60,
        desc: "Empowering modern learning – our technology fee brings cutting-edge tools and resources to every student.",
    },
];

const terms = ["Term 1", "Term 2", "Term 3"];
const statuses = ["Paid", "Failed", "Pending"];

const dummyPayments = [
    {
        date: "11/18/2024",
        id: "RN-1027489K",
        description: "Activity Fee",
        amount: 50,
        method: "Credit Card",
        status: "Paid",
        term: "Term 1",
    },
    {
        date: "11/18/2024",
        id: "RN-1027489K",
        description: "Activity Fee",
        amount: 50,
        method: "Credit Card",
        status: "Failed",
        term: "Term 1",
    },
    {
        date: "10/10/2024",
        id: "RN-1027489L",
        description: "Tuition Fee",
        amount: 100,
        method: "Bank Transfer",
        status: "Paid",
        term: "Term 2",
    },
    {
        date: "09/05/2024",
        id: "RN-1027489M",
        description: "Book & Materials",
        amount: 100,
        method: "Credit Card",
        status: "Paid",
        term: "Term 3",
    },
    {
        date: "20/02/2025",
        id: "RN-10274349M",
        description: "Book & Materials",
        amount: 100,
        method: "Bank Transfer",
        status: "Pending",
        term: "Term 1",
    },
];

function ParentPayment() {

 const [selectedTerm, setSelectedTerm] = useState("Term 1");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const navigate = useNavigate(); // Add this line
     const filteredPayments = dummyPayments.filter(
        (p) =>
            (selectedTerm === "All" || p.term === selectedTerm) &&
            (selectedStatus === "All" || p.status === selectedStatus)
    );

       // Handler for Pay Now button
    const handlePayNow = (fee) => {
        // Navigate to payment-process and pass fee info via state
        navigate("/payment-process", { state: { fee } });
    };


    return (
        <div className="min-h-screen bg-[#f5f8fe] flex flex-col md:flex-row">
            {/* Sidebar */}

            <SideMenu />
            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
                {/* Header */}

                <DashboardHeader text="Parent Payment" holder="Search by Transaction ID" />

                {/* Fee Cards */}
                  <div className="mt-30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {feeTypes.map((fee) => (
                        <div key={fee.title} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-bold text-lg text-black">{fee.title}</div>
                                    <button
                                        className="bg-[#1736a4] md:cursor-pointer text-white px-4 py-1 rounded-md text-sm font-normal hover:bg-blue-900 transition"
                                        onClick={() => handlePayNow(fee)}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                                <div className="text-3xl font-bold text-[#1736a4] mb-1">${fee.price}<span className="text-base font-normal text-gray-500">/ session</span></div>
                                <div className="text-gray-600 text-sm">{fee.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Table Controls */}
                <div className="mt-15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                    <div className="font-semibold text-gray-700">Fees Payment Details</div>
                    <div className="flex gap-2">
                        <select
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            className="border border-gray-300 focus:outline-none rounded px-3 py-1 text-sm"
                        >
                            <option value="All">All Terms</option>
                            {terms.map((term) => (
                                <option key={term} value={term}>{term}</option>
                            ))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="border border-gray-300 focus:outline-none rounded px-3 py-1 text-sm"
                        >
                            <option value="All">All Status</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button className="border lg:cursor-pointer border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6h18M4 14h16M4 18h16" />
                            </svg>
                            Filter
                        </button>
                    </div>
                </div>

                {/* Payment Table */}
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600">
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Transaction ID</th>
                                <th className="py-3 px-4 text-left">Description</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left">Payment Method</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-gray-400">No records found.</td>
                                </tr>
                            )}
                            {filteredPayments.map((row, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="py-3 px-4">{row.date}</td>
                                    <td className="py-3 px-4">{row.id}</td>
                                    <td className="py-3 px-4">{row.description}</td>
                                    <td className="py-3 px-4">${row.amount}</td>
                                    <td className="py-3 px-4">{row.method}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === "Paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {row.status === "Paid" ? (
                                            <button className="bg-green-500 text-white px-3 py-3 rounded-md text-xs font-semibold hover:bg-green-600 transition lg:cursor-pointer md:cursor-pointer">
                                                Download Receipt
                                            </button>
                                        ) : (
                                            <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-xs font-semibold cursor-not-allowed">
                                                No action
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default ParentPayment;