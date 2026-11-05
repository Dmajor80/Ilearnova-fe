export const getParentChildName = (child) => {
  const nested = child?.student || child?.user || {};
  return child?.name
    || [child?.first_name ?? nested.first_name, child?.last_name ?? nested.last_name]
      .filter(Boolean)
      .join(" ")
    || nested.name
    || child?.email
    || "Student";
};

export const getParentChildClass = (child) =>
  child?.class_name
  || child?.class_level
  || child?.class?.name
  || child?.grade
  || child?.current_class
  || "Class not provided";
