import React from 'react'

function DashboardHeader(props) {
    return (
        <>

            <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#f5f8fe]">
                <div>
                    <p className="text-xs text-gray-500">Parent</p>
                    <h1 className="text-lg font-semibold text-gray-800">{props.text}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={props.holder}
                            className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-36 md:w-56"
                            aria-label="Search"
                        />
                        <svg
                            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <img
                        // /api/placeholder/32/32
                        src="/profile.png"
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                </div>
            </header>

              {/* Welcome & Banner */}
                    <section className="relative flex flex-col items-center mt-2 mb-8 px-2 md:px-0">
                      <div className="flex w-full justify-between items-center mb-2">
                        <div>
                          <p className="text-lg text-gray-600">Welcome,</p>
                          <h2 className="text-2xl font-semibold text-[#1a237e]">Mrs Daniel</h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Notification</span>
                          <span className="relative">
                            <svg
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                              />
                            </svg>
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                          </span>
                        </div>
                      </div>
                      {/* Banner */}
                      <div className="relative w-full rounded-lg overflow-hidden h-28 md:h-32 flex items-center justify-center bg-[#1736a4]">
                        <div className="absolute left-0 top-0 w-32 h-28 bg-[#ffd600] rounded-br-full"></div>
                        <div className="absolute left-0 bottom-0 w-20 h-16 bg-[#2ecc71] rounded-tr-full"></div>
                        <div className="absolute right-0 top-0 w-24 h-24 bg-[#ffd600] rounded-bl-full"></div>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white rounded-tl-full"></div>
                        <div className="w-full h-full bg-[#1736a4]"></div>
                      </div>
                      {/* Profile */}
                      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <img
                          // /api/placeholder/100/100
                          src="/profile.png"
                          alt="Profile"
                          className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                        <div className="mt-2 text-center">
                          <div className="font-semibold text-[#1736a4]">Priscilla Daniel</div>
                          <div className="text-xs text-gray-500">Ilearnova/Stu/001</div>
                          <div className="text-xs text-gray-500">Grade 6</div>
                        </div>
                      </div>
                    </section>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>

                    </div>
        </>
    )
}

export default DashboardHeader