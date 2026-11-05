export const unwrapParentResponse = (response) => response?.data ?? response;

export const getParentList = (response, keys = []) => {
  const data = unwrapParentResponse(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

export const getParentChildrenList = (response) =>
  getParentList(response, ["children", "students"]);

export const getParentAttendanceList = (response) =>
  getParentList(response, ["attendance", "records"]);

export const getParentGradesList = (response) =>
  getParentList(response, ["grades", "results"]);
