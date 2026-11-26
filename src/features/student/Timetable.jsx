import { useEffect, useState } from "react";
import { getStudentTimetable } from "@/api/student";
import { apiErrorDetails } from "@/lib/apiHelpers";
import WeekTimetable from "@/components/timetable/WeekTimetable";

const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);

/** The student's weekly timetable across their classes, as the school set it. */
export default function Timetable() {
  const [days, setDays] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentTimetable()
      .then((payload) => active && setDays(unwrap(payload)?.days || []))
      .catch((err) => active && setError(apiErrorDetails(err).messages.join(" ")));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 sm:p-4">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">My timetable</h2>
        <p className="text-slate-600">Your lessons for the week.</p>
      </header>
      <WeekTimetable
        days={days}
        loading={days === null && !error}
        error={error}
        emptyText="Your school hasn't published a timetable for your class yet."
      />
    </div>
  );
}
