/** "1 school role", "1 class", "1 timetable entry", "3 students"; plural labels come from the API. */
export function countLabel(n, label) {
  if (n !== 1) return `${n} ${label}`;
  let one = label;
  if (/ies$/.test(label)) one = label.replace(/ies$/, "y");
  else if (/(ss|ch|sh|x)es$/.test(label)) one = label.replace(/es$/, "");
  else if (/s$/.test(label)) one = label.replace(/s$/, "");
  return `${n} ${one}`;
}
