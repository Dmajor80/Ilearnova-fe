/**
 * Sidebars list groups; a group with several pages shows them as tabs at the
 * top of the page, so related screens share one sidebar link (e.g. Exams,
 * Results and Grading under "Exams & results").
 *
 * A group is { id, label, icon, tabs: [{ id, label }] }; a single-page group
 * has one tab.
 */

/** The group holding this tab id, or undefined. */
export const groupOf = (groups, tabId) => groups.find((g) => g.tabs.some((t) => t.id === tabId));

/** The tab itself, or undefined. */
export const tabOf = (groups, tabId) => groupOf(groups, tabId)?.tabs.find((t) => t.id === tabId);
