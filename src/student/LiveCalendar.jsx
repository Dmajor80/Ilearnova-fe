import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function LiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Events for demonstration
  const events = [
    { date: new Date(2025, 4, 22) }, // May 22, 2025
    { date: new Date(2025, 4, 25) }, // May 25, 2025
    { date: new Date(2025, 4, 15) }, // May 15, 2025
    { date: new Date(2025, 4, 5) }, // May 5, 2025
  ];

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0-6)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Format date as Month YYYY
  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Check if a date has an event
  const hasEvent = (date) => {
    return events.some(
      (event) =>
        event.date.getDate() === date &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (date) => {
    return (
      date === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const firstDayOfMonth = getFirstDayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );

    // Previous month days
    const prevMonthDays = [];
    if (firstDayOfMonth > 0) {
      const prevMonth =
        currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
      const prevMonthYear =
        currentDate.getMonth() === 0
          ? currentDate.getFullYear() - 1
          : currentDate.getFullYear();
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

      for (let i = 0; i < firstDayOfMonth; i++) {
        prevMonthDays.push(
          <div
            key={`prev-${i}`}
            className="h-8 w-8 flex items-center justify-center text-gray-300"
          >
            {daysInPrevMonth - firstDayOfMonth + i + 1}
          </div>
        );
      }
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayHasEvent = hasEvent(i);
      const dayIsToday = isToday(i);
      const dayIsSelected = isSelected(i);

      currentMonthDays.push(
        <div
          key={`current-${i}`}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm relative cursor-pointer
            ${dayIsToday && !dayIsSelected ? "bg-blue-600 text-white" : ""}
            ${dayIsSelected && !dayIsToday ? "bg-blue-100 text-blue-600" : ""}
            ${!dayIsToday && !dayIsSelected ? "hover:bg-gray-100" : ""}
          `}
          onClick={() => {
            setSelectedDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
            );
          }}
        >
          {i}
          {dayHasEvent && (
            <div
              className={`h-1 w-1 rounded-full absolute -bottom-1
                ${dayIsToday ? "bg-white" : "bg-blue-600"}`}
            ></div>
          )}
        </div>
      );
    }

    // Next month days
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const nextDaysNeeded = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

    for (let i = 1; i <= nextDaysNeeded; i++) {
      nextMonthDays.push(
        <div
          key={`next-${i}`}
          className="h-8 w-8 flex items-center justify-center text-gray-300"
        >
          {i}
        </div>
      );
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4 max-w-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">
          {formatMonthYear(currentDate)}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <Calendar size={16} className="text-gray-600" />
          <button
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {renderCalendar()}
      </div>
    </div>
  );
}
