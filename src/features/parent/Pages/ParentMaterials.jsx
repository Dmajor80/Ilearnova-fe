import { useEffect, useState } from "react";
import { downloadParentChildMaterial, getParentChildMaterials } from "@/api/parent";
import { useParentChildren } from "@/hooks/parent";
import { apiErrorDetails } from "@/lib/apiHelpers";
import MaterialGroups from "@/components/materials/MaterialGroups";
import ChildPicker from "../components/ChildPicker";
import { getParentChildName } from "../components/parentDisplayUtils";

const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);

/** A linked child's course documents, the same ones the child sees. */
export default function ParentMaterials() {
  const { children, loading: childrenLoading, error: childrenError } = useParentChildren();
  const [picked, setPicked] = useState("");
  const child = children.find((c) => String(c.id) === String(picked)) || children[0];
  const childId = child?.id;
  const [loaded, setLoaded] = useState({ childId: null, materials: null, error: "" });

  useEffect(() => {
    if (!childId) return undefined;
    let active = true;
    getParentChildMaterials(childId)
      .then((payload) => active && setLoaded({ childId, materials: unwrap(payload)?.materials || [], error: "" }))
      .catch((err) => active && setLoaded({ childId, materials: null, error: apiErrorDetails(err).messages.join(" ") }));
    return () => {
      active = false;
    };
  }, [childId]);

  const current = loaded.childId === childId ? loaded : { materials: null, error: "" };
  const noChildren = !childrenLoading && !childrenError && !children.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2 sm:p-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Course materials</h2>
          <p className="text-slate-600">
            {child
              ? `Documents ${getParentChildName(child)}'s teachers shared with their subjects and classes.`
              : "Documents your child's teachers shared."}
          </p>
        </div>
        <ChildPicker id="materials-child" children={children} value={childId || ""} onChange={setPicked} />
      </header>
      {noChildren ? (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
          Link your child from My Children to see their course materials.
        </p>
      ) : (
        <MaterialGroups
          materials={childrenLoading ? null : current.materials}
          error={childrenError?.message || current.error}
          download={(m) => downloadParentChildMaterial(childId, m.id)}
          emptyText="Documents their teachers share will appear here."
        />
      )}
    </div>
  );
}
