import { useState } from "react";
import { useParentChildTimetable, useParentChildren } from "@/hooks/parent";
import WeekTimetable from "@/components/timetable/WeekTimetable";
import ChildPicker from "../components/ChildPicker";
import { getParentChildName } from "../components/parentDisplayUtils";

/** A linked child's weekly timetable, the same one the child sees. */
export default function ParentTimetable() {
  const { children, loading: childrenLoading, error: childrenError } = useParentChildren();
  const [picked, setPicked] = useState("");
  const child = children.find((c) => String(c.id) === String(picked)) || children[0];
  const { days, loading, error } = useParentChildTimetable(child?.id);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 sm:p-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Timetable</h2>
          <p className="text-slate-600">
            {child ? `${getParentChildName(child)}'s lessons for the week.` : "Your child's lessons for the week."}
          </p>
        </div>
        <ChildPicker id="timetable-child" children={children} value={child?.id || ""} onChange={setPicked} />
      </header>
      {!childrenLoading && !childrenError && !children.length ? (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
          Link your child from My Children to see their timetable.
        </p>
      ) : (
        <WeekTimetable
          days={days}
          loading={childrenLoading || loading}
          error={(childrenError || error)?.message || ""}
          emptyText="The school hasn't published a timetable for this class yet."
        />
      )}
    </div>
  );
}
