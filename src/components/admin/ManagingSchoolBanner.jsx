import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { stopManagingSchool, useManagedSchool } from "@/lib/manageSchool";

/** Shown across the org dashboard while a superadmin manages a school. */
export default function ManagingSchoolBanner() {
  const managed = useManagedSchool();
  const navigate = useNavigate();
  if (!managed) return null;

  const exit = () => {
    stopManagingSchool();
    navigate("/admin-dashboard/organizations");
  };

  return (
    <div role="region" aria-label="Platform admin mode" className="fixed inset-x-0 top-0 z-[55] flex h-11 items-center justify-center gap-3 bg-indigo-700 px-4 text-sm text-white shadow-md">
      <ShieldCheck className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <p className="min-w-0 truncate">
        You're managing <strong className="font-semibold">{managed.name}</strong> as platform admin<span className="hidden md:inline">. Changes you make apply to this school</span>.
      </p>
      <button
        type="button"
        onClick={exit}
        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md bg-white/15 px-3 py-1 font-medium ring-1 ring-inset ring-white/30 hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" /> Exit
      </button>
    </div>
  );
}
