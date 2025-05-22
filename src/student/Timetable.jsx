import { useState } from "react";
import { ChevronDown, X, Edit2, Trash } from "lucide-react";

export default function Timetable() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedGrade, setSelectedGrade] = useState("Grade 2");
  const [editingCell, setEditingCell] = useState(null); // {rowIndex, day}
  const [timetableData, setTimetableData] = useState([
    {
      time: "08:30 am",
      Monday: {
        subject: "Mathematics",
        teacher: "Mr. Stephen Hill",
        duration: "Duration: 45 minutes",
      },
      Tuesday: {
        subject: "Mathematics",
        teacher: "Mr. Stephen Hill",
        duration: "Duration: 45 minutes",
      },
      Wednesday: {
        subject: "Mathematics",
        teacher: "Mr. Stephen Hill",
        duration: "Duration: 45 minutes",
      },
      Thursday: {
        subject: "Mathematics",
        teacher: "Mr. Stephen Hill",
        duration: "Duration: 45 minutes",
      },
      Friday: {
        subject: "Mathematics",
        teacher: "Mr. Stephen Hill",
        duration: "Duration: 45 minutes",
      },
    },
    {
      time: "09:30 am",
      Monday: {
        subject: "Social Studies",
        teacher: "Ms. Paulette",
        duration: "Duration: 45 minutes",
      },
      Tuesday: {
        subject: "Social Studies",
        teacher: "Ms. Paulette",
        duration: "Duration: 45 minutes",
      },
      Wednesday: {
        subject: "Social Studies",
        teacher: "Ms. Paulette",
        duration: "Duration: 45 minutes",
      },
      Thursday: {
        subject: "Social Studies",
        teacher: "Ms. Paulette",
        duration: "Duration: 45 minutes",
      },
      Friday: {
        subject: "Social Studies",
        teacher: "Ms. Paulette",
        duration: "Duration: 45 minutes",
      },
    },
    {
      time: "10:30 am",
      Monday: {
        subject: "English Language",
        teacher: "Mrs. Bryant",
        duration: "Duration: 45 minutes",
      },
      Tuesday: {
        subject: "English Language",
        teacher: "Mrs. Bryant",
        duration: "Duration: 45 minutes",
      },
      Wednesday: {
        subject: "English Language",
        teacher: "Mrs. Bryant",
        duration: "Duration: 45 minutes",
      },
      Thursday: {
        subject: "English Language",
        teacher: "Mrs. Bryant",
        duration: "Duration: 45 minutes",
      },
      Friday: {
        subject: "English Language",
        teacher: "Mrs. Bryant",
        duration: "Duration: 45 minutes",
      },
    },
    {
      time: "11:30 am",
      Monday: {
        subject: "Civic Education",
        teacher: "Mr. Rogers",
        duration: "Duration: 45 minutes",
      },
      Tuesday: {
        subject: "Civic Education",
        teacher: "Mr. Rogers",
        duration: "Duration: 45 minutes",
      },
      Wednesday: {
        subject: "Civic Education",
        teacher: "Mr. Rogers",
        duration: "Duration: 45 minutes",
      },
      Thursday: {
        subject: "Civic Education",
        teacher: "Mr. Rogers",
        duration: "Duration: 45 minutes",
      },
      Friday: {
        subject: "Civic Education",
        teacher: "Mr. Rogers",
        duration: "Duration: 45 minutes",
      },
    },
    {
      time: "12:30 pm",
      Monday: {
        subject: "Economics",
        teacher: "Ms. Precious",
        duration: "Duration: 45 minutes",
      },
      Tuesday: {
        subject: "Economics",
        teacher: "Ms. Precious",
        duration: "Duration: 45 minutes",
      },
      Wednesday: {
        subject: "Economics",
        teacher: "Ms. Precious",
        duration: "Duration: 45 minutes",
      },
      Thursday: {
        subject: "Economics",
        teacher: "Ms. Precious",
        duration: "Duration: 45 minutes",
      },
      Friday: {
        subject: "Economics",
        teacher: "Ms. Precious",
        duration: "Duration: 45 minutes",
      },
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    day: "",
    subject: "",
    teacher: "",
    startTime: "",
    endTime: "",
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const subjects = [
    "Mathematics",
    "English Language",
    "Social Studies",
    "Civic Education",
    "Economics",
    "Science",
  ];
  const teachers = [
    "Mr. Stephen Hill",
    "Mrs. Bryant",
    "Ms. Paulette",
    "Mr. Rogers",
    "Ms. Precious",
  ];

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    // Validate form
    if (
      !formData.day ||
      !formData.subject ||
      !formData.teacher ||
      !formData.startTime ||
      !formData.endTime
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (modalMode === "create") {
      // Add new entry logic would go here
      // For demonstration, we'll just close the modal
      alert("New timetable entry would be created here!");
    } else if (modalMode === "edit" && editingCell) {
      // Update existing entry
      const { rowIndex, day } = editingCell;
      const updatedTimetable = [...timetableData];

      // Calculate duration
      const startTime = formData.startTime;
      const endTime = formData.endTime;
      const duration = calculateDuration(startTime, endTime);

      updatedTimetable[rowIndex][day] = {
        subject: formData.subject,
        teacher: formData.teacher,
        duration: duration,
      };

      setTimetableData(updatedTimetable);
      setEditingCell(null);
    }

    setShowModal(false);

    // Reset form
    setFormData({
      day: "",
      subject: "",
      teacher: "",
      startTime: "",
      endTime: "",
    });
  };

  const calculateDuration = (start, end) => {
    // Simple function to calculate duration - in real app would be more sophisticated
    return "45 minutes";
  };

  const handleEdit = (rowIndex, day) => {
    const cellData = timetableData[rowIndex][day];
    const rowTime = timetableData[rowIndex].time;

    // Extract time values (this is simplified)
    const startTime = rowTime.replace(" am", "").replace(" pm", "");
    const endTimeValue = calculateEndTime(startTime);

    setFormData({
      day: day,
      subject: cellData.subject,
      teacher: cellData.teacher,
      startTime: startTime,
      endTime: endTimeValue,
    });

    setEditingCell({ rowIndex, day });
    setModalMode("edit");
    setShowModal(true);
  };

  const calculateEndTime = (startTime) => {
    // In a real app, this would actually calculate the end time based on duration
    const timeMap = {
      "08:30": "09:15",
      "09:30": "10:15",
      "10:30": "11:15",
      "11:30": "12:15",
      "12:30": "13:15",
    };
    return timeMap[startTime] || "09:15";
  };

  const handleDelete = (rowIndex, day) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const updatedTimetable = [...timetableData];

      // Instead of removing the entry completely, we'll clear its content
      updatedTimetable[rowIndex][day] = {
        subject: "Free Period",
        teacher: "N/A",
        duration: "Duration: 45 minutes",
      };

      setTimetableData(updatedTimetable);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingCell(null);
    setFormData({
      day: "",
      subject: "",
      teacher: "",
      startTime: "",
      endTime: "",
    });
    setShowModal(true);
  };

  return (
    <div
      className=" min-h-screen p-4 "
      style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
    >
      <p className="text-[25px] font-semibold mb-[3rem]">Timetable</p>
      {/* Grade Selection */}
      <div className="mb-6 flex justify-between items-center">
        <button className="px-4 py-2 border rounded-md bg-white text-[20px] w-[179px] h-[65px]">
          {selectedGrade}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={openCreateModal}
        >
          Create Timetable
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Days header */}
          <div className="flex mb-2 w-fit">
            <div className="w-20"></div> {/* Empty cell for time column */}
            {days.map((day) => (
              <div
                key={day}
                className="w-[148px] h-[42px] p-3  border rounded-md mx-1  text-center text-[14px] ml-[0.9rem]"
                style={{
                  border: "1px solid rgba(174, 174, 174, 1)",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  color: "rgba(51, 51, 51, 1)",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Timetable rows */}
          {timetableData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-2 ">
              <div
                className="  w-[104px] p-2 flex items-center justify-center border-1 text-[14px] font-semibold"
                style={{
                  border: " 1px solid rgba(174, 174, 174, 1) ",
                  color: "rgba(51, 51, 51, 1)",
                }}
              >
                {row.time}
              </div>

              {days.map((day) => (
                <div style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
                  <div
                    key={`${rowIndex}-${day}`}
                    className="w-[147px] h-[87px] p-2   rounded-md mx-1 mb-3  mt-2.5 "
                    style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
                  >
                    <div className="flex justify-between">
                      <span
                        className="font-medium text-[14px]"
                        style={{ color: "rgba(39, 16, 78, 1)" }}
                      >
                        {row[day].subject}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEdit(rowIndex, day)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDelete(rowIndex, day)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <div
                      className="text-[10px] font-light"
                      style={{ color: "rgba(39, 16, 78, 1)" }}
                    >
                      {row[day].teacher}
                    </div>
                    <div
                      className="text-[8px] "
                      style={{ color: "rgba(0, 0, 0, 0.6)" }}
                    >
                      {row[day].duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Create/Edit Timetable */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">
                {modalMode === "create" ? "Create Timetable" : "Edit Timetable"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Day Selection */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Select Day</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.day === day}
                      onChange={() => handleInputChange("day", day)}
                      className="mr-1"
                      disabled={modalMode === "edit"}
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Select Subject</label>
              <div className="relative">
                <select
                  className="w-full p-2 border rounded-md appearance-none pr-8"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Teacher Selection */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Select Teacher</label>
              <div className="relative">
                <select
                  className="w-full p-2 border rounded-md appearance-none pr-8"
                  value={formData.teacher}
                  onChange={(e) => handleInputChange("teacher", e.target.value)}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div className="flex mb-4 gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-2">Start Time</label>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md appearance-none pr-8"
                    value={formData.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    disabled={modalMode === "edit"}
                  >
                    <option value="">Select time</option>
                    <option value="08:30">08:30 am</option>
                    <option value="09:30">09:30 am</option>
                    <option value="10:30">10:30 am</option>
                    <option value="11:30">11:30 am</option>
                    <option value="12:30">12:30 pm</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm mb-2">End Time</label>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md appearance-none pr-8"
                    value={formData.endTime}
                    onChange={(e) =>
                      handleInputChange("endTime", e.target.value)
                    }
                    disabled={modalMode === "edit"}
                  >
                    <option value="">Select time</option>
                    <option value="09:15">09:15 am</option>
                    <option value="10:15">10:15 am</option>
                    <option value="11:15">11:15 am</option>
                    <option value="12:15">12:15 pm</option>
                    <option value="13:15">01:15 pm</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              className="w-full py-3 bg-blue-600 text-white rounded-md font-medium mt-4"
              onClick={handleSave}
            >
              {modalMode === "create" ? "Save" : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
