/** Present or late counts as attended, the same rule the backend uses. */
const attended = (record) => record.status === "present" || record.status === "late";
const percent = (part, whole) => (whole ? Math.round((part / whole) * 1000) / 10 : 0);

/** Groups records by `keyOf`, giving attended % per group in first-seen order. */
export function attendanceBy(records, keyOf, labelOf = keyOf) {
  const groups = new Map();
  for (const record of records) {
    const key = keyOf(record);
    const group = groups.get(key) || { key, label: labelOf(record), total: 0, attended: 0 };
    group.total += 1;
    if (attended(record)) group.attended += 1;
    groups.set(key, group);
  }
  return [...groups.values()].map((g) => ({ ...g, percentage: percent(g.attended, g.total) }));
}
