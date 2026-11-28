import { useEffect, useState } from "react";
import { downloadStudentMaterial, getStudentMaterials } from "@/api/student";
import { apiErrorDetails } from "@/lib/apiHelpers";
import MaterialGroups from "@/components/materials/MaterialGroups";

const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);
const download = (m) => downloadStudentMaterial(m.id);

/**
 * Every material the student can see, one section per subject: subjects
 * without a class (e.g. French) included, and class-wide materials under
 * their class.
 */
export default function StudentMaterials() {
  const [materials, setMaterials] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentMaterials()
      .then((payload) => active && setMaterials(unwrap(payload)?.materials || []))
      .catch((err) => active && setError(apiErrorDetails(err).messages.join(" ")));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2 sm:p-4">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Course materials</h2>
        <p className="text-slate-600">Documents your teachers shared with your subjects and classes.</p>
      </header>
      <MaterialGroups
        materials={materials}
        error={error}
        download={download}
        emptyText="Materials your teachers share will appear here."
      />
    </div>
  );
}
