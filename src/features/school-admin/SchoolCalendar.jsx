import React, { useState } from "react";

const SchoolCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 10)); // June 10, 2025
  const [view, setView] = useState("days"); // 'days', 'months', 'years', 'decades'
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    hour: "01",
    minute: "23",
    period: "PM",
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    // Next month's leading days
    const remainingSlots = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingSlots; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date(2025, 5, 10); // June 10, 2025
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const navigateMonth = (direction) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1)
    );
  };

  const navigateYear = (direction) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear() + direction, prev.getMonth(), 1)
    );
  };

  const renderDaysView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div>
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th
                className="w-8 h-8 text-center cursor-pointer hover:bg-gray-100 text-gray-600"
                onClick={() => navigateMonth(-1)}
              >
                <i className="fa fa-chevron-left text-xs"></i>
              </th>
              <th
                className="h-8 text-center cursor-pointer hover:bg-gray-100 font-medium text-sm"
                colSpan="5"
                onClick={() => setView("months")}
              >
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </th>
              <th
                className="w-8 h-8 text-center cursor-pointer hover:bg-gray-100 text-gray-600"
                onClick={() => navigateMonth(1)}
              >
                <i className="fa fa-chevron-right text-xs"></i>
              </th>
            </tr>
            <tr>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="h-8 text-center text-xs font-medium text-gray-600"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <tr key={weekIndex}>
                {days
                  .slice(weekIndex * 7, (weekIndex + 1) * 7)
                  .map((dayObj, dayIndex) => (
                    <td
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                      h-8 text-center text-sm cursor-pointer hover:bg-gray-100
                      ${
                        !dayObj.isCurrentMonth
                          ? "text-gray-400"
                          : "text-gray-800"
                      }
                      ${
                        isToday(dayObj.date)
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : ""
                      }
                      ${
                        isWeekend(dayObj.date) && dayObj.isCurrentMonth
                          ? "text-blue-600"
                          : ""
                      }
                    `}
                      onClick={() => setCurrentDate(dayObj.date)}
                    >
                      {dayObj.day}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMonthsView = () => (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th
              className="w-8 h-8 text-center cursor-pointer hover:bg-gray-100 text-gray-600"
              onClick={() => navigateYear(-1)}
            >
              <i className="fa fa-chevron-left text-xs"></i>
            </th>
            <th
              className="h-8 text-center cursor-pointer hover:bg-gray-100 font-medium text-sm"
              colSpan="5"
              onClick={() => setView("years")}
            >
              {currentDate.getFullYear()}
            </th>
            <th
              className="w-8 h-8 text-center cursor-pointer hover:bg-gray-100 text-gray-600"
              onClick={() => navigateYear(1)}
            >
              <i className="fa fa-chevron-right text-xs"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" className="p-2">
              <div className="grid grid-cols-4 gap-1">
                {months.map((month, index) => (
                  <span
                    key={month}
                    className={`
                      text-center py-2 px-1 text-sm cursor-pointer hover:bg-gray-100 rounded
                      ${
                        index === currentDate.getMonth()
                          ? "bg-blue-500 text-white rounded-full"
                          : "text-gray-800"
                      }
                    `}
                    onClick={() => {
                      setCurrentDate(
                        new Date(currentDate.getFullYear(), index, 1)
                      );
                      setView("days");
                    }}
                  >
                    {month}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderYearsView = () => {
    const currentYear = currentDate.getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div>
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="w-8 h-8 text-center cursor-pointer hover:bg-gray-100 text-gray-600"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentYear - 12, currentDate.getMonth(), 1)
                  )
                }
              >
                <i className="fa fa-chevron-left text-xs"></i>
              </th>
              <th
                className="h-8 text-center cursor-pointer hover:bg-gray-100 font-medium text-sm"
                colSpan="5"
                onClick={() => setView("decades")}
              >
                {startYear}-{startYear + 11}
              </th>
              <th
                className="w-8 h-8 text-center cursor-pointer hover:bg-gray-100 text-gray-600"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentYear + 12, currentDate.getMonth(), 1)
                  )
                }
              >
                <i className="fa fa-chevron-right text-xs"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="p-2">
                <div className="grid grid-cols-4 gap-1">
                  {years.map((year) => (
                    <span
                      key={year}
                      className={`
                        text-center py-2 px-1 text-sm cursor-pointer hover:bg-gray-100 rounded
                        ${
                          year === currentYear
                            ? "bg-blue-500 text-white"
                            : "text-gray-800"
                        }
                      `}
                      onClick={() => {
                        setCurrentDate(
                          new Date(year, currentDate.getMonth(), 1)
                        );
                        setView("months");
                      }}
                    >
                      {year}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // const renderTimePicker = () => (
  //   <div className="p-4">
  //     <table className="w-full text-center">
  //       <tbody>
  //         <tr>
  //           <td>
  //             <button className="w-8 h-8 hover:bg-gray-100 rounded">
  //               <i className="fa fa-chevron-up text-xs"></i>
  //             </button>
  //           </td>
  //           <td></td>
  //           <td>
  //             <button className="w-8 h-8 hover:bg-gray-100 rounded">
  //               <i className="fa fa-chevron-up text-xs"></i>
  //             </button>
  //           </td>
  //           <td></td>
  //         </tr>
  //         <tr>
  //           <td className="text-lg font-medium py-2">{selectedTime.hour}</td>
  //           <td className="text-lg">:</td>
  //           <td className="text-lg font-medium py-2">{selectedTime.minute}</td>
  //           <td>
  //             <button className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
  //               {selectedTime.period}
  //             </button>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>
  //             <button className="w-8 h-8 hover:bg-gray-100 rounded">
  //               <i className="fa fa-chevron-down text-xs"></i>
  //             </button>
  //           </td>
  //           <td></td>
  //           <td>
  //             <button className="w-8 h-8 hover:bg-gray-100 rounded">
  //               <i className="fa fa-chevron-down text-xs"></i>
  //             </button>
  //           </td>
  //           <td></td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>
  // );

  return (
    <div className="max-w-sm mx-auto ">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[500px] max-h-[600px] p-[1rem]">
        <div className="px-4 py-3 ">
          <h2 className="text-[20px] text-center font-semibold text-[#303972] mb-0">
            School Calendar
          </h2>
        </div>

        <div className="mt-7">
          {!showTimePicker && view === "days" && renderDaysView()}
          {!showTimePicker && view === "months" && renderMonthsView()}
          {!showTimePicker && view === "years" && renderYearsView()}

          {/* <div className="  px-4 py-2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm "
                      onClick={() => setShowTimePicker(!showTimePicker)}
                    >
                      <i className="fa-solid fa-clock mr-1"></i>
                      Select Time
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {showTimePicker && (
            <div className="border-t">{renderTimePicker()}</div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SchoolCalendar;
