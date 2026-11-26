import { getParentChildName } from "./parentDisplayUtils";

/** Choose which linked child a page shows; hidden when there's only one. */
export default function ChildPicker({ id, children, value, onChange }) {
  if (children.length < 2) return null;
  return (
    <div className="text-sm text-slate-600">
      <label htmlFor={id}>Child</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block rounded-lg border bg-white px-3 py-2"
      >
        {children.map((child) => (
          <option key={child.id} value={child.id}>{getParentChildName(child)}</option>
        ))}
      </select>
    </div>
  );
}
