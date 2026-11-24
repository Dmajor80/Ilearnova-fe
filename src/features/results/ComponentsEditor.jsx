import { Plus, Trash2 } from "lucide-react";
import { MAX_COMPONENTS, componentsTotal, fmt } from "./resultsUtils";

/**
 * Edit the score components that make up a subject total, e.g. CA 1 (50) +
 * CA 2 (50) + Exam (100) = 200. Controlled: `components` in, `onChange` out.
 */
export default function ComponentsEditor({ components, onChange, disabled = false }) {
  const update = (index, field, value) =>
    onChange(
      components.map((c, i) => {
        if (i !== index) return c;
        const next = { ...c, [field]: value };
        // A renamed component gets a fresh key from its new name (the
        // backend derives it). Keeping the old one left "CA 2" keyed "exam",
        // clashing with a new "Exam" and mislabelling upload columns.
        if (field === "label") delete next.key;
        return next;
      })
    );
  const remove = (index) => onChange(components.filter((_, i) => i !== index));
  const add = () => onChange([...components, { label: "", max: "" }]);
  const total = componentsTotal(components);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {components.map((component, index) => (
          <div key={index} className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`component-label-${index}`}>Component {index + 1} name</label>
            <input
              id={`component-label-${index}`}
              value={component.label}
              disabled={disabled}
              onChange={(e) => update(index, "label", e.target.value)}
              placeholder="e.g. CA 1"
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <label className="sr-only" htmlFor={`component-max-${index}`}>Component {index + 1} maximum</label>
            <input
              id={`component-max-${index}`}
              type="number"
              min="0"
              step="0.5"
              value={component.max}
              disabled={disabled}
              onChange={(e) => update(index, "max", e.target.value)}
              placeholder="Max"
              className="w-24 rounded-lg border px-3 py-2 text-right text-sm"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={disabled || components.length <= 1}
              aria-label={`Remove ${component.label || `component ${index + 1}`}`}
              className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={add}
          disabled={disabled || components.length >= MAX_COMPONENTS}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline disabled:opacity-40"
        >
          <Plus className="h-4 w-4" /> Add component
        </button>
        <p className="text-sm text-gray-700">
          Total: <span className="font-semibold">{fmt(total)}</span>
        </p>
      </div>
    </div>
  );
}
