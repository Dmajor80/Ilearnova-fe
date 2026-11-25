/**
 * Tabs for the pages that share one sidebar link. Renders nothing for a
 * single page. `onSelect(tabId)` switches page (navigate, or set state).
 */
export default function SectionTabs({ group, activeId, onSelect, className = "" }) {
  if (!group || group.tabs.length < 2) return null;
  return (
    <nav aria-label={group.label} className={`flex gap-1 overflow-x-auto border-b border-slate-200 ${className}`}>
      {group.tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(tab.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition ${
              active ? "border-blue-600 text-blue-700" : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
