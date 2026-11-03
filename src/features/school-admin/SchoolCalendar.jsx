import React, { useState } from "react";
import { Plus, X, Loader2, Trash2, Clock, MapPin } from "lucide-react";
import useCalendarEvents from "@/hooks/useCalendarEvents";
import NotificationBar from "@/components/ui/NotificationBar";

const SchoolCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("days"); // 'days', 'months', 'years'
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  const {
    loading,
    error,
    eventsByDate,
    mutating,
    createEvent,
    deleteEvent,
    notification
  } = useCalendarEvents();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const toDateKey = (date) => date.toISOString().slice(0, 10);
  const selectedDateKey = toDateKey(currentDate);
  const selectedDateEvents = eventsByDate[selectedDateKey] || [];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    const remainingSlots = 42 - days.length;
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
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => date.toDateString() === currentDate.toDateString();

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      location: "",
    });
  };

  const openAddModal = () => {
    setFormData((prev) => ({ ...prev, start_time: selectedDateKey }));
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setShowModal(false);
      resetForm();
    } catch (err) {
      // Notification already surfaced by the hook; keep modal open.
    }
  };

  const handleDeleteEvent = async (event) => {
    const label = event.title || event.name || "this event";
    if (!window.confirm(`Remove "${label}" from the calendar?`)) return;
    try {
      await deleteEvent(event.id);
    } catch (err) {
      // Notification already surfaced by the hook
    }
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
                <th key={day} className="h-8 text-center text-xs font-medium text-gray-600">
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
                  .map((dayObj, dayIndex) => {
                    const hasEvents = !!eventsByDate[toDateKey(dayObj.date)]?.length;
                    return (
                      <td
                        key={`${weekIndex}-${dayIndex}`}
                        className={`
                        h-8 text-center text-sm cursor-pointer hover:bg-gray-100 relative
                        ${!dayObj.isCurrentMonth ? "text-gray-400" : "text-gray-800"}
                        ${isSelected(dayObj.date) && !isToday(dayObj.date) ? "bg-indigo-50" : ""}
                        ${isToday(dayObj.date) ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                        ${isWeekend(dayObj.date) && dayObj.isCurrentMonth ? "text-blue-600" : ""}
                      `}
                        onClick={() => setCurrentDate(dayObj.date)}
                      >
                        {dayObj.day}
                        {hasEvents && (
                          <span
                            className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                              isToday(dayObj.date) ? "bg-white" : "bg-[#FB7D5B]"
                            }`}
                          />
                        )}
                      </td>
                    );
                  })}
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
                      ${index === currentDate.getMonth() ? "bg-blue-500 text-white rounded-full" : "text-gray-800"}
                    `}
                    onClick={() => {
                      setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
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
                onClick={() => setCurrentDate(new Date(currentYear - 12, currentDate.getMonth(), 1))}
              >
                <i className="fa fa-chevron-left text-xs"></i>
              </th>
              <th
                className="h-8 text-center cursor-pointer hover:bg-gray-100 font-medium text-sm"
                colSpan="5"
              >
                {startYear}-{startYear + 11}
              </th>
              <th
                className="w-8 h-8 text-center cursor-pointer hover:bg-gray-100 text-gray-600"
                onClick={() => setCurrentDate(new Date(currentYear + 12, currentDate.getMonth(), 1))}
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
                        ${year === currentYear ? "bg-blue-500 text-white" : "text-gray-800"}
                      `}
                      onClick={() => {
                        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
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

  return (
    <div className="max-w-sm mx-auto ">
      {notification.show && (
        <NotificationBar
          message={notification.message}
          type={notification.type}
          onClose={notification.hide}
        />
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-[1rem]">
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-[#303972] mb-0">
            School Calendar
          </h2>
          <button
            onClick={openAddModal}
            className="p-1.5 bg-[#4D44B5] text-white rounded-lg hover:bg-[#3D34A5]"
            title="Add event"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-7">
          {view === "days" && renderDaysView()}
          {view === "months" && renderMonthsView()}
          {view === "years" && renderYearsView()}
        </div>

        {/* Events for the selected day */}
        <div className="mt-4 border-t pt-3">
          <h3 className="text-sm font-semibold text-[#303972] mb-2">
            Events on {selectedDateKey}
          </h3>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading events...
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">Failed to load events.</p>
          ) : selectedDateEvents.length === 0 ? (
            <p className="text-sm text-gray-400">No events scheduled.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedDateEvents.map((event, index) => (
                <div
                  key={event.id || index}
                  className="border-l-4 border-[#4D44B5] rounded-r-lg bg-gray-50 p-2 flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#303972]">
                      {event.title || event.name}
                    </p>
                    {(event.start_time || event.location) && (
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {event.start_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.start_time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event)}
                    className="p-1 text-gray-400 hover:text-red-500"
                    title="Remove event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
       <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h- overflow-y-auto">
          <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-lg font-bold text-gray-800">Add Event</h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                <input
                  type="date"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                <input
                  type="date"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutating}
                className="px-4 py-2 bg-[#4D44B5] text-white rounded-lg hover:bg-[#3D34A5] disabled:opacity-50 flex items-center gap-2"
              >
                {mutating && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default SchoolCalendar;
