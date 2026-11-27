/**
 * Tabs for the pages that share one sidebar link. Renders nothing for a
 * single page. `onSelect(tabId)` switches page (navigate, or set state).
 */
export default function SectionTabs({ group, activeId, onSelect, className = "" }) {
  if (!group || group.tabs.length < 2) return null;
  return (
    <nav aria-label={group.label} className={`flex gap-1 overflow-x-auto overflow-y-hidden border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      {group.tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(tab.id)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition ${
              active
                ? "text-blue-700 shadow-[inset_0_-2px_0_0_var(--color-blue-600)]"
                : "text-slate-600 hover:text-slate-900 hover:shadow-[inset_0_-2px_0_0_var(--color-slate-300)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
